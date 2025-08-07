import { tooltip } from "../utils.js";

export function drawDensityChart(selectedPhase = "all") {
  d3.select("#densityChart").html(""); // Limpiar contenedor

  const margin = { top: 60, right: 30, bottom: 60, left: 70 },
        width = 800,
        height = 500;

  d3.csv("data/MCU_BOX.csv").then(data => {
    const cleanData = data.map(d => ({
      title: d.Title,
      score: +d["TOMATO_METER"],
      phase: d.MCU_PHASE
    })).filter(d => !isNaN(d.score) && d.score >= 0.4 && d.score <= 1);

    // Filtro por fase
    const filtered = selectedPhase === "all"
      ? cleanData
      : cleanData.filter(d => d.phase === selectedPhase);

    const svg = d3.select("#densityChart").append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear().domain([0.4, 1.0]).range([0, width]);

    const kde = kernelDensityEstimator(kernelEpanechnikov(0.03), x.ticks(60));
    const density = kde(filtered.map(d => d.score));

    const y = d3.scaleLinear()
      .domain([0, d3.max(density, d => d[1])])
      .range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format(".0%")));

    svg.append("g")
      .call(d3.axisLeft(y));

    // Curva KDE
    svg.append("path")
      .datum(density)
      .attr("fill", "#e5243f")
      .attr("opacity", 0.5)
      .attr("stroke", "#e5243f")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .curve(d3.curveBasis)
        .x(d => x(d[0]))
        .y(d => y(d[1]))
      );

    // Puntos individuales (con animación)
    svg.selectAll("circle")
      .data(filtered)
      .enter().append("circle")
      .attr("cx", d => x(d.score))
      .attr("cy", height + 5)
      .attr("r", 5)
      .attr("fill", d => color(d.phase))
      .attr("stroke", "#fff")
      .attr("opacity", 0.85)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 40)
      .attr("cy", d => y(0) - 15);

    // Tooltips
    svg.selectAll("circle")
      .on("mouseover", (event, d) => {
        tooltip
          .html(`<strong>${d.title}</strong><br>
                 Tomatometer: ${(d.score * 100).toFixed(0)}%<br>
                 Fase ${d.phase}`)
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 40 + "px")
          .style("opacity", 1);
      })
      .on("mouseout", () => tooltip.style("opacity", 0));

    // Funciones KDE
    function kernelDensityEstimator(kernel, X) {
      return function (V) {
        return X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
      };
    }

    function kernelEpanechnikov(k) {
      return function (v) {
        v /= k;
        return Math.abs(v) <= 1 ? 0.75 * (1 - v * v) / k : 0;
      };
    }
  });
}
