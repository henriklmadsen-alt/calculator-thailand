export const GET = () => {
  const publicKey = import.meta.env.VAPID_PUBLIC_KEY || '';
  const configured = publicKey.trim().length > 0;

  return new Response(
    JSON.stringify({
      publicKey: configured ? publicKey : null,
      configured,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': configured ? 'public, max-age=3600' : 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  );
};
