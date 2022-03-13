import dayjs from "dayjs";
import { graphql } from "gatsby";
import Img from "gatsby-image";
import { HelmetDatoCms } from "gatsby-source-datocms";
import React, { useEffect, useState, useCallback } from "react";
import Draggable from "react-draggable";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import bg from "../assets/bg.svg";
import limaLogo from "../assets/LIMA_logo_staand_zwart.png";
import { DoubleClickP } from "../components/double-click-p";
import "../style/project.css";

const isBrowser = typeof window !== "undefined"

const Project = ({ data }) => {
  const project = data.datoCmsProject;
  const [openWindows, setOpenWindows] = useState(
    project.links.map((link) => link.open)
  );
  const [globalClock, setGlobalClock] = useState(0);
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
      x: !isBrowser ? 0 :
        link.xposition !== null
          ? Math.max(0, (link.xposition / 100) * window.innerWidth)
          : Math.max(0, Math.random() * (window.innerWidth - link.width)),
      y: !isBrowser ? 0 :
        link.yposition !== null
          ? Math.max(0, (link.yposition / 100) * window.innerHeight)
          : Math.max(0, Math.random() * (window.innerHeight - 600)),
    }))
  );
  const [selectedWindow, setSelectedWindow] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [showAbout, setShowAbout] = useState(true);
  const selectWindow = useCallback((i) => {
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
  }, [zIndexes, setZIndexes, setSelectedWindow]);
  useEffect(() => {
    const timeout = setTimeout(() => setGlobalClock(globalClock + 1));
    const now = dayjs();
    setCountdowns(c =>
      project.links.map((link, i) => {
        if (!link.startTime) {
          return 0;
        }
        const then = dayjs(link.startTime);
        const diff = then.diff(now, "second");
        if (c[i] > 0 && diff === 0) {
          selectWindow(i);
        }
        return Math.max(0, diff);
      })
    );
    return () => clearTimeout(timeout);
  }, [globalClock, project.links, selectWindow]);
  const [accessGranted, setAccessGranted] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);

  if (!accessGranted) {
    return (
      <div
        className="projectcontainer"
        style={{
          // background: project.backgroundcolor.hex,
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
        }}
      >
        <Draggable
          onStart={() => setDragging(true)}
          onStop={(e) => {
            setDragging(false);
          }}
          handle=".window-title"
          defaultPosition={{ x: 200, y: 200 }}
          bounds="parent"
        >
          <div
            className={`window open selected`}
            style={{
              background: project.menucolor.hex,
              color: project.textcolor.hex,
            }}
          >
            <p
              className="window-title"
              style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                background: project.textcolor.hex,
                color: project.menucolor.hex,
              }}
            >
              <span>Welcome to Transformation Digital Art!</span>
            </p>

            <div
              className="box"
              style={{
                padding: "32px 0px",
                width: 400,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <div
                style={{ textAlign: "center", marginBottom: 16 }}
                dangerouslySetInnerHTML={{
                  __html: project.passwordMessageNode.childMarkdownRemark.html,
                }}
              />
              <div style={{}}>
                <input
                  style={{ height: 30 }}
                  type="password"
                  onChange={(e) => setPasswordInput(e.target.value)}
                  value={passwordInput}
                />
                <div
                  style={{
                    height: 36,
                    display: "inline-flex",
                    cursor: "pointer",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0px 16px",
                    marginLeft: 16,
                    background: project.textcolor.hex,
                    color: project.menucolor.hex,
                  }}
                  onClick={() => {
                    setAccessGranted(passwordInput === project.password);
                    setShowPasswordError(passwordInput !== project.password);
                    setPasswordInput("");
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyPress={() => {
                    setAccessGranted(passwordInput === project.password);
                    setShowPasswordError(passwordInput !== project.password);
                    setPasswordInput("");
                  }}
                >
                  Enter
                </div>
              </div>
              {showPasswordError && (
                <div style={{ marginTop: 16 }}>Incorrect password</div>
              )}
            </div>
          </div>
        </Draggable>
      </div>
    );
  }

  return (
    <div
      className="projectcontainer"
      style={{
        // background: project.backgroundcolor.hex,
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
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
          role="button"
          tabIndex={0}
          onKeyPress={() => setShowAbout(!showAbout)}
        >
          <span className="bottom-menu--title-text">
            Transformation Digital Art
          </span>
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
        <a href="https://www.li-ma.nl/lima/" target="_blank" rel="noreferrer">
          {" "}
          <img className="limalink" src={limaLogo} alt="lima logo"></img>
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
            bounds="parent"
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
              <DoubleClickP
                className="window-title"
                onMouseDownCapture={() => {
                  selectWindow(i);
                }}
                onTouchStartCapture={() => {
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
                  <span style={{ display: "inline-block", marginLeft: 20 }}>
                    {FormatSecondsAsDurationString(countdowns[i])}
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
              </DoubleClickP>

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
                      <Img fluid={link.preStartImage.fluid} alt="counting down.."/>
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
                    {!!link.url && (
                      <>
                        {link.url.toLowerCase().endsWith("pdf") ? (
                          <embed
                            src={link.url}
                            type="application/pdf"
                            width="100%"
                            height="100%"
                          />
                        ) : (
                          <iframe
                            title={link.itemtitle}
                            style={dragging ? { pointerEvents: "none" } : {}}
                            src={link.url}
                            frameBorder="0"
                            scrolling={link.enableScroll ? "yes" : "no"}
                            allowFullScreen
                          ></iframe>
                        )}
                      </>
                    )}
                    {link.image && link.image.fluid && (
                      <Img fluid={link.image.fluid} alt={link.itemtitle}/>
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
      password
      passwordMessageNode {
        childMarkdownRemark {
          html
        }
      }
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

function FormatSecondsAsDurationString(seconds) {
  var s = "";

  var days = Math.floor(seconds / 3600 / 24);
  if (days >= 1) {
    // s += days.toString() + " day" + (days == 1 ? "" : "s") + " + ";
    seconds -= days * 24 * 3600;
  }

  var hours = Math.floor(seconds / 3600);
  s += GetPaddedIntString((hours + days * 24).toString(), 2) + ":";
  seconds -= hours * 3600;

  var minutes = Math.floor(seconds / 60);
  s += GetPaddedIntString(minutes.toString(), 2) + ":";
  seconds -= minutes * 60;

  s += GetPaddedIntString(Math.floor(seconds).toString(), 2);

  return s;
}

function GetPaddedIntString(n, numDigits) {
  var nPadded = n;
  for (; nPadded.length < numDigits; ) {
    nPadded = "0" + nPadded;
  }

  return nPadded;
}

export default Project