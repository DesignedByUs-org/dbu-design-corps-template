/* eslint-disable import/no-extraneous-dependencies */
const sass = require("sass");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "Designed By Us Design Corp",
    description: `Directory highlights all under represented - scientist, technologists, engineers, artists, mathmeticians and designers`,
    siteUrl: `https://designcorps.designedbyus.org/`,
    // pathPrefix: "/design-corps-test"
  },
  plugins: [
    {
      resolve: "gatsby-source-twitter-profiles",
      options: {
        consumerKey: process.env.DBU_CONSUMER_KEY,
        consumerSecret: process.env.DBU_CONSUMER_SECRET,
        bearerToken: "AAAAAAAAAAAAAAAAAAAAAOH9KgEAAAAAVLvqXLj9bVwrQn3i0xwTIUvV9Yc%3Da1FxKJBXaKEhKuFZejm1CO5dy8BYwh4G2LCpLzXUo5Key8FPBU",
        twitterIdForFollowingList: "1337449516946087938",
      },
    },

    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          camelCase: false,
        },
        implementation: sass,
      },
    },
    `gatsby-plugin-lodash`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
      trackingId: process.env.WWD_GOOGLE_ANALYTICS_ID,
      },
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/dbu-favicon.png",
        injectHTML: true,
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          twitter: false,
          yandex: false,
          windows: false,
        },
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          `Space Mono`,
          `source sans pro:400`, // you can also specify font weights and styles 
        ],
      },
    },
  ],
};
