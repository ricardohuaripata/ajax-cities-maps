// MISMA FUNCIONALIDAD QUE EL ARCHIVO cities.js PERO USANDO JQUERY EN VEZ DE XMLHttpRequest
const GOOGLE_API_KEY = "";
const RAPID_API_KEY = "";
const RAPID_API_HOST = "wft-geo-db.p.rapidapi.com";

var input_ciudad = document.getElementById("input_ciudad");
var sugerencias = document.getElementsByClassName("sugerencia");

var timeoutId;
var waitTime = 500;
var shouldCallApi = false;

var poblacionesEncontradas = [sugerencias.length];

// Añadimos manejar de eventos keyup al input de ciudad
input_ciudad.addEventListener("keyup", function () {
  shouldCallApi = true;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(function () {
    if (shouldCallApi) {
      $.ajax({
        url:"https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=" + sugerencias.length +
          "&countryIds=ES&namePrefix=" + input_ciudad.value + "&sort=-population&languageCode=es",
        type: "GET",
        headers: {
          "X-RapidAPI-Key": RAPID_API_KEY,
          "X-RapidAPI-Host": RAPID_API_HOST,
        },
        success: function (data) {

          for (let i = 0; i < sugerencias.length; i++) {
            if (i < data.data.length) {
              poblacionesEncontradas[i] = data.data[i];
              sugerencias[i].innerHTML = data.data[i].name;
            } else {
              sugerencias[i].innerHTML = "";
            }
          }
        },
        error: function (error) {
          console.log(error);
        },
      });

      shouldCallApi = false;
    }
  }, waitTime);
});

// Añadimos manejador de eventos click a cada una de las sugerencias
for (let i = 0; i < sugerencias.length; i++) {
  
  sugerencias[i].addEventListener("click", function () {
    iniciarMapa(poblacionesEncontradas[i].latitude, poblacionesEncontradas[i].longitude);

    document.getElementById("poblacionEncontrada").innerHTML = "Resultado: " + poblacionesEncontradas[i].name;
    document.getElementById("comunidad_autonoma").innerHTML = "Comunidad Autonoma: " + poblacionesEncontradas[i].region;
    document.getElementById("numero_poblacion").innerHTML = "Número de Poblacion: " + poblacionesEncontradas[i].population;

    input_ciudad.value = poblacionesEncontradas[i].name;

    for (let i = 0; i < sugerencias.length; i++) {
      sugerencias[i].innerHTML = "";
    }
  });
}

// Añadimos manejador de eventos onclick al boton de buscar
$("#buscar").click(function () {
  if (input_ciudad.value == "") {
    alert("No has introducido ninguna poblacion");
  } else {
    $.ajax({
      url:"https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=1&countryIds=ES&namePrefix=" + input_ciudad.value + "&sort=-population&languageCode=es",
      type: "GET",
      headers: {
        "X-RapidAPI-Key": RAPID_API_KEY,
        "X-RapidAPI-Host": RAPID_API_HOST,
      },
      success: function (respuesta) {
        if (respuesta.data.length > 0) {

          var poblacionEncontrada = respuesta.data[0];
          iniciarMapa(poblacionEncontrada.latitude, poblacionEncontrada.longitude);

          document.getElementById("poblacionEncontrada").innerHTML = "Resultado: " + poblacionEncontrada.name;
          document.getElementById("comunidad_autonoma").innerHTML = "Comunidad Autonoma: " + poblacionEncontrada.region;
          document.getElementById("numero_poblacion").innerHTML = "Número de Poblacion: " + poblacionEncontrada.population;

        } else {
          alert("No se ha encontrado la poblacion introducida");
        }
      },
    });
  }
});

// Funcion para cargar el mapa de google
function iniciarMapa(latitud, longitud) {
  if ((latitud != null, longitud != null)) {
    var mapa = new google.maps.Map(document.getElementById("mapa"), {
      center: { lat: latitud, lng: longitud },
      zoom: 15,
    });

    var marker = new google.maps.Marker({
      position: { lat: latitud, lng: longitud },
      map: mapa,
    });
  }
}
