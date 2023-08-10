import { fetchApi } from "./fetch.js";

// Variable global para almacenar el gráfico
let chart;

// Función para renderizar los datos y el gráfico
async function renderData(event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
  try {
    const anio = document.querySelector('#anio').value;
    const urlAnio = selectAnio(anio); // Obtener la URL correspondiente al año seleccionado
    const data = await fetchApi(urlAnio); // Realizar la solicitud a la API

    //const fechas = data.serie.map(indicador => indicador.fecha);
    //const valores = data.serie.map(indicador => parseInt(indicador.valor, 10));

    // Convertir los valores a números enteros
    const valores = data.serie.map(indicador => parseInt(indicador.valor, 10));

    // Convertir las fechas a objetos Date y formatearlas a "MM-DD" (mes-dia)
    const diaMes = data.serie.map(indicador => formatDateToYearMonth(indicador.fecha));

    // Si existe un gráfico, lo destruimos antes de crear uno nuevo
    if (chart) {
      chart.destroy();
    }

    // Colores para ChartJS
    Chart.defaults.color = 'rgba(255, 255, 235, 0.5)';
    Chart.defaults.font.size = 12;
    Chart.defaults.borderColor = 'rgba(255, 255, 235, 0.025)';

    // Configurar el gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: diaMes,
        datasets: [{
          //label: 'Valor del Dólar observado',
          data: valores,
          borderWidth: 1,
          backgroundColor: 'rgba(255, 255, 235, 0.25)',
          //borderColor: 'rgba(255, 255, 235, 0.0)',
          hoverBackgroundColor: 'rgba(54, 162, 235, 0.4)',
          hoverBorderColor: 'rgba(54, 162, 235, 1)',
        }]
      },
      
      options: {
        plugins: {
          legend: {
            display: false // sacamos el label title
          },
          tooltip: {
            callbacks: {
              beforeTitle: function(context){
                return "Dólar observado";
              },
              title: function(context){
                console.log(context[0].label);
                return anio + "-" + context[0].label ;
              },
              label: function(context) {
                let label = context.dataset.label || ' ';
                  if (label) {
                      label += 'Valor: ';
                  }
                  if (context.parsed.y !== null) {
                      label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                  }
                  return label;
                }                
              }
            }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        },     
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
// Función para formatear la fecha a "YYYY-MM" (año-dia-mes)
function formatDateToYearMonth(diaMes) {
  return new Date(diaMes).toISOString().slice(5, 10); // retornamos desde el indice 5 al 10 la fecha
}

// Agregar un event listener para el evento submit del formulario
document.querySelector('#formulario').addEventListener('submit', renderData);