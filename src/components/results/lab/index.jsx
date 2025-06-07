//import inputData from "./input";

import { useEffect, useRef } from "react";
import Script from "next/script";
import { arrow } from "@floating-ui/react";
//import { processResults } from "./utils";

//processResults();

const dibujar = (container) => {
  var nodes = new window.vis.DataSet([
    {
      id: 1,
      label: "Node 1",
      color: {
        background: "#ff0000",
      },
      shape: "box",
    },
    { id: 2, label: "Node 2" },
    { id: 3, label: "Node 3" },
    { id: 4, label: "Node 4" },
    { id: 5, label: "Node 5" },
    { id: 6, label: "Node 6" },
    { id: 7, label: "Node 7" },
    { id: 8, label: "Node 8" },
    { id: 9, label: "Node 9" },
    { id: 10, label: "Node 10" },
  ]);

  // create an array with edges
  var edges = new window.vis.DataSet([
    { from: 1, to: 2 },
    { from: 2, to: 3 },
    { from: 3, to: 4 },
    { from: 4, to: 5 },
    { from: 5, to: 1 },
    { from: 6, to: 7 },
    { from: 7, to: 8 },
    { from: 8, to: 9 },
    { from: 9, to: 6 },
  ]);

  // create a network

  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    nodes: {
      color: {
        background: "#00ff00",
      },
      shape: "circle",
    },
    edges: {
      arrows: "to",
    },
  };
  var network = new vis.Network(container, data, options);
};

const Lab = () => {
  const containerNode = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/vis-network/standalone/umd/vis-network.min.js";
    script.onload = () => {
      dibujar(containerNode.current);
    };
    document.body.appendChild(script);
  }, []);
  return (
    <>
      lAB
      <div
        className="w-full h-[600px] bg-white border border-gray-600"
        ref={containerNode}
      ></div>
    </>
  );
};

export default Lab;
