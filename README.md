# 📊 Marvel Box Office Storytelling

**Un proyecto de visualización interactiva** que explora la evolución del Universo Cinematográfico de Marvel (MCU) desde la perspectiva de la taquilla, la crítica y la rentabilidad.

## 🚀 Objetivo

Analizar cómo ha crecido el MCU a través de los años, identificar sus películas más exitosas, comparar inversión vs retorno, y entender cómo la crítica ha acompañado (o no) este fenómeno.

## 📁 Estructura

| Archivo | Descripción |
|--------|-------------|
| `index.html` | Página principal con la narrativa y visualizaciones. |
| `main.js` | Código que genera los gráficos con D3.js. |
| `style.css` | Estilos personalizados inspirados en el estilo visual de Marvel. |
| `data/MCU_BOX.csv` | Dataset con recaudación, presupuesto, ROI, crítica y más. *(debes agregarlo)* |
| `assets/` | Imágenes decorativas de las películas del MCU. |
| `js/charts/` | (Próximo paso) Archivos JS por gráfico. |

## 📊 Dataset

**Fuente**: [Kaggle - MCU Box Office Dataset]https://www.kaggle.com/datasets/davidgdong/marvel-cinematic-universe-box-office-dataset

Incluye columnas como:
- `Title`
- `Release Date`
- `Worldwide Box Office`
- `Production Budget`
- `ROI`
- `MCU_PHASE`
- `TOMATO_METER`

## 🧠 Tecnologías utilizadas

- **HTML5 / CSS3**
- **D3.js v7** para gráficos interactivos.
- **Scrollama.js** (pronto) para storytelling basado en scroll.
- Visual estilo *modo oscuro* con transiciones suaves.

## ✨ Créditos

Desarrollado por Alejandro Alava y Carmen Valeriano.  
Inspirado por NYTimes: *How the Virus Got Out* y el estilo visual de *Rockstar Games*.

## 🛠 Cómo ejecutar

1. Clona o descarga este repositorio.
2. Coloca el archivo `MCU_BOX.csv` en la carpeta `/data`.
3. Abre `index.html` en tu navegador.

## 📌 Próximas mejoras (roadmap)

- Scroll narrativo activador de secciones (`Scrollama.js`).
- Filtros dinámicos por fase/personaje.
- Modularización del código JS.
