import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React, { useState } from "react";
import Draggable from "react-draggable";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import limaLogo from "../assets/LIMA_logo_staand_wit.png";
import "../style/project.css";
import { HelmetDatoCms } from "gatsby-source-datocms";

export default ({ data }) => {
  const project = data.datoCmsProject;
  if (typeof window === "undefined") {
    return <HelmetDatoCms seo={project.seoMetaTags} />;
  }
  const [openWindows, setOpenWindows] = useState(
    project.links.map((link) => link.open)
  );
  const [zIndexes, setZIndexes] = useState(
    project.links.map((link) =>
      link.zIndex !== null ? link.zIndex : link.open ? 0 : 1
    )
  );
  const [defaultPositions] = useState(
    project.links.map((link) => ({
      x:
        link.xposition !== null
          ? link.xposition
          : Math.max(0, Math.random() * (window.innerWidth - link.width)),
      y:
        link.yposition !== null
          ? link.yposition
          : Math.max(0, Math.random() * (window.innerHeight - 600)),
    }))
  );
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const selectWindow = (i) => {
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
  };
  return (
    <div
      className="projectcontainer"
      style={{
        background: project.backgroundcolor.hex,
        color: project.textcolor.hex,
      }}
    >
      <HelmetDatoCms seo={project.seoMetaTags} />
      {/* <div className="h1box1" style={{ background: project.menucolor.hex }}>
        <p>{project.title}</p> */}
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
      {/* Toevoegen dropdown Rafael */}
      <div
        className="h1box1"
        style={{
          background: project.menucolor.hex,
        }}
      >
        <p
          className="top-menu--title"
          onClick={() => setShowProjects(!showProjects)}
          style={{
            color: project.textcolor.hex,
          }}
        >
          <span className="top-menu--title-text">{project.title}</span>
          <span className="top-menu--icon">
            {!showProjects && <FaChevronDown />}
            {showProjects && <FaChevronUp />}
          </span>
        </p>
        {showProjects && (
          <p className="top-menu--body">
            {" "}
            {data.allprojects.edges
              .filter((currentproject) => {
                return currentproject.node.slug !== project.slug;
              })
              .map((otherProject, i) => {
                return (
                  <div key={`project-${i}`}>
                    <Link
                      style={{
                        color: project.textcolor.hex,
                      }}
                      to={`/projects/${otherProject.node.slug}`}
                    >
                      {otherProject.node.title}
                    </Link>
                  </div>
                );
              })}
          </p>
        )}
      </div>

      <div
        className="h1box2 bottom-menu"
        style={{
          background: project.menucolor.hex,
          color: project.textcolor.hex,
        }}
      >
        <p
          className="bottom-menu--title"
          onClick={() => setShowAbout(!showAbout)}
        >
          <span className="bottom-menu--title-text">Cultural Matter</span>
          <span className="bottom-menu--icon">
            {showAbout && <FaChevronDown />}
            {!showAbout && <FaChevronUp />}
          </span>
        </p>
        {showAbout && (
          <p className="bottom-menu--body">
            Digital culture keeps on coming up with the newest, the best and the
            fastest. But what do we know about its history? Artists have been
            designing, critiquing and manipulating new technologies for decades.
            Work by earlier Internet artists, post-Internet artists, hackers and
            media activists is no longer always understood in the light of the
            current state of technology, while it still has a lot to say about
            contemporary technology – and art. These ‘media artists’ have left
            their mark on our current society through their critical use of new
            technologies. Thanks to their awareness of, and break with, art
            history, they can justifiably be called the new avant-garde.
            Cultural Matter highlights the enduring expressive power of digital
            artworks: works in which art and technology and the past and the
            future come together in a way that is as logical as it is
            groundbreaking.
          </p>
        )}
      </div>
      <div
        className="h1box3"
        style={{
          background: project.menucolor.hex,
          color: project.textcolor.hex,
        }}
      >
        <span className="helper"></span>{" "}
        <a href="https://www.li-ma.nl/lima/" target="_blank">
          {" "}
          <img className="limalink" src={limaLogo}></img>
        </a>
      </div>

      {/* links loopen */}
      {project.links.map((link, i) => {
        return (
          <Draggable
            onStart={() => setDragging(true)}
            onStop={(e) => {
              setDragging(false);
            }}
            handle=".window-title"
            defaultPosition={defaultPositions[i]}
            bounds={{ top: 0 }}
            key={`project=${i}`}
          >
            <div
              key={`link-${i}`}
              className={`window ${openWindows[i] ? "open" : ""} ${
                selectedWindow === i ? "selected" : ""
              }`}
              style={{
                background: link.onecolor ? link.onecolor.hex : undefined,
                zIndex: zIndexes[i],
                boxShadow: link.shadowCss ? link.shadowCss : undefined,
                color: link.textColor ? link.textColor.hex : undefined,
                visibility: link.hidden ? "hidden" : undefined,
              }}
            >
              <p
                className="window-title"
                onMouseDownCapture={() => {
                  selectWindow(i);
                }}
                onDoubleClick={() =>
                  setOpenWindows(
                    openWindows.map((windowOpen, windowOpenIndex) =>
                      windowOpenIndex === i ? !windowOpen : windowOpen
                    )
                  )
                }
                style={{
                  color: link.windowTitleTextColor
                    ? link.windowTitleTextColor.hex
                    : project.textcolor.hex,
                }}
              >
                {link.itemtitle}
              </p>

              <div
                className="box"
                style={{ height: link.height, width: link.width }}
              >
                {link.textNode && (
                  <div
                    className="box-text"
                    style={{
                      background: link.onecolor ? link.onecolor.hex : undefined,
                    }}
                    dangerouslySetInnerHTML={{
                      __html: link.textNode.childMarkdownRemark.html,
                    }}
                  />
                )}
                {link.url && (
                  <iframe
                    style={dragging ? { pointerEvents: "none" } : {}}
                    src={link.url}
                    frameBorder="0"
                    scrolling="no"
                  ></iframe>
                )}
                {link.image && link.image.fluid && (
                  <Img fluid={link.image.fluid} />
                )}
                {link.image && link.image.video && (
                  <video
                    autoPlay={link.autoplay}
                    loop={link.autoplay}
                    muted={link.autoplay}
                    controls={!link.autoplay}
                    src={link.image.video.mp4Url}
                  />
                )}
                {selectedWindow !== i && (
                  <div
                    className="window--overlay"
                    onMouseDownCapture={() => {
                      selectWindow(i);
                    }}
                  ></div>
                )}
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
        autoplay
        zIndex
        shadowCss
        textColor {
          hex
        }
        windowTitleTextColor {
          hex
        }
        hidden
        textNode {
          childMarkdownRemark {
            html
          }
        }
        onecolor {
          hex
        }
        image {
          fluid(maxWidth: 600, imgixParams: { fm: "jpg", auto: "compress" }) {
            ...GatsbyDatoCmsFluid
          }
          video {
            mp4Url(res: medium)
          }
        }
      }
      seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
