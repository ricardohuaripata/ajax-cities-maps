var input_ciudad = document.getElementById("input_ciudad");
var sugerencias = document.getElementsByClassName("sugerencia");
const GOOGLE_API_KEY = "AIzaSyAKIHCQq4vPTx1PP58dERRwaZe4578t_ZY";
const RAPID_API_KEY = "0bec2bde07msh72c0629e6e04e01p1892dfjsn084c2fa73404";
const RAPID_API_HOST = "wft-geo-db.p.rapidapi.com";

var poblaciones = null;
var latitud = null;
var longitud = null;

var timeoutId;
var waitTime = 1000;
var shouldCallApi = false;

// Añadimos manejador de eventos onclick a las sugerencias
for (let i = 0; i < sugerencias.length; i++) {
  sugerencias[i].addEventListener("click", function () {
    input_ciudad.value = sugerencias[i].textContent;
    latitud = poblaciones[i].latitude;
    longitud = poblaciones[i].longitude;
  });
}

input_ciudad.addEventListener("keyup", function () {
  shouldCallApi = true;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(function () {
    if (shouldCallApi) {
      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.open(
        "GET",
        "https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=ES&namePrefix=" +
          input_ciudad.value +
          "&sort=-population&languageCode=es",
        true
      );

      xhr.setRequestHeader("X-RapidAPI-Key", RAPID_API_KEY);
      xhr.setRequestHeader("X-RapidAPI-Host", RAPID_API_HOST);

      xhr.send();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var respuesta = JSON.parse(xhr.responseText);

          if (respuesta.data.length > 0) {
            poblaciones = respuesta.data;

            for (
              let i = 0;
              i < poblaciones.length && i < sugerencias.length;
              i++
            ) {
              sugerencias[i].innerHTML = poblaciones[i].name;
            }
          }
        }
      };

      shouldCallApi = false;
    }
  }, waitTime);
});

// Añadimos manejador de eventos onclick al boton de buscar
document.getElementById("buscar").addEventListener("click", function () {
  console.log(latitud + ", " + longitud);
  iniciarMapa(latitud, longitud);
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
