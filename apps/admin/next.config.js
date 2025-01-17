/** @type {import('next').NextConfig} */

module.exports = {
   env: {
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    },
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: '**',
         },
      ],
   },
}
