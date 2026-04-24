import { verifyBundlePassword, getBundle } from '../../db/client';

// POST - Verify bundle password for recovery
export const POST = async ({ request }) => {
    try {
        const data = await request.json();
        const { slug, password } = data;

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

        const isValid = verifyBundlePassword(slug, password);

        if (!isValid) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Password verified successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (e) {
        console.error('Bundle verification error:', e);
        return new Response(JSON.stringify({ error: 'Server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};
