/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NODE_ENV === 'development' && {
    logging: {
      fetches: {
        fullUrl: true,
      },
    },
  }),
}

export default nextConfig
