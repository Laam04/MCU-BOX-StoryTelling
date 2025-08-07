import { tooltip } from "../utils.js";

export function drawBubbleChart(selectedPhase = "all") {
  const margin = { top: 20, right: 30, bottom: 60, left: 60 },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  d3.select("#bubble-chart").html(""); // Limpiar gráfico anterior

  const svg = d3.select("#bubble-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/MCU_BOX.csv").then(data => {
    data.forEach(d => {
      d["Production Budget"] = +d["Production Budget"];
      d["Worldwide Box Office"] = +d["Worldwide Box Office"];
      d["ROI"] = +d["ROI"];
      d["MCU_PHASE"] = d["MCU_PHASE"];
    });

    // Filtro por fase
    const filtered = selectedPhase === "all"
      ? data
      : data.filter(d => d["MCU_PHASE"] === selectedPhase);

    const x = d3.scaleLinear()
      .domain(d3.extent(filtered, d => d["Production Budget"])).nice()
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain(d3.extent(filtered, d => d["Worldwide Box Office"])).nice()
      .range([height, 0]);

    const radius = d3.scaleSqrt()
      .domain(d3.extent(filtered, d => d.ROI))
      .range([5, 40]);

    const color = d3.scaleOrdinal(d3.schemeTableau10);

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("$.2s")));

    svg.append("g")
      .call(d3.axisLeft(y).tickFormat(d3.format("$.2s")));

    // Círculos
    svg.selectAll("circle")
      .data(filtered)
      .enter().append("circle")
      .attr("cx", d => x(d["Production Budget"]))
      .attr("cy", d => y(d["Worldwide Box Office"]))
      .attr("r", d => radius(d.ROI))
      .attr("fill", d => color(d["MCU_PHASE"]))
      .attr("opacity", 0.8)
      .attr("stroke", "#fff")
      .on("mouseover", function (event, d) {
        d3.select(this).attr("stroke", "#ff3c3c").attr("stroke-width", 2);
        tooltip.html(`<strong>${d.Title}</strong><br>
          Presupuesto: $${(d["Production Budget"]/1e6).toFixed(1)}M<br>
          Mundial: $${(d["Worldwide Box Office"]/1e6).toFixed(1)}M<br>
          ROI: ${d.ROI.toFixed(2)}`)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 40) + "px")
          .style("opacity", 1);
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
        tooltip.style("opacity", 0);
      });
  });
}
