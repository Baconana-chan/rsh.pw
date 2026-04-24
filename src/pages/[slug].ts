import { getLink, incrementLinkUses } from '../db/client';

export const GET = async ({ params, redirect }) => {
  const { slug } = params;

  if (!slug) {
    return redirect('/');
  }

  // Reserved words check
  if (['api', 'assets', 'favicon.ico', 'b', 'bundle', 'ru'].includes(slug)) {
    return new Response('Not found', { status: 404 });
  }

  const link = getLink(slug);

  if (link) {
    // Check expiration
    if (link.expires_at) {
      if (new Date() > new Date(link.expires_at)) {
        return redirect('/?error=expired');
      }
    }

    // Check usage limit
    if (link.max_uses > 0 && link.current_uses >= link.max_uses) {
      return redirect('/?error=limit_reached');
    }

    // Increment usage
    incrementLinkUses(slug);

    return redirect(link.url);
  }

  return redirect('/?error=not_found');
};
