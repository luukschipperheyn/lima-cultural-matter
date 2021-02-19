const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const webpack = require(`webpack`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  return new Promise((resolve, reject) => {
    graphql(`
      {
        datoCmsSiteConfig {
          defaultProject {
            slug
          }
        }
        allDatoCmsProject {
          edges {
            node {
              slug
            }
          }
        }
      }
    `)
      .then((result) => {
        createRedirect({
          fromPath: "/",
          toPath: `/projects/${result.data.datoCmsSiteConfig.defaultProject.slug}`,
          isPermanent: false,
          redirectInBrowser: true,
        });
        result.data.allDatoCmsProject.edges.map(({ node: project }) => {
          createPage({
            path: `projects/${project.slug}`,
            component: path.resolve(`./src/templates/project.js`),
            context: {
              slug: project.slug,
            },
          });
        });
      })
      .then(resolve);
  });
};
