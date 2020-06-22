var userInput = document.querySelector("#userInput");
var APIKey = "appid=cd8e2d0af4e5d853ee4b01e3ca3322fc";
var lat = "";
var lon = "";
var cities = [];
var cityList = document.querySelector("#cityList");

var weatherURL = "https://api.openweathermap.org/data/2.5/weather?" + APIKey;
var forecastURL = "https://api.openweathermap.org/data/2.5/onecall?exclude=minutely,hourly,current,historical&" + APIKey;
var UVurl = "https://api.openweathermap.org/data/2.5/uvi/forecast?" + APIKey;

var storedCities = JSON.parse(localStorage.getItem("cities"));


if (storedCities !== null) {
  cities = storedCities;
}
renderCities();

$("#searchButton").on("click", function () {
  // event.preventDefault();
  var city = userInput.value;
  cities.push(city);
  userInput.value = "";
  localStorage.setItem("cities", JSON.stringify(cities));
  getWeatherData(city);
  renderCities();
}); 
$(document).on("click", function () {
  event.preventDefault();
  if(event.target && event.target.id == "cityButton") {
  var city = event.target.innerHTML;
  userInput.value = "";
  getWeatherData(city);
  }
}); 
  
function getWeatherData(selectedCity) {
  var queryURL = weatherURL + "&q=" + selectedCity;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {

    var tempF = (response.main.temp - 273.15) * 1.8 + 32;
  
    var iconUrl = "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";

    $("#iconHeader").attr("src", iconUrl);

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
        var UVIndex = response[0].value;
        $("#UVIndex").html(UVIndex);
        if(UVIndex < 3) {
          $("#UVIndex").attr("class", "UVGreen");
        }else if (UVIndex < 7) {
          $("#UVIndex").attr("class", "UVYellow");
        }else {
          $("#UVIndex").attr("class", "UVRed");
        }
        
        
        queryURL = forecastURL + "&lat=" + lat + "&lon=" + lon;
        $.ajax({
          url: queryURL,
          method: "GET",
        }).then(function(response) {
          var fiveDayArray = [1,2,3,4,5];
          // for loop that pulls in 5 day forecast information
          for (var i = 0; i < 5; i++) {
          var FiveDayForecast = response.daily[i];
          var tempF = (FiveDayForecast.temp.max - 273.15) * 1.8 + 32;
          var forecastIcon = FiveDayForecast.weather[0].icon;
          var fiveUrl =  "https://openweathermap.org/img/w/" + forecastIcon + ".png";
    
          // fiveDayDate.text(currentDate);
          // fiveDayTemp.text("Temp : " + tempF.toFixed(1) + "%");
          // fiveDayIcon.text("placeholder");
          // fiveDayHumidity.text("Humidity: " + FiveDayForecast.main.humidity + "%");
          
          var forecastDate = new Date(FiveDayForecast.dt * 1000 );
          console.log(forecastDate);
          var dateString =  (forecastDate.getMonth()+1) + "/" + forecastDate.getDate() + "/" + forecastDate.getFullYear();
          $(".fiveDayDate" + (i + 1)).text(dateString);
          $(".fiveDayTemp" + (i + 1)).html(tempF.toFixed() + " &deg;F");
          $(".fiveDayHumidity" + (i + 1)).text(FiveDayForecast.humidity + "%");
          $(".fiveDayIcon" + (i + 1)).attr(
            "src",
            fiveUrl
          );
          }
        });
    });

   
  });
  
};
function renderCities() {
  // Clear todoList element and update todoCountSpan
  cityList.innerHTML = "";

  // Render a new li for each todo
  for (var i = 0; i < cities.length; i++) {
    var city = cities[i];
    
    var button = document.createElement("button");
    button.id = "cityButton";
    button.textContent = city;

    var li = document.createElement("li");
    li.setAttribute("data-index", i);
    
    li.appendChild(button);
    cityList.appendChild(li);
  }
}
