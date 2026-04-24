import { createLink, getLink } from '../../db/client';
import { nanoid } from 'nanoid';

export const POST = async ({ request }) => {
  try {
    const data = await request.json();
    const url = data.url;

    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), { status: 400 });
    }

    let slug = data.slug;
    if (!slug) {
      slug = nanoid(6);
    } else {
      // Check if slug exists
      const existing = getLink(slug);
      if (existing) {
        return new Response(JSON.stringify({ error: 'Slug already taken' }), { status: 409 });
      }
    }

    const expiresAt = data.expiresAt || null;
    const maxUses = parseInt(data.maxUses) || 0;

    try {
      createLink(slug, url, expiresAt, maxUses);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Error creating link' }), { status: 500 });
    }

    return new Response(JSON.stringify({ slug }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
};
