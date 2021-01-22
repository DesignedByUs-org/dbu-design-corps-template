import React from "react";
import { Helmet } from "react-helmet";
import "../styles/index.scss";

const Layout = ({ children }) => (
  <>
    <Helmet
      title="DesignedByUs | Design Corps"
      meta={[
        {
          property: "description",
          content:
            "Directory highlights all under represented - scientist, technologists, engineers, artists, mathmeticians and designers.",
        },
        { property: "og:title", content: "DBU Design Corps" },
        {
          property: "og:description",
          content:
            "Directory highlights all under represented - scientist, technologists, engineers, artists, mathmeticians and designers.",
        },

        {
          property: "og:image",
          content: "..static/opengraph.png",
        },
        {
          property: "og:url",
          content: "https://womenwho.design",
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "DBU Design Corps" },
        { property: "twitter:site", content: "@DBU_DesignCorps" },
        { property: "twitter:creator", content: "@julesforrest" },
        { property: "twitter:card", content: "summary_large_image" },
        {
          property: "twitter:image",
          content: "..static/opengraph.png",
        },
      ]}
    />

    
    {children}
  </>
);

export default Layout;
