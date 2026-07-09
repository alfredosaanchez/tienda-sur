/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Reemplaza esto por el dominio de tu proyecto Supabase
        // Ejemplo: abcxyzcompany.supabase.co
        hostname: "**.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;
