



// TODO $(document).ready(function() {
// !create function that pulls from local storage and populates the recent searches portion
// !see if I can limit the number displayed previous searches to 6 or so

// !add event listener to search box and button that will talk to the API and populate the weather-container div
// !use temperature, wind, humidity, and perhaps any other relevant information

$(document).ready(function () {
  // Creates buttons based on past searches stored in local, then runs the create search button function
  function displayPastSearches() {
    for (let i = 0; i < localStorage.length; i++) {
      const cityName = localStorage.key(i);
      displaySearchButton(cityName);
    }
  }

  //display past searches on page load
  function saveAndDisplaySearch(input) {
    const cityName = input.value; 
    if (!cityName || isNaN(cityName)) {
      console.log('Invalid city name'); //! 
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
      fetchWeatherData();
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

  // !next function here
  function fetchWeatherData(cityName) {
    const apiKey = '7dfcee8991fd1edc7b57c5df746b672b';
    const requestUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    fetch(requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
      });
  }



  displayPastSearches();
});



