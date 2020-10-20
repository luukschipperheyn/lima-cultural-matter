import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React, { useEffect, useState } from "react";
import "../style/project.css";
import Draggable from "react-draggable";
import limaLogo from "../assets/LIMA_logo_staand_wit.png";

function handleLoad() {
  var divs = document.getElementsByClassName("window");
  var winWidth = window.innerWidth;
  var winHeight = window.innerHeight;

  for (var i = 0; i < divs.length; i++) {
    var thisDiv = divs[i];
    const randomTop = getRandomNumber(0, winHeight);
    const randomLeft = getRandomNumber(0, winWidth);
    thisDiv.style.top = randomTop + "px";
    thisDiv.style.left = randomLeft + "px";
  }

  function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }
}

/*
{
  "data": {
    "allprojects": {
      "edges": [
        {
          "node": {
            "slug": "rafaelrozendaal",
            "title": "Rafaël Rozendaal"
          }
        },
        {
          "node": {
            "slug": "luuk",
            "title": "Amalia Ulman"
          }
        }
      ]
    }
  },
  "extensions": {}
}
*/
export default ({ data }) => {
  useEffect(handleLoad, []);
  const project = data.datoCmsProject;
  const [openWindows, setOpenWindows] = useState(
    project.links.map((link) => link.open)
  );
  const [zIndexes, setZIndexes] = useState(project.links.map(() => 0));
  const [selectedWindow, setSelectedWindow] = useState(null);
  return (
    <div
      className="projectcontainer"
      style={{
        background: project.backgroundcolor.hex,
        color: project.textcolor.hex,
      }}
    >
      <div className="h1box1" style={{ background: project.menucolor.hex }}>
        <p>{project.title}</p>
        {/* 
        {" "}
        {data.allprojects.edges.filter((currentproject) => {
          return currentproject.node.slug !== project.slug;
        })
        .map((project, i) => {
          return (
            <div key={`project-${i}`}>
              <Link to={`/projects/${project.node.slug}`}>
                {project.node.title}
              </Link>
            </div>
        );
        }
        )}
         */}
      </div>

      <div
        className="h1box2"
        style={{
          background: project.menucolor.hex,
          color: project.textcolor.hex,
        }}
      >
        <p>Cultural Matter</p>
      </div>
      <div
        className="h1box3"
        style={{
          background: project.menucolor.hex,
          color: project.textcolor.hex,
        }}
      >
        <span class="helper"></span>{" "}
        <a href="https://www.li-ma.nl/lima/" target="_blank">
          {" "}
          <img className="limalink" src={limaLogo}></img>
        </a>
      </div>

      {/* links loopen */}
      {project.links.map((link, i) => {
        return (
          <Draggable>
            <div
              key={`link-${i}`}
              className={`window ${openWindows[i] ? "open" : ""} ${
                selectedWindow === i ? "selected" : ""
              }`}
              style={{ background: link.onecolor.hex, zIndex: zIndexes[i] }}
              onDoubleClick={() =>
                setOpenWindows(
                  openWindows.map((windowOpen, windowOpenIndex) =>
                    windowOpenIndex === i ? !windowOpen : windowOpen
                  )
                )
              }
              onMouseDownCapture={() => {
                const highestZIndex = zIndexes.reduce(
                  (acc, val) => (val > acc ? val : acc),
                  0
                );
                setZIndexes(
                  zIndexes.map((zIndex, zIndexIndex) =>
                    zIndexIndex === i ? highestZIndex + 1 : zIndex
                  )
                );
                setSelectedWindow(i);
              }}
            >
              <p style={{ color: project.textcolor.hex }}>{link.itemtitle}</p>

              <div
                className="box"
                style={{ height: link.height, width: link.width }}
              >
                {link.url && <iframe src={link.url} frameBorder="0"></iframe>}
                {link.image && <Img fluid={link.image.fluid} />}
              </div>
            </div>
          </Draggable>
        );
      })}
    </div>
  );
};

export const query = graphql`
  query ProjectQuery($slug: String!) {
    allprojects: allDatoCmsProject {
      edges {
        node {
          slug
          title
        }
      }
    }
    datoCmsProject: datoCmsProject(slug: { eq: $slug }) {
      title
      slug
      description
      backgroundcolor {
        hex
      }
      textcolor {
        hex
      }
      menucolor {
        hex
      }
      links {
        itemtitle
        url
        xposition
        yposition
        width
        height
        open
        onecolor {
          hex
        }
        image {
          fluid(maxWidth: 600, imgixParams: { fm: "jpg", auto: "compress" }) {
            ...GatsbyDatoCmsFluid
          }
        }
      }
    }
  }
`;
