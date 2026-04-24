import {
    createBundle,
    getBundle,
    getBundleLinks,
    addBundleLink,
    clearBundleLinks,
    updateBundle,
    deleteBundle,
    slugExists,
    verifyBundlePassword
} from '../../db/client';
import { nanoid } from 'nanoid';

// Generate a human-readable recovery password
const generateRecoveryPassword = () => {
    const words = [
        'alpha', 'beta', 'gamma', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
        'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
        'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray',
        'yankee', 'zulu', 'red', 'blue', 'green', 'gold', 'silver', 'crystal',
        'nova', 'star', 'moon', 'sun', 'cloud', 'storm', 'ocean', 'river',
        'forest', 'mountain', 'desert', 'valley', 'island', 'lake', 'wave', 'fire'
    ];
    const word1 = words[Math.floor(Math.random() * words.length)];
    const word2 = words[Math.floor(Math.random() * words.length)];
    const number = Math.floor(Math.random() * 9000) + 1000;
    return `${word1}-${word2}-${number}`;
};

// GET - Get bundle data
export const GET = async ({ request }: { request: Request }) => {
    try {
        const url = new URL(request.url);
        const slug = url.searchParams.get('slug');

        if (!slug) {
            return new Response(JSON.stringify({ error: 'Slug is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const bundle = getBundle(slug);

        if (!bundle) {
            return new Response(JSON.stringify({ error: 'Bundle not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const links = getBundleLinks(slug);

        // Don't send password in response
        const { recovery_password, ...safeBundle } = bundle;

        return new Response(JSON.stringify({
            bundle: safeBundle,
            links
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// POST - Create new bundle
export const POST = async ({ request }: { request: Request }) => {
    try {
        const data = await request.json();
        const { title, description, links, theme, customSlug, bgStyle, cardStyle, buttonStyle } = data;

        if (!title || !title.trim()) {
            return new Response(JSON.stringify({ error: 'Title is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!links || !Array.isArray(links) || links.length === 0) {
            return new Response(JSON.stringify({ error: 'At least one link is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate all links
        for (const link of links) {
            if (!link.title || !link.url) {
                return new Response(JSON.stringify({ error: 'Each link must have a title and URL' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            try {
                new URL(link.url);
            } catch (e) {
                return new Response(JSON.stringify({ error: `Invalid URL: ${link.url}` }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        }

        // Generate or validate slug
        let slug = customSlug?.trim();
        if (slug) {
            if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
                return new Response(JSON.stringify({ error: 'Slug can only contain letters, numbers, dashes and underscores' }), {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (slugExists(slug)) {
                return new Response(JSON.stringify({ error: 'This slug is already taken' }), {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
        } else {
            // Generate unique slug
            slug = nanoid(8);
            while (slugExists(slug)) {
                slug = nanoid(8);
            }
        }

        const recoveryPassword = generateRecoveryPassword();

        // Create bundle
        createBundle(slug, title.trim(), description?.trim() || '', recoveryPassword, theme || 'blue', bgStyle || 'gradient', cardStyle || 'glass', buttonStyle || 'rounded');

        // Add links
        links.forEach((link, index) => {
            addBundleLink(slug, link.title, link.url, index, link.isHighlighted ? 1 : 0);
        });

        return new Response(JSON.stringify({
            slug,
            recoveryPassword,
            message: 'Bundle created successfully'
        }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('Bundle creation error:', e);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// PUT - Update bundle (requires password verification)
export const PUT = async ({ request }: { request: Request }) => {
    try {
        const data = await request.json();
        const { slug, password, title, description, links, theme, bgStyle, cardStyle, buttonStyle } = data;

        if (!slug || !password) {
            return new Response(JSON.stringify({ error: 'Slug and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const bundle = getBundle(slug);
        if (!bundle) {
            return new Response(JSON.stringify({ error: 'Bundle not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!verifyBundlePassword(slug, password)) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Update bundle if data provided
        if (title || description !== undefined || theme || bgStyle || cardStyle || buttonStyle) {
            updateBundle(
                slug,
                title?.trim() || bundle.title,
                description?.trim() ?? bundle.description,
                theme || bundle.theme,
                bgStyle || bundle.bg_style || 'gradient',
                cardStyle || bundle.card_style || 'glass',
                buttonStyle || bundle.button_style || 'rounded'
            );
        }

        // Update links if provided
        if (links && Array.isArray(links)) {
            // Validate links
            for (const link of links) {
                if (!link.title || !link.url) {
                    return new Response(JSON.stringify({ error: 'Each link must have a title and URL' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                try {
                    new URL(link.url);
                } catch (e) {
                    return new Response(JSON.stringify({ error: `Invalid URL: ${link.url}` }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
            }

            // Clear and re-add links
            clearBundleLinks(slug);
            links.forEach((link, index) => {
                addBundleLink(slug, link.title, link.url, index, link.isHighlighted ? 1 : 0);
            });
        }

        return new Response(JSON.stringify({
            message: 'Bundle updated successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('Bundle update error:', e);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

// DELETE - Delete bundle (requires password verification)
export const DELETE = async ({ request }: { request: Request }) => {
    try {
        const data = await request.json();
        const { slug, password } = data;

        if (!slug || !password) {
            return new Response(JSON.stringify({ error: 'Slug and password are required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!verifyBundlePassword(slug, password)) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        deleteBundle(slug);

        return new Response(JSON.stringify({
            message: 'Bundle deleted successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('Bundle deletion error:', e);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
