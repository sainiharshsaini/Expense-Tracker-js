/** @type {import('next').NextConfig} */
const nextConfig = {
    images: { // we did it
        remotePatterns: [
            {
                protocol: "https",
                hostname: "randomuser.me"
            }
        ]
    }
};

export default nextConfig;
