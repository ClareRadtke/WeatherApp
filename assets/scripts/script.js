// ToDo:
// disable search button until page loads info from last search
// if <h2>City name<h2> matches last search value then search button active,
// if not then disable search button, **always have active on page load & reload
// manage any errors with throw and catch - ensure user gets notified
// settings on the search to resrtict it to letters only (no post codes) - done
// convert wind speed from meters / second to km per hour (1m/sec = 3.6/hr so m/sec*3.6 = km/h) -done
const now = moment();
const date = now.format("ddd, DD MMM YYYY");

document.getElementById("todaysDate").innerHTML = date;

// call the Open Weather Map geolocation API to search for a location (q={city name}, limit={number of search results provided})
fetch(
  "http://api.openweathermap.org/geo/1.0/direct?q=Geelong&limit=5&appid=909de12bbfb6b56e39909619fcde1183"
)
  .then((response) => response.json())
  .then(function (data) {
    document.getElementById("cityName").innerHTML = data[0].name;
    console.log(data);
  });

// call the Open Weather Map API to display the weather forcast for a city  (q={city name})
fetch(
  "https://api.openweathermap.org/data/2.5/onecall?lat=-38.1741&lon=144.3607&exclude=minutely,hourly&units=metric&appid=909de12bbfb6b56e39909619fcde1183"
)
  .then((response) => response.json())
  .then(function (data) {
    // convert the wind speed from meters per second to km per hour and round to 1 decimal place
    const windSpeed = (data.current.wind_speed * 3.6).toFixed(1);

    document.getElementById(
      "weatherIcon"
    ).src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    document.getElementById("temp").innerHTML = data.current.temp.toFixed(1);
    document.getElementById("humidity").innerHTML = data.current.humidity;
    document.getElementById("windSpeed").innerHTML = windSpeed;
    document.getElementById("uvIndex").innerHTML = data.current.uvi;
    console.log("weather forcast: ", typeof data, data);

    renderforcastCards(data);
  });

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

//Mon Apr 05 2021 12:00:00 GMT+1000
