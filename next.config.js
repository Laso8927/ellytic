/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ["en", "de", "el", "nl"],
    defaultLocale: "en",
  },
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
module.exports = nextConfig;
