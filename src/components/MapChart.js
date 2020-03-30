import React, { useEffect, useState, memo } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  // Graticule
} from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";
const covidUrl = 
  "http://ec2-35-170-203-171.compute-1.amazonaws.com:5000/get-data";

const colorScale = scaleLinear()
  .domain([0, 10000])
  .range(["#ffedea", "#ff5233"]);

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    csv(covidUrl).then(data => {
      setData(data);
    });
  }, []);

  return (
    <ComposableMap
      data-tip="<p></p>"
      data-html={true}
      projectionConfig={{
        rotate: [-10, 0, 0],
        scale: 147
      }}
    >
        <ZoomableGroup>
          <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
          {/* <Graticule stroke="#E4E5E6" strokeWidth={0.5} /> */}
          {data.length > 0 && (
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const d = data.find(
                    s => (
                      s["Country/Region"] === geo.properties.NAME ||
                      s["Country/Region"] === geo.properties.NAME_LONG ||
                      s["Country/Region"] === geo.properties.ABBREV ||
                      s["Country/Region"] === geo.properties.FORMAL_EN ||
                      s["Country/Region"] === geo.properties.ISO_A2 ||
                      s["Country/Region"] === geo.properties.ISO_A3)
                    );
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(d["confirmed"]) : "#F5F4F6"}
                      onMouseEnter={() => {
                        const { NAME } = geo.properties;
                        setTooltipContent(`<h6>${NAME}</h6>
                                           <li>Confirmed: ${d ? d["confirmed"] : 0}</li>
                                           <li>Deaths: ${d ? d["deaths"] : 0}</li>
                                           <li>Recovered: ${d ? d["recovered"] : 0}</li>`);
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
  );
}

export default memo(MapChart);
