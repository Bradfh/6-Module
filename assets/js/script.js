



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
    const maxSearches = 6;

    if (!cityName || !isNaN(cityName)) {
      console.log('Invalid city name');
      return;
    }
    if (localStorage.length >= maxSearches) {
      
      const oldestSearchKey = localStorage.key(0);
      localStorage.removeItem(oldestSearchKey);

      
      const buttonToRemove = document.querySelector(`button[data-city-name="${oldestSearchKey}"]`);
      buttonToRemove.remove();
    }

    localStorage.setItem(cityName, cityName);
    displaySearchButton(cityName);
  }

  

  // create buttons based on search input
  function displaySearchButton(cityName) {
    const pastSearchContainer = document.getElementById("past-search");
    const searchButton = document.createElement("button");
    searchButton.textContent = cityName;
    searchButton.classList.add("btn", "btn-outline-secondary", "mb-2", "btn-primary");
    searchButton.setAttribute("data-city-name", cityName);
    searchButton.setAttribute('id', 'search-buttons');
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
      console.log('Invalid city name');
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
    

    fetch(requestUrl)/*  */
      .then(function (response) {
        return response.json();
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
        displayTitle.textContent = data.name + ',   ' + new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(data.dt * 1000));
        displayTemp.textContent = 'Temperature:  ' + data.main.temp + ' \u00B0F';
        displayWind.textContent = 'Wind:  ' + data.wind.speed + ' MPH';
        displayHumidity.textContent = 'Humidity:  ' + data.main.humidity + ' %';
      });


    function fetchForecast(lat, lon) {
      const apiKey = '7dfcee8991fd1edc7b57c5df746b672b';
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
      console.log(forecastUrl);

      fetch(forecastUrl)

        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);

          for (let i = 0; i < data.list.length; i += 8) {
            const forecast = data.list[i];

            var displayTitle = document.getElementById(`forecast-title-${i}`);
            var displayIcon = document.getElementById(`forecast-icon-${i}`);
            var displayTemp = document.getElementById(`forecast-temp-${i}`);
            var displayWind = document.getElementById(`forecast-wind-${i}`);
            var displayHumidity = document.getElementById(`forecast-humidity-${i}`);
            const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`;

            displayTitle.textContent = new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(forecast.dt * 1000));
            displayIcon.src = iconUrl;
            displayTemp.textContent = `${forecast.main.temp_max} \u00B0F`;
            displayWind.textContent = `Wind: ${forecast.wind.speed} MPH`;
            displayHumidity.textContent = `Humidity: ${forecast.main.humidity}%`;
          }



        });
    }
  }

  displayPastSearches();

  ;
})
