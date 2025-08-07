// resumen.js
export function showDatasetSummary() {
  d3.csv("data/MCU_BOX.csv").then(data => {
    const total = data.length;

    const fechas = data.map(d => {
      const [day, month, year] = d["Release Date"].split("/");
      return new Date(+year, +month - 1, +day);
    });

    const años = fechas.map(f => f.getFullYear());
    const añoMin = d3.min(años);
    const añoMax = d3.max(años);

    const fases = [...new Set(data.map(d => d.MCU_PHASE))].sort();

    const criticas = data.map(d => +d["TOMATO_METER"]).filter(v => !isNaN(v));
    const promedioCritica = d3.mean(criticas);

    const resumen = `
      <div class="data-summary-box">
        <strong>Total de películas:</strong> ${total}<br>
        <strong>Años cubiertos:</strong> ${añoMin} - ${añoMax}<br>
        <strong>Fases representadas:</strong> ${fases.join(", ")}<br>
        <strong>Puntaje crítico promedio:</strong> ${(promedioCritica * 100).toFixed(1)}%
      </div>
    `;

    d3.select("#data-summary").html(resumen);
  });
}
