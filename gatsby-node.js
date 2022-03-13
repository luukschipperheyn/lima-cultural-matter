const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);
const webpack = require(`webpack`);

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;
  const result = await graphql(`
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
  for ({node: project} of result.data.allDatoCmsProject.edges) {
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
        slug: result.data.datoCmsSiteConfig.defaultProject.slug,
      },
    });
  }
  await createPage({
    path: `/`,
    component: path.resolve(`./src/templates/project.js`),
    context: {
      slug: "index",
    },
  })
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
