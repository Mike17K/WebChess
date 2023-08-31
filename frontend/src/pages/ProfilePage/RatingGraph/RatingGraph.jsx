import React, { useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';

export default function RatingGraph() {
  useEffect(() => {
    const myDiv = document.getElementById('tester');

    const N = 100;

    var trace = {
      x: Array.from({ length: N }, (_, i) => i),
      y: Array.from({ length: N }, (_, i) => 2300 + Math.random() * 500),
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      fillcolor: 'rgb(51, 153, 51)'
    };

    var data = [trace];

    var layout = {
      margin: { t: 30, b: 30, l: 40, r: 30 },
      xaxis: {
        showgrid: false,
      },
      yaxis: {
        showgrid: false,
        // Set the tick values for the y-axis
        tickvals: Array.from({ length: 10 }, (_, i) => (i + 1) * 500), // Generates [100, 200, 300, ..., 2000]
      },
    };

    var config = {
      staticPlot: true
    };

    Plotly.newPlot(myDiv, data, layout, config);
  }, []);

  return <div id="tester" className="w-full h-full"></div>;
}
