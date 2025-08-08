/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')('./i18n/request.ts');

const nextConfig = {
  async redirects() {
    return [
      {
        source: "/wizard",
        destination: "/wizard2",
        permanent: false,
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
