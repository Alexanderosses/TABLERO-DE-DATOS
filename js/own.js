import { fetchApi } from "./fetch.js";

// Variable global para almacenar el gráfico
let chart;

// Función para renderizar los datos y el gráfico
async function renderData(event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
  try {
    const anio = document.querySelector('#anio').value;
    const urlAnio = selectAnio(anio); // Obtener la URL correspondiente al año seleccionado

    console.log("Rendering data for year:", anio, "URL:", urlAnio);

    const data = await fetchApi(urlAnio); // Realizar la solicitud a la API

    //const fechas = data.serie.map(indicador => indicador.fecha);
    //const valores = data.serie.map(indicador => parseInt(indicador.valor, 10));

    // Convertir los valores a números enteros
    const valores = data.serie.map(indicador => parseInt(indicador.valor, 10));

    // Convertir las fechas a objetos Date y formatearlas a "YYYY-MM" (año-mes)
    const fechas = data.serie.map(indicador => formatDateToYearMonth(indicador.fecha));

    // Si ya hay un gráfico, destrúyelo antes de crear uno nuevo
    if (chart) {
      chart.destroy();
    }

    // cambio de color de las barra segun tramo
    const rgbaRedColor = "rgba(255, 99, 132, .2)";
    const rgbRedColor = "rgba(255, 99, 132, 1)";

    const rgbaOrangeColor = "rgba(255, 159, 64, .2)";
    const rgbOrangeColor = "rgba(255, 159, 64, 1)";

    const rgbaVioletColor = "rgba(153, 102, 255, .2)";
    const rgbVioletColor = "rgba(153, 102, 255, 1)";


    const rgbaGreenColor = "rgba(54, 162, 235, 0.2)";
    const rgbGreenColor = "rgba(54, 162, 235, 1)";

    // aplicamos color a las barras de graficos
    const backgroundColors = data.serie.map(indicador =>
      indicador > 900 ? rgbaRedColor :
      indicador > 800 ? rgbaGreenColor :
      indicador > 780 ? rgbaVioletColor :
      rgbaOrangeColor
    );

    const borderColors =  data.serie.map(indicador => 
      indicador > 900 ? rgbRedColor :
      indicador > 800 ? rgbGreenColor :
      indicador > 780 ? rgbVioletColor :
      rgbOrangeColor
    );


    // Configurar el gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [{
          label: 'Valor del Dólar',
          data: valores,
          borderWidth: 1,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
          hoverBorderColor: 'rgba(54, 162, 235, 1)',
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para seleccionar la URL de la API según el año
function selectAnio(anio) {
  switch (anio) {
    case "2022":
      return "https://mindicador.cl/api/dolar/2022";
    case "2021":
      return "https://mindicador.cl/api/dolar/2021";
    case "2020":
      return "https://mindicador.cl/api/dolar/2020";
    case "2019":
      return "https://mindicador.cl/api/dolar/2019";
    case "2018":
      return "https://mindicador.cl/api/dolar/2018";
    case "2017":
      return "https://mindicador.cl/api/dolar/2017";
    case "2016":
      return "https://mindicador.cl/api/dolar/2016";
    case "2015":
      return "https://mindicador.cl/api/dolar/2015";
    case "2014":
      return "https://mindicador.cl/api/dolar/2014";
    case "2013":
      return "https://mindicador.cl/api/dolar/2013";
    default:
      return "https://mindicador.cl/api/dolar/2023";
  }
}
// Función para formatear la fecha a "YYYY-MM" (año-mes)
function formatDateToYearMonth(date) {
  return new Date(date).toISOString().slice(0, 10);
}

// Agregar un event listener para el evento submit del formulario
document.querySelector('#formulario').addEventListener('submit', renderData);