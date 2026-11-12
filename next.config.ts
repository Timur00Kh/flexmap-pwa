import type { NextConfig } from 'next';
const nextConfig: NextConfig = { output:'export', trailingSlash:true, basePath:'/flexmap-pwa', images:{unoptimized:true} };
export default nextConfig;
