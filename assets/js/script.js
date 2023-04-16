$(document).ready(function () {


  // This function is taking data from local storage that already exists, perhaps from a 
  //previous time the app was used, and displays those values as buttons that will execute 
  //another API fetch.  I didn't want the past search list to get ridiculous so I limited past 
  //searches to 6.  What I couldn't figure out was how to replace the oldest searched 
  //city instead of the most recent.  As it stands now once the list gets 6 long the last one 
  //is just replaced over and over.
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

  //This function takes the search box input, saves it to local storage, and then calls the 
  //function that creates buttons based on past searches using the parameter that we set with 
  //our cityName variable.  
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



  // This function is taking the same cityName variable taken from 3 different sources 
  //depending on how it is called.  It then creates the button dynamically with classes, an ID, 
  //and styles.  Then it adds an event listener to that button that calls the fetch 
  //functions on click.
  function displaySearchButton(cityName) {
    const pastSearchContainer = document.getElementById("past-search");
    const searchButton = document.createElement("button");
    searchButton.textContent = cityName;
    searchButton.classList.add("btn", "btn-outline-secondary", "mb-2", "btn-primary");
    searchButton.setAttribute("data-city-name", cityName);
    searchButton.setAttribute('id', 'search-buttons');
    searchButton.style.textAlign = 'center';
    searchButton.addEventListener("click", function () {
      fetchWeatherData(cityName);

    });
    pastSearchContainer.appendChild(searchButton);
  }



  //event listener for button and input box.  This event listener might be redundant but it 
  //never broke anything so here we are. It also clears the input box.  I might be able to add 
  //the arguments to the previous event listener but because it works I am not going to 
  //risk breaking it. This function won't let an invalid city input go through to the fetch 
  //function and returns a message to the console.
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
      searchInput.value = '';

    }
  })

  // This is the first API fetch function.  It talks to the API, jsons the response, then 
  //pulls variables for lat and lon to be used to call the forecast function.  Then it takes 
  //the returned data and puts in into the hard coded HTML elements with the appropriate 
  //information.
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
        const displayContainer = document.getElementById('data-container');
        var displayTitle = document.getElementById('display-title');
        var displayIcon = document.getElementById('weather-icon');
        var displayTemp = document.getElementById('display-temp');
        var displayWind = document.getElementById('display-wind');
        var displayHumidity = document.getElementById('display-humidity');
        const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
        displayTitle.textContent = data.name + ',   ' + new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(data.dt * 1000));
        displayIcon.src = iconUrl;
        displayIcon.addEventListener('load', function () {
          displayContainer.style.display = 'block';
        });
        displayTemp.textContent = 'Temperature:  ' + data.main.temp + ' \u00B0F';
        displayWind.textContent = 'Wind:  ' + data.wind.speed + ' MPH';
        displayHumidity.textContent = 'Humidity:  ' + data.main.humidity + ' %';
      });

    // This is the forecast fetch function.  It talks to the OpenWeather forecast API which 
    //requires forecasts be pulled by lat and lon instead of city name.  So I had to use the 
    //lat an long variables from the last function to call this one.  After that it does almost 
    //the same thing, except this time the API response was in a gigantic array that I 
    //had to pluck from.
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
            displayIcon.addEventListener('load', function () {
              displayIcon.style.display = 'block';
            });
            displayTemp.textContent = `${forecast.main.temp_max} \u00B0F`;
            displayWind.textContent = `Wind: ${forecast.wind.speed} MPH`;
            displayHumidity.textContent = `Humidity: ${forecast.main.humidity}%`;
          }



        });
    }
  }
  // window.onload = function () {
  //   localStorage.clear();
  displayPastSearches();

  ;
}
)