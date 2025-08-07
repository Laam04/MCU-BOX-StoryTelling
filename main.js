import { drawChart1 } from './charts/chart1_recaudacion.js';
import { drawBubbleChart } from './charts/chart2_burbujas.js';
import { drawBoxplot } from './charts/chart3_boxplot.js';
import { drawDensityChart } from './charts/chart4_criticas.js';
import { drawTopROIChart } from '../charts/chart5_topROI.js';
import { showDatasetSummary } from './resumen.js';

// === Estado del filtro actual ===
let currentPhaseFilter = "all";

// === Renderizar gráficos con filtro actual ===
function renderAllCharts() {
  drawChart1(currentPhaseFilter);
  drawBubbleChart(currentPhaseFilter);
  drawDensityChart(currentPhaseFilter);
  drawBoxplot();        // No depende del filtro
  drawTopROIChart();    // No depende del filtro
}

// === Inicialización ===
showDatasetSummary();
renderAllCharts();

// === Evento: cambio en filtro de fase ===
document.getElementById("faseSelector").addEventListener("change", (e) => {
  currentPhaseFilter = e.target.value;
  drawChart1(currentPhaseFilter);
  drawBubbleChart(currentPhaseFilter);
  drawDensityChart(currentPhaseFilter);
});
