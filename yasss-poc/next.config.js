/** @type {import('next').NextConfig} */
module.exports = {
    async rewrites() {
      return [
        {
          source: '/:path*',
          destination: 'https://us-central1-westiecode.cloudfunctions.net/:path*',
        },
      ]
    },
  }
  
