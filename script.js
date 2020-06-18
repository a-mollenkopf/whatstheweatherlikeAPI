var userInput = document.querySelector("#userInput");
var APIKey = "appid=cd8e2d0af4e5d853ee4b01e3ca3322fc";
var lat = "";
var lon = "";

var weatherURL = "http://api.openweathermap.org/data/2.5/weather?" + APIKey;
var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?" + APIKey;
var UVurl = "http://api.openweathermap.org/data/2.5/uvi/forecast?" + APIKey;


$("#searchButton").on("click", function () {
  event.preventDefault();
  var city = $("#userInput").val();
  var queryURL = weatherURL + "&q=" + city;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    console.log(response.name);
    console.log(response.weather[0].icon);

    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
    console.log(Math.floor(tempF));

    console.log(response.main.humidity);

    console.log(response.wind.speed);
    console.log(response.coord.lon);
    console.log(response.coord.lat);
    var d = new Date();
    lat = response.coord.lat;
    lon = response.coord.lon;

    var month = d.getMonth() + 1;
    var day = d.getDate();

    var dateString =
    d.getMonth() + 1 +
    "/" +
    d.getDate() +
    "/" +
    d.getFullYear();
      
    $("#currentCity").text(response.name + " (" + dateString + ")");
    $("#temperature").html(tempF.toFixed() + " &deg;F");
    $("#humidity").text(response.main.humidity + "%");
    $("#windspeed").text(response.wind.speed + " MPH");

    queryURL = UVurl + "&lat=" + lat + "&lon=" + lon;
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);

        console.log(response[0].value);
        
        $("#UVIndex").html(response[0].value);
    });
  });

  
});
