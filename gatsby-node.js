const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const webpack = require(`webpack`);

exports.createPages = ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  return new Promise((resolve, reject) =>
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
        Promise.all(
          result.data.allDatoCmsProject.edges.map(async ({ node: project }) => {
            await createPage({
              path: `projects/${project.slug}`,
              component: path.resolve(`./src/templates/project.js`),
              context: {
                slug: project.slug,
              },
            });
            await createPage({
              path: `/${project.slug}`,
              component: path.resolve(`./src/templates/project.js`),
              context: {
                slug: project.slug,
              },
            });
          })
        );
      })
      .then(() =>
        createPage({
          path: `/`,
          component: path.resolve(`./src/templates/project.js`),
          context: {
            slug: "index",
          },
        })
      )
      .then(resolve)
  );
};

//gatsby-node.js
exports.onCreateWebpackConfig = ({ actions }) => {
  const { setWebpackConfig } = actions;
  setWebpackConfig({
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      }),
    ],
    resolve: {
      alias: {
        // bind version of jquery-ui
        "jquery-ui": path.join(
          __dirname,
          "node_modules/jquery-ui/jquery-ui.js"
        ),
        draggable: path.join(
          __dirname,
          "node_modules/jquery-ui/ui/widgets/draggable"
        ),
        // bind to modules;
        modules: path.join(__dirname, "node_modules"),
      },
    },
  });
};
