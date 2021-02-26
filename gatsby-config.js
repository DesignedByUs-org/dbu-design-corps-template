/* eslint-disable import/no-extraneous-dependencies */
const sass = require("sass");
require("dotenv").config();

module.exports = {
  siteMetadata: {
    title: "Designed By Us Design Corp",
    description: `Directory highlights all under represented - scientist, technologists, engineers, artists, mathmeticians and designers`,
    siteUrl: `https://designcorps.designedbyus.org/`,
    pathPrefix: "/design-corps-test"
  },
  plugins: [
    {
      resolve: "gatsby-source-twitter-profiles",
      options: {
        consumerKey: process.env.DBU_CONSUMER_KEY,
        consumerSecret: process.env.DBU_CONSUMER_SECRET,
        bearerToken: process.env.DBU_BEARER_TOKEN,
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
  
    // {
    //   resolve: `gatsby-plugin-feed`,
    //   options: {
    //     feeds: [
          // {
            // serialize: ({ query: { allSeeker } }) => {
            //   return allSeeker.edges.map((edge) => {
            //     return {
            //       ...edge.node.job,
            //       title: `${edge.node.job.company.name}, ${edge.node.job.job_title}`,
            //       description: `${edge.node.job.company.name} is hiring a ${edge.node.job.job_title} in ${edge.node.job.job_location}.`,
            //       date: edge.node.job.creation_date,
            //       url: `https://womenwho.design/${edge.node.fields.slug}`,
            //       guid: `https://womenwho.design/${edge.node.fields.slug}`,
            //     };
            //   });
            // },
            // query: `
            //   {
            //     allSeeker(sort: { fields: job___creation_date, order: DESC }) {
            //       edges {
            //         node {
            //           id
            //           fields {
            //             slug
            //           }
            //           job {
            //             job_title
            //             job_location
            //             creation_date
            //             company {
            //               name
            //             }
            //           }
            //         }
            //       }
            //     }
            //   }
            // `,
            // output: "/rss.xml",
            // title: "Women Who Design Job Board",
          // },
      //   ],
      // },
    // },
  ],
};
