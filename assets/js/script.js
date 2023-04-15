



// TODO $(document).ready(function() {
// !create function that pulls from local storage and populates the recent searches portion
// !see if I can limit the number displayed previous searches to 6 or so

// !add event listener to search box and button that will talk to the API and populate the weather-container div
// !use temperature, wind, humidity, and perhaps any other relevant information

$(document).ready(function () {


  // Creates buttons based on past searches stored in local, then runs the create search button function
  function displayPastSearches() {
    const pastSearchKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      pastSearchKeys.push(localStorage.key(i));
    }
    pastSearchKeys.sort();

    const maxSearches = 6;
    for (let i = 0; i < pastSearchKeys.length; i++) {
      if (i >= maxSearches) {
        break;
      }
      displaySearchButton(pastSearchKeys[i]);
    }
  }

  //display past searches on page load
  function saveAndDisplaySearch(input) {
    const cityName = input.value;
    if (!cityName || isNaN(cityName)) {
      console.log('Invalid city name');
      return;
    }
    localStorage.setItem(cityName, cityName);
    displaySearchButton(cityName);
  }

  // create buttons based on search input
  function displaySearchButton(cityName) {
    const pastSearchContainer = document.getElementById("past-search");
    const searchButton = document.createElement("button");
    searchButton.textContent = cityName;
    searchButton.classList.add("btn", "btn-outline-secondary", "mb-2");
    searchButton.addEventListener("click", function () {
      fetchWeatherData(cityName);



    });
    pastSearchContainer.appendChild(searchButton);
  }


  //event listener for button and input box
  const searchButton = document.getElementById("search-button");
  const searchInput = document.querySelector("#search-container input");
  const cityNameInput = document.getElementById('cityNameInput');

  searchButton.addEventListener("click", function () {
    const cityName = searchInput.value;
    console.log(cityName);
    if (!cityName || !isNaN(cityName)) {
      console.log(cityNameInput);
      console.log('Invalid city name'); //!
      return;

    }
    if (cityName) {
      saveAndDisplaySearch(searchInput);
      fetchWeatherData(cityName);

    }
  })


  function fetchWeatherData(cityName) {
    const apiKey = '7dfcee8991fd1edc7b57c5df746b672b';
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=imperial`;
    let dataDisplay = document.getElementById('weather-container');

    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data){
        if (data.cod === "404") {
          const displayTitle = document.getElementById('display-title');
          displayTitle.textContent = "City not found";
          console.error("City not found");
          return;
        }
      })
      .then(function (data) {
        console.log(data);
        const lat = data.coord.lat;
        const lon = data.coord.lon;
        console.log(lat, lon);
        fetchForecast(lat, lon);
        var displayTitle = document.getElementById('display-title');
        var displayTemp = document.getElementById('display-temp');
        var displayWind = document.getElementById('display-wind');
        var displayHumidity = document.getElementById('display-humidity');
        displayTitle.textContent = data.name + '   ' + data.dt;
        displayTemp.textContent = 'Temperature:  ' + data.main.temp + ' \u00B0F';
        displayWind.textContent = 'Wind:  ' + data.wind.speed + ' MPH';
        displayHumidity.textContent = 'Humidity:  ' + data.main.humidity + ' %';
      });


    function fetchForecast(lat, lon) {
      const apiKey = '7dfcee8991fd1edc7b57c5df746b672b';
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      console.log(forecastUrl);

      fetch(forecastUrl)

        .then(function (response) {
          return response.json();

        })
        .then(function (data) {
          console.log(data);

          const firstForecast = data.list[7];

          var displayTitle = document.getElementById('forecast-title');
          var displayTemp = document.getElementById('forecast-temp');
          var displayWind = document.getElementById('forecast-wind');
          var displayHumidity = document.getElementById('forecast-humidity');
          displayTitle.textContent = firstForecast.dt_txt;
          displayTemp.textContent = firstForecast.main.temp;
          displayWind.textContent = firstForecast.wind.speed;
          displayHumidity.textContent = firstForecast.main.humidity;
        });
    }
  }

  displayPastSearches();

  ;
})
