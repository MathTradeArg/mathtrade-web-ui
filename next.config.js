/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    PAUSED_SITE: "no",
    CAN_I_TEST_MODE: "yes",
    //
    API_TEST_MODE: "no",
    API_MOCK_MODE: "yes",
    BASE_URL_TEST: "",
    BASE_URL_MOCK: "/",
    BASE_URL: "",
    //
    GOOGLE_RECAPTCHA_CLIENT_KEY: "6LeWcz8gAAAAAGgpOiINIJZSwsmKH-eMjtbQbFbF",
    //
    LINK_HELP_BGG:
      "https://boardgamegeek.com/thread/3007435/math-trade-argentina-abril-2023",
    LINK_HELP_TELEGRAM: "https://t.me/+vy8WiP3QbFtjNDhh",
    LINK_HELP_VIDEO: "https://www.youtube.com/watch?v=L1ri5Wz_HYw",
    LINK_HELP_ORGANIZATION: "https://t.me/MTorganizacion",
  },
  reactStrictMode: false,
};

module.exports = nextConfig;
