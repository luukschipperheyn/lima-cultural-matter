import { graphql, Link } from "gatsby";
import Img from "gatsby-image";
import React, { useEffect, useState } from "react";
import Draggable from "react-draggable";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import limaLogo from "../assets/LIMA_logo_staand_zwart.png";
import "../style/project.css";
import { HelmetDatoCms } from "gatsby-source-datocms";
import dayjs from "dayjs";

export default ({ data }) => {
  const project = data.datoCmsProject;
  if (typeof window === "undefined") {
    return <HelmetDatoCms seo={project.seoMetaTags} />;
  }
  const [openWindows, setOpenWindows] = useState(
    project.links.map((link) => link.open)
  );
  const [globalClock, setGlobalClock] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => setGlobalClock(globalClock + 1));
    const now = dayjs();
    setCountdowns(
      project.links.map((link, i) => {
        if (!link.startTime) {
          return 0;
        }
        const then = dayjs(link.startTime);
        const diff = then.diff(now, "second");
        if (countdowns[i] > 0 && diff === 0) {
          selectWindow(i);
        }
        return Math.max(0, diff);
      })
    );
    return () => clearTimeout(timeout);
  }, [globalClock]);
  const [countdowns, setCountdowns] = useState(
    project.links.map((link) => dayjs(link.startTime).diff(dayjs(), "second"))
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
  // const [accessGranted, setAccessGranted] = useState(false);
  // const [passwordInput, setPasswordInput] = useState('')

  // if (!accessGranted) {
  //   return (
  //     <div
  //       className="projectcontainer"
  //       style={{
  //         background: project.backgroundcolor.hex,
  //         color: project.textcolor.hex,
  //       }}
  //     >
  //       <div>
  //         <h1>Unfold</h1>
  //         <h2>Enter Passord</h2>
  //         <input
  //           type="password"
  //           onChange={e => setPasswordInput(e.target.value)}
  //           value={passwordInput}
  //         />
  //         <div onClick={}></div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div
      className="projectcontainer"
      style={{
        background: project.backgroundcolor.hex,
        color: project.textcolor.hex,
      }}
    >
      <HelmetDatoCms seo={project.seoMetaTags} />
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
          <span className="bottom-menu--title-text">Unfold</span>
          <span className="bottom-menu--icon">
            {showAbout && <FaChevronDown />}
            {!showAbout && <FaChevronUp />}
          </span>
        </p>
        {showAbout && (
          <p className="bottom-menu--body">{project.description}</p>
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
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <span>{link.itemtitle}</span>
                {!!countdowns[i] && (
                  <span>
                    {new Date(countdowns[i] * 1000).toISOString().substr(11, 8)}
                  </span>
                )}
                {!!countdowns[i] && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: 0,
                      height: 2,
                      right: 0,
                      width: countdowns[i],
                      background: link.windowTitleTextColor
                        ? link.windowTitleTextColor.hex
                        : project.textcolor.hex,
                    }}
                  />
                )}
              </p>

              <div
                className="box"
                style={{
                  height: link.height
                    ? !!countdowns[i]
                      ? link.height * 0.75
                      : link.height
                    : !!countdowns[i]
                    ? 100
                    : 200,
                  width: link.width
                    ? !!countdowns[i]
                      ? link.width * 0.75
                      : link.width
                    : !!countdowns[i]
                    ? 200
                    : 400,
                }}
              >
                {!!countdowns[i] && (
                  <>
                    {link.preStartImage && link.preStartImage.fluid && (
                      <Img fluid={link.preStartImage.fluid} />
                    )}
                    {link.preStartMessageNode && (
                      <div
                        className="box-text"
                        style={{
                          background: link.onecolor
                            ? link.onecolor.hex
                            : undefined,
                        }}
                        dangerouslySetInnerHTML={{
                          __html:
                            link.preStartMessageNode.childMarkdownRemark.html,
                        }}
                      />
                    )}
                  </>
                )}
                {!countdowns[i] && (
                  <>
                    {link.textNode && (
                      <div
                        className="box-text"
                        style={{
                          background: link.onecolor
                            ? link.onecolor.hex
                            : undefined,
                        }}
                        dangerouslySetInnerHTML={{
                          __html: link.textNode.childMarkdownRemark.html,
                        }}
                      />
                    )}
                    {link.url && link.url.toLowerCase().endsWith("pdf") ? (
                      <embed
                        src={link.url}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                      />
                    ) : (
                      <iframe
                        style={dragging ? { pointerEvents: "none" } : {}}
                        src={link.url}
                        frameBorder="0"
                        scrolling={link.enableScroll ? "yes" : "no"}
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
                  </>
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
        enableScroll
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
        preStartImage {
          fluid(maxWidth: 600, imgixParams: { fm: "jpg", auto: "compress" }) {
            ...GatsbyDatoCmsFluid
          }
        }
        startTime
        preStartMessageNode {
          childMarkdownRemark {
            html
          }
        }
      }
      seoMetaTags {
        ...GatsbyDatoCmsSeoMetaTags
      }
    }
  }
`;
