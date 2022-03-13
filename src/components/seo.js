import React from 'react'
import { HelmetDatoCms } from "gatsby-source-datocms";

export const Seo = ({project} ) => (<HelmetDatoCms seo={project.seoMetaTags}>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-C1LFNKNT7W"></script>
  <script>
    {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-C1LFNKNT7W');
    `}
  </script>
</HelmetDatoCms>)