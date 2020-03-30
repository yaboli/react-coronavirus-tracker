import React, { useState } from "react";
import ReactTooltip from "react-tooltip";

import "./styles.css";

import MapChart from "./components/MapChart";
import Navbar from "./components/Navbar";

function App() {
  const [content, setContent] = useState("");
  return (
    <div>
      <Navbar />
      <div className="container">
        <MapChart setTooltipContent={setContent} />
        <ReactTooltip>{content}</ReactTooltip>
      </div>
    </div>
  );
}

export default App