// ToDo:
// disable search button until page loads info from last search
// if <h2>City name<h2> matches last search value then search button active,
// if not then disable search button, **always have active on page load & reload
//potential errors **entering a search term that is not a city
//- if 202 returned then push to search histroy else alert "please enter a city name to view the forecast"

const now = moment();
const date = now.format("ddd, DD MMM YYYY");
const localstorage = window.localStorage;
const searchTerms = [];

document
  .getElementById("search-btn")
  .addEventListener("click", function (event) {
    let searchValue = document.getElementById("search").value;
    searchTerms.push(searchValue);
    // removeListItems();
    populateSearchHistory();
    callWeatherApi(searchValue);
  });

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    document.getElementById("search-btn").click();
  });

function callWeatherApi(param) {
  // call the Open Weather Map geolocation API to search for a location (q={city name}, limit={number of search results provided})
  fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${param}&limit=1&appid=909de12bbfb6b56e39909619fcde1183`
  )
    .then((response) => response.json())
    .then(function (data) {
      document.getElementById("cityName").innerHTML = data[0].name;
      const lat = data[0].lat;
      const lon = data[0].lon;
      // call the Open Weather Map API to display the weather forecast for a city  (q={city name})
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&units=metric&appid=909de12bbfb6b56e39909619fcde1183`
      )
        .then((response) => response.json())
        .then(function (data) {
          // Render the current weather conditions to the page
          renderCurrentWeather(data);
          // Render the 5-Day forecast cards to the page
          renderforecastCards(data.daily.slice(1, 6));
        });
    });
}

function populateSearchHistory() {
  removeListItems(".search-history-value");
  for (let i = 0; i < searchTerms.length; i++) {
    const el = createElementFromString(`
    <a href="#" class="list-group-item list-group-item-action search-history-value">${searchTerms[i]}</a>
    `);
    document.getElementById("history").appendChild(el);

    el.addEventListener("click", function () {
      callWeatherApi(searchTerms[i]);
    });
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

  document.getElementById("uvIndex").style.backgroundColor = uvSeverity(
    data.current.uvi
  );
}

// Create the 5-Day forecast cards
function renderforecastCards(days) {
  removeListItems(".forecastCard");
  days.forEach((day) => {
    const forecastDate = moment.unix(day.dt).format("ddd, DD MMM YYYY");

    const el = createElementFromString(`
    <li class="list-group-item forecastCard">
      <h5 class="card-title">${forecastDate}</h5>
      <img src="http://openweathermap.org/img/wn/${
        day.weather[0].icon
      }@2x.png"></img>
      <p class="card-text">Temp: <span>${day.temp.max.toFixed(1)}</span> °C</p>
      <p class="card-text">Humidity: <span>${day.humidity}</span> %</p>
    </li>
    `);
    document.getElementById("forecastContainer").appendChild(el);
  });
}

function createElementFromString(str) {
  const template = document.createElement("div");
  template.innerHTML = str;
  return template.children[0];
}

function removeListItems(className) {
  let listItems = document.querySelectorAll(className);
  if (listItems) listItems.forEach((el) => el.remove());
}

// Assess UV Index severity and colour code
function uvSeverity(value) {
  if (value < 3) return "green";
  if (value < 5) return "orange";
  return "red";
}
