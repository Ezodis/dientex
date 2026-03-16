/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // Only add rewrite if API URL is configured
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL not set, API calls will fail');
      return [];
    }

    // Normalize: strip trailing slashes and any /api suffix, then add /api once
    const base = apiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
    const normalizedBase = base.startsWith('http') ? base : `https://${base}`;
    const destination = `${normalizedBase}/api/:path*`;

    console.log('API rewrite configured:', { source: '/api/:path*', destination });

    return [
      {
        source: '/api/:path*',
        destination,
      },
    ]
  },
}

export default nextConfig
