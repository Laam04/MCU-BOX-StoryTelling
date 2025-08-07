import { tooltip } from "../utils.js";

export async function drawChart1(selectedPhase = "all") {
  const rawData = await d3.csv("data/MCU_BOX.csv");

  const data = rawData.map(d => {
    const [day, month, year] = d["Release Date"].split("/");
    return {
      releaseDate: new Date(+year, +month - 1, +day),
      title: d.Title,
      worldwideGross: +d["Worldwide Box Office"],
      phase: d.MCU_PHASE
    };
  });

  const filteredData = selectedPhase === "all"
    ? data
    : data.filter(d => d.phase === selectedPhase);

  d3.select("#chart1").html(""); // Limpiar gráfico anterior

  const margin = { top: 20, right: 30, bottom: 50, left: 60 },
        width = 800, height = 400;

  const svg = d3.select("#chart1").append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleTime()
    .domain(d3.extent(filteredData, d => d.releaseDate))
    .range([0, width - margin.left - margin.right]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(filteredData, d => d.worldwideGross)]).nice()
    .range([height - margin.top - margin.bottom, 0]);

  // Eje X
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
    .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%Y")));

  // Eje Y
  svg.append("g")
    .call(d3.axisLeft(y).tickFormat(d => `$${(d / 1e9).toFixed(1)}B`));

  // Línea de recaudación
  svg.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "#e50914")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(d => x(d.releaseDate))
      .y(d => y(d.worldwideGross))
      .curve(d3.curveMonotoneX));

  // Puntos interactivos
  svg.selectAll("circle")
    .data(filteredData).enter().append("circle")
    .attr("cx", d => x(d.releaseDate))
    .attr("cy", d => y(d.worldwideGross))
    .attr("r", 5)
    .attr("fill", "#fff")
    .attr("stroke", "#e50914")
    .on("mouseover", function (event, d) {
      tooltip.html(`<strong>${d.title}</strong><br>
        Fecha: ${d3.timeFormat("%b %Y")(d.releaseDate)}<br>
        Recaudación: $${(d.worldwideGross / 1e9).toFixed(2)}B`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 40 + "px")
        .style("opacity", 1);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));
}
