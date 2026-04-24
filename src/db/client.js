import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('rsh.db');
const db = new Database(dbPath);

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS links (
    slug TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add expiration and usage limits columns to links
try {
  db.exec(`ALTER TABLE links ADD COLUMN expires_at DATETIME`);
} catch (e) { }

try {
  db.exec(`ALTER TABLE links ADD COLUMN max_uses INTEGER DEFAULT 0`);
} catch (e) { }

try {
  db.exec(`ALTER TABLE links ADD COLUMN current_uses INTEGER DEFAULT 0`);
} catch (e) { }

// Bundles table (link collections like Linktree)
db.exec(`
  CREATE TABLE IF NOT EXISTS bundles (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    recovery_password TEXT NOT NULL,
    theme TEXT DEFAULT 'blue',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add new customization columns if they don't exist
try {
  db.exec(`ALTER TABLE bundles ADD COLUMN bg_style TEXT DEFAULT 'gradient'`);
} catch (e) { /* column already exists */ }

try {
  db.exec(`ALTER TABLE bundles ADD COLUMN card_style TEXT DEFAULT 'glass'`);
} catch (e) { /* column already exists */ }

try {
  db.exec(`ALTER TABLE bundles ADD COLUMN button_style TEXT DEFAULT 'rounded'`);
} catch (e) { /* column already exists */ }

// Bundle links table
db.exec(`
  CREATE TABLE IF NOT EXISTS bundle_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bundle_slug TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bundle_slug) REFERENCES bundles(slug) ON DELETE CASCADE
  )
`);

try {
  db.exec(`ALTER TABLE bundle_links ADD COLUMN is_highlighted INTEGER DEFAULT 0`);
} catch (e) { }

export const createLink = (slug, url, expiresAt = null, maxUses = 0) => {
  const stmt = db.prepare('INSERT INTO links (slug, url, expires_at, max_uses) VALUES (?, ?, ?, ?)');
  return stmt.run(slug, url, expiresAt, maxUses);
};

export const getLink = (slug) => {
  const stmt = db.prepare('SELECT * FROM links WHERE slug = ?');
  return stmt.get(slug);
};

export const incrementLinkUses = (slug) => {
  const stmt = db.prepare('UPDATE links SET current_uses = current_uses + 1 WHERE slug = ?');
  return stmt.run(slug);
};

export const getLinkCount = () => {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM links');
  return stmt.get().count;
};

// Bundle functions
export const createBundle = (slug, title, description, recoveryPassword, theme = 'blue', bgStyle = 'gradient', cardStyle = 'glass', buttonStyle = 'rounded') => {
  const stmt = db.prepare('INSERT INTO bundles (slug, title, description, recovery_password, theme, bg_style, card_style, button_style) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  return stmt.run(slug, title, description, recoveryPassword, theme, bgStyle, cardStyle, buttonStyle);
};

export const getBundle = (slug) => {
  const stmt = db.prepare('SELECT * FROM bundles WHERE slug = ?');
  return stmt.get(slug);
};

export const updateBundle = (slug, title, description, theme, bgStyle, cardStyle, buttonStyle) => {
  const stmt = db.prepare('UPDATE bundles SET title = ?, description = ?, theme = ?, bg_style = ?, card_style = ?, button_style = ? WHERE slug = ?');
  return stmt.run(title, description, theme, bgStyle, cardStyle, buttonStyle, slug);
};

export const deleteBundle = (slug) => {
  // Delete links first
  const deleteLinksStmt = db.prepare('DELETE FROM bundle_links WHERE bundle_slug = ?');
  deleteLinksStmt.run(slug);
  // Delete bundle
  const deleteBundleStmt = db.prepare('DELETE FROM bundles WHERE slug = ?');
  return deleteBundleStmt.run(slug);
};

// Bundle Link functions
export const addBundleLink = (bundleSlug, title, url, sortOrder = 0, isHighlighted = 0) => {
  const stmt = db.prepare('INSERT INTO bundle_links (bundle_slug, title, url, sort_order, is_highlighted) VALUES (?, ?, ?, ?, ?)');
  return stmt.run(bundleSlug, title, url, sortOrder, isHighlighted);
};

export const getBundleLinks = (bundleSlug) => {
  const stmt = db.prepare('SELECT * FROM bundle_links WHERE bundle_slug = ? ORDER BY sort_order ASC, id ASC');
  return stmt.all(bundleSlug);
};

export const updateBundleLink = (id, title, url, sortOrder, isHighlighted) => {
  const stmt = db.prepare('UPDATE bundle_links SET title = ?, url = ?, sort_order = ?, is_highlighted = ? WHERE id = ?');
  return stmt.run(title, url, sortOrder, isHighlighted, id);
};

export const deleteBundleLink = (id) => {
  const stmt = db.prepare('DELETE FROM bundle_links WHERE id = ?');
  return stmt.run(id);
};

export const clearBundleLinks = (bundleSlug) => {
  const stmt = db.prepare('DELETE FROM bundle_links WHERE bundle_slug = ?');
  return stmt.run(bundleSlug);
};

export const verifyBundlePassword = (slug, password) => {
  const bundle = getBundle(slug);
  if (!bundle) return false;
  return bundle.recovery_password === password;
};

export const slugExists = (slug) => {
  const link = getLink(slug);
  const bundle = getBundle(slug);
  return !!(link || bundle);
};
