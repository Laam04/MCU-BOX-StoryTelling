// utils.js
export const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0)
  .style("position", "absolute")
  .style("background", "#333")
  .style("color", "#fff")
  .style("padding", "8px 12px")
  .style("border-radius", "4px")
  .style("pointer-events", "none")
  .style("font-size", "0.9rem")
  .style("z-index", 1000);
