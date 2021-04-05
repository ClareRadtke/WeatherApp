// ToDo:
// disable search button until page loads info from last search
// if <h2>City name<h2> matches last search value then search button active,
// if not then disable search button, **always have active on page load & reload
// manage any errors with throw and catch - ensure user gets notified
//potential errors **entering a search term that is not a city

const now = moment();
const date = now.format("ddd, DD MMM YYYY");
const localstorage = window.localStorage;
const searchTerms = [];

document
  .getElementById("search-btn")
  .addEventListener("click", function (event) {
    let searchValue = document.getElementById("search").value;
    searchTerms.push(searchValue);
    callWeatherApi(searchValue);
  });
console.log(searchTerms);

function callWeatherApi(param) {
  // call the Open Weather Map geolocation API to search for a location (q={city name}, limit={number of search results provided})
  fetch(
    `http://api.openweathermap.org/geo/1.0/direct?q=${param}&limit=1&appid=909de12bbfb6b56e39909619fcde1183`
  )
    .then((response) => response.json())
    .then(function (data) {
      document.getElementById("cityName").innerHTML = data[0].name;
      const lat = data[0].lat;
      const lon = data[0].lon;
      // call the Open Weather Map API to display the weather forcast for a city  (q={city name})
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=909de12bbfb6b56e39909619fcde1183`
      )
        .then((response) => response.json())
        .then(function (data) {
          // Render the current weather conditions to the page
          renderCurrentWeather(data);
          // Render the 5-Day forcast cards to the page
          renderforcastCards(data);
        });
    });
}

function populateSearchHistory() {
  for (let i = 0; i <= searchTerms.length; i++) {
    const template = document.createElement("template");
    template.innerHTML = `
    <a href="#" class="list-group-item list-group-item-action">${searchValue}</a>
    `;
    document.getElementById("history").appendChild(template.content);
  }
}

function renderCurrentWeather(data) {
  // convert the wind speed from meters per second to km per hour and round to 1 decimal place
  const windSpeed = (data.current.wind_speed * 3.6).toFixed(1);
  document.getElementById("todaysDate").innerHTML = date;
  document.getElementById(
    "weatherIcon"
  ).src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
  document.getElementById("temp").innerHTML = data.current.temp.toFixed(1);
  document.getElementById("humidity").innerHTML = data.current.humidity;
  document.getElementById("windSpeed").innerHTML = windSpeed;
  document.getElementById("uvIndex").innerHTML = data.current.uvi;
}

// Create the 5-Day forcast cards
function renderforcastCards(data) {
  for (let i = 1; i <= 5; i++) {
    const forcastDate = moment
      .unix(data.daily[i].dt)
      .format("ddd, DD MMM YYYY");

    const template = document.createElement("template");
    template.innerHTML = `
    <li class="list-group-item">
      <h5 class="card-title">${forcastDate}</h5>
      <img src="http://openweathermap.org/img/wn/${
        data.daily[i].weather[0].icon
      }@2x.png"></img>
      <p class="card-text">Temp: <span>${data.daily[i].temp.max.toFixed(
        1
      )}</span> °C</p>
      <p class="card-text">Humidity: <span>${
        data.daily[i].humidity
      }</span> %</p>
    </li>
    `;
    document.getElementById("forcastContainer").appendChild(template.content);
  }
}
