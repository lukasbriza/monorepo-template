/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add monorepo packages to transpile here, e.g. '@lukasbriza/theme'.
  transpilePackages: [],
  experimental: {
    serverComponentsExternalPackages: ['next-runtime-env'],
  },
}

export default nextConfig
