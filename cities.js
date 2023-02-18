const GOOGLE_API_KEY = "AIzaSyAKIHCQq4vPTx1PP58dERRwaZe4578t_ZY";
const RAPID_API_KEY = "0bec2bde07msh72c0629e6e04e01p1892dfjsn084c2fa73404";
const RAPID_API_HOST = "wft-geo-db.p.rapidapi.com";

var input_ciudad = document.getElementById("input_ciudad");
var sugerencias = document.getElementsByClassName("sugerencia");

var timeoutId;
var waitTime = 500;
var shouldCallApi = false;
// Variable donde guardare la lista de poblaciones encontradas
var poblacionesEncontradas = [sugerencias.length];

// añadimos manejar de eventos keyup al input de ciudad
input_ciudad.addEventListener("keyup", function () {
  shouldCallApi = true;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(function () {
    if (shouldCallApi) {
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.open("GET", "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=" + sugerencias.length +
          "&countryIds=ES&namePrefix=" + input_ciudad.value +
          "&sort=-population&languageCode=es", true);

      xhr.setRequestHeader("X-RapidAPI-Key", RAPID_API_KEY);
      xhr.setRequestHeader("X-RapidAPI-Host", RAPID_API_HOST);

      xhr.send();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var respuesta = JSON.parse(xhr.responseText);

          for (let i = 0; i < sugerencias.length; i++) {
            // si aun no se ha terminado de recorrer cada uno de los resultados
            if (i < respuesta.data.length) {
              // voy guardando resultados
              poblacionesEncontradas[i] = respuesta.data[i];
              // voy pintando los resultados
              sugerencias[i].innerHTML = respuesta.data[i].name;

              // si se ha terminado de recorrer cada uno de los resultados
            } else {
              // voy limpiando en caso de que hayan menos de 5 resultados
              sugerencias[i].innerHTML = "";
            }
          }
        }
      };

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
document.getElementById("buscar").addEventListener("click", function () {
  if (input_ciudad.value == "") {
    alert("No has introducido ninguna poblacion");
  } else {
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.open("GET", "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?limit=1" +
        "&countryIds=ES&namePrefix=" + input_ciudad.value +
        "&sort=-population&languageCode=es", true);

    xhr.setRequestHeader("X-RapidAPI-Key", RAPID_API_KEY);
    xhr.setRequestHeader("X-RapidAPI-Host", RAPID_API_HOST);

    xhr.send();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var respuesta = JSON.parse(xhr.responseText);

        if (respuesta.data.length > 0) {
          var poblacionEncontrada = respuesta.data[0];
          iniciarMapa(poblacionEncontrada.latitude, poblacionEncontrada.longitude);

          document.getElementById("poblacionEncontrada").innerHTML = "Resultado: " + poblacionEncontrada.name;
          document.getElementById("comunidad_autonoma").innerHTML = "Comunidad Autonoma: " + poblacionEncontrada.region;
          document.getElementById("numero_poblacion").innerHTML = "Número de Poblacion: " + poblacionEncontrada.population;
        } else {
          alert("No se ha encontrado la poblacion introducida");
        }
      }
    };
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
