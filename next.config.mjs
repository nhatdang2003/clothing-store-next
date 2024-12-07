/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/ecommerce-fashion/**',
            },
            {
                protocol: 'https',
                hostname: "res.cloudinary.com",
                pathname: "/db9vcatme/**",
            },

        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    experimental: {
        staleTimes: {
            dynamic: 0,
        },
    },
};

export default nextConfig;
