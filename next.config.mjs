/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: '/', destination: '/portfolio.html' }
      ]
    };
  }
};
export default nextConfig;
