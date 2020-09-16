import { graphql } from "gatsby";
import React from "react";

export default ({ data }) => (
  <div>
    <h1>{data.datoCmsProject.title}</h1>
    <div>
      {data.datoCmsProject.links.map((linkNode) => {
        return <div>{JSON.stringify(linkNode)}</div>;
      })}
    </div>
  </div>
);

export const query = graphql`
  query ProjectQuery($slug: String!) {
    datoCmsProject(slug: { eq: $slug }) {
      title
      links {
        url
        xposition
        yposition
      }
    }
  }
`;
