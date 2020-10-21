import { graphql, Link } from "gatsby";
import React from "react";

const IndexPage = ({ data }) => (
  <div>
    {/* <ul>
      {data.allDatoCmsProject.edges.map(({ node: project }, index) => (
        <li>
          <Link to={`/projects/${project.slug}`}>{project.title}</Link>
        </li>
      ))}
    </ul> */}
    Redirecting...
  </div>
);

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    allDatoCmsProject {
      edges {
        node {
          id
          title
          slug
        }
      }
    }
  }
`;
