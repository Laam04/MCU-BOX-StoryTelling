import { tooltip } from "../utils.js";

export function drawTopROIChart() {
  const data = [
    { title: "Avengers: Endgame", roi: 6.2, budget: "$356M" },
    { title: "Black Panther", roi: 5.9, budget: "$200M" },
    { title: "Spider-Man: No Way Home", roi: 5.5, budget: "$200M" },
    { title: "Iron Man", roi: 5.3, budget: "$140M" },
    { title: "The Avengers", roi: 5.1, budget: "$220M" },
    { title: "Captain Marvel", roi: 4.9, budget: "$175M" },
    { title: "Doctor Strange", roi: 4.5, budget: "$165M" },
    { title: "Guardians of the Galaxy", roi: 4.4, budget: "$170M" },
    { title: "Ant-Man", roi: 4.1, budget: "$130M" },
    { title: "Shang-Chi", roi: 2.9, budget: "$150M" }
  ];

  // Margen más grande arriba para que entre el título
  const margin = { top: 50, right: 30, bottom: 50, left: 200 },
        width = 800 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom; // un poco más alto

  d3.select("#chart").html(""); // Limpiar gráfico anterior

  const svg = d3.select("#chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const y = d3.scaleBand()
    .domain(data.map(d => d.title))
    .range([0, height])
    .padding(0.2);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.roi)])
    .range([0, width]);

  // Ejes
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0).tickPadding(10));

  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  // Barras
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", 0)
    .attr("y", d => y(d.title))
    .attr("width", d => x(d.roi))
    .attr("height", y.bandwidth())
    .attr("fill", "#e62429")
    .on("mouseover", (event, d) => {
      tooltip.html(`<strong>${d.title}</strong><br>ROI: ${d.roi}<br>Presupuesto: ${d.budget}`)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 30 + "px")
        .style("opacity", 1);
    })
    .on("mouseout", () => tooltip.style("opacity", 0));

  // Título (más grande y con margen suficiente)
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -20) // espacio extra sobre el gráfico
    .attr("text-anchor", "middle")
    .attr("fill", "#fff")
    .style("font-size", "22px")
    .style("font-weight", "bold")
    .text("Top 10 Películas del MCU más rentables por ROI");
}
