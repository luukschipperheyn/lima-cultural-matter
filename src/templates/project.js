import { graphql } from "gatsby";
import React, { useEffect } from "react";
import $ from "jquery";
import "../style/project.css";

require("jquery-ui");
require("jquery-ui/ui/widgets/draggable");

function handleLoad() {
  // deze functie wordt uitgevoerd zodra de pagina is geladen
  var highestZIndex = 0;

  $(".window").draggable();
  $(".window").on("mousedown", function() {
    $(".window").removeClass("selected");
    $(this).addClass("selected");
    $(this).css("z-index", ++highestZIndex);
  });
  $(".window").dblclick(function() {
    $(this).toggleClass("open");
  });

  // collect all the divs
  var divs = document.getElementsByClassName("window");
  // get window width and height
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

export default ({ data }) => {
  useEffect(handleLoad, []); // dit stukje roept de functie handleLoad aan zodra de pagina is geladen
  const project = data.datoCmsProject; // prop de data uit datoCMS in de variabele project voor de handigheid. (const is een coole manier van 'var' gebruiken als je weet dat de waarde ervan constant gaat blijven)
  return (
    <>
      <h1>{project.title}</h1>
      <p>{project.description}</p>

      {/* hier ga je loopen over elke Link */}
      {project.links.map((link, i) => {
        return (
          // dit stukje html wordt gegenereerd voor elke Link:
          <div
            className="window"
            key={`link-${i}`}
            style={{ backgroundColor: link.color }}
          >
            <div
              className="box"
              style={{ height: link.height, width: link.width }}
            >
              <iframe src={link.url}></iframe>
            </div>
          </div>
        );
      })}
    </>
  );
};

export const query = graphql`
  query ProjectQuery($slug: String!) {
    datoCmsProject(slug: { eq: $slug }) {
      title
      description
      windowcolor {
        hex
      }
      links {
        url
        xposition
        yposition
        width
        height
      }
    }
  }
`;
