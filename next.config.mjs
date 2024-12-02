/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                pathname: '/bucket-quickstart_protean-garage-432716-r3/ecommerce-fashion/**',
            },
            {
                protocol: 'https',
                hostname: "res.cloudinary.com",
                pathname: "/db9vcatme/**",
            },
        ],
    }
};

export default nextConfig;
