import { createLink, getLink } from '../../db/client';
import { nanoid } from 'nanoid';

export const POST = async ({ request }: { request: Request }) => {
    try {
        const data = await request.json();
        const urls = data.urls;
        const expiresAt = data.expiresAt || null;
        const maxUses = parseInt(data.maxUses) || 0;

        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            return new Response(JSON.stringify({ error: 'URLs array required' }), { status: 400 });
        }

        if (urls.length > 50) {
            return new Response(JSON.stringify({ error: 'Max 50 URLs per batch' }), { status: 400 });
        }

        const results = [];

        for (const url of urls) {
            if (!url || typeof url !== 'string' || !url.trim()) continue;
            const trimmedUrl = url.trim();

            try {
                // Validation
                try {
                    new URL(trimmedUrl);
                } catch (e) {
                    results.push({ url: trimmedUrl, error: 'Invalid URL' });
                    continue;
                }

                let slug = nanoid(6);
                // Retry if collision
                let attempts = 0;
                while (getLink(slug) && attempts < 3) {
                    slug = nanoid(6);
                    attempts++;
                }
                if (getLink(slug)) {
                    results.push({ url: trimmedUrl, error: 'Failed to generate slug' });
                    continue;
                }

                createLink(slug, trimmedUrl, expiresAt, maxUses);
                results.push({ url: trimmedUrl, slug: slug });
            } catch (e) {
                results.push({ url: trimmedUrl, error: 'Server error' });
            }
        }

        return new Response(JSON.stringify({ results }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
};
