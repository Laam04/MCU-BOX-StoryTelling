export function drawBoxplot() {
  const margin = { top: 60, right: 40, bottom: 80, left: 70 },
        width = 900 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

  d3.select("#roi-boxplot-container").html(""); // Limpiar gráfico anterior

  const svg = d3.select("#roi-boxplot-container")
    .append("svg")
    .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  d3.csv("data/MCU_BOX.csv").then(dataset => {
    dataset.forEach(entry => {
      entry.ROI = +entry.ROI;
      entry.PhaseLabel = "Fase " + entry.MCU_PHASE;
    });

    const groupedData = d3.groups(dataset, d => d.PhaseLabel);

    const xScale = d3.scaleBand()
      .domain(groupedData.map(d => d[0]))
      .range([0, width])
      .padding(0.5);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset, d => d.ROI) * 1.1])
      .nice()
      .range([height, 0]);

    // Ejes
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg.append("g")
      .call(d3.axisLeft(yScale));

    // Etiquetas
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Fase del MCU");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", -50)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text("Retorno de Inversión (ROI)");

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", -30)
      .attr("text-anchor", "middle")
      .attr("fill", "#ffd700")
      .style("font-size", "20px")
      .text("Distribución de ROI por Fase del MCU");

    // Boxplot por fase
    groupedData.forEach(([phase, items]) => {
      const roiValues = items.map(d => d.ROI).sort(d3.ascending);
      const q1 = d3.quantile(roiValues, 0.25);
      const median = d3.quantile(roiValues, 0.5);
      const q3 = d3.quantile(roiValues, 0.75);
      const iqr = q3 - q1;
      const min = Math.max(d3.min(roiValues), q1 - 1.5 * iqr);
      const max = Math.min(d3.max(roiValues), q3 + 1.5 * iqr);
      const xCenter = xScale(phase) + xScale.bandwidth() / 2;

      // Caja
      svg.append("rect")
        .attr("x", xScale(phase))
        .attr("y", yScale(q3))
        .attr("height", yScale(q1) - yScale(q3))
        .attr("width", xScale.bandwidth())
        .attr("fill", "#00d9ff44")
        .attr("stroke", "#00d9ff");

      // Bigotes y línea media
      svg.append("line").attr("x1", xCenter).attr("x2", xCenter).attr("y1", yScale(min)).attr("y2", yScale(max)).attr("stroke", "#fff");
      svg.append("line").attr("x1", xCenter - 10).attr("x2", xCenter + 10).attr("y1", yScale(max)).attr("y2", yScale(max)).attr("stroke", "#fff");
      svg.append("line").attr("x1", xCenter - 10).attr("x2", xCenter + 10).attr("y1", yScale(min)).attr("y2", yScale(min)).attr("stroke", "#fff");
      svg.append("line").attr("x1", xScale(phase)).attr("x2", xScale(phase) + xScale.bandwidth()).attr("y1", yScale(median)).attr("y2", yScale(median)).attr("stroke", "#fff").attr("stroke-width", 2);
    });
  });
}
