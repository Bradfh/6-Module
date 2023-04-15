



// TODO $(document).ready(function() {
// !create function that pulls from local storage and populates the recent searches portion
// !see if I can limit the number displayed previous searches to 6 or so

// !add event listener to search box and button that will talk to the API and populate the weather-container div
// !use temperature, wind, humidity, and perhaps any other relevant information

$(document).ready(function () {
  function saveAndDisplaySearch(input) {
    const cityName = input.value;
    localStorage.setItem(cityName, cityName);
    displaySearchButton(cityName);
  }

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

  function displayPastSearches() {
    for (let i = 0; i < localStorage.length; i++) {
      const cityName = localStorage.key(i);
      displaySearchButton(cityName);
    }
  }

  const searchButton = document.getElementById("search-button");
  const searchInput = document.querySelector("#search-container input");

  searchButton.addEventListener("click", function () {
    const cityName = searchInput.value;
    if (cityName) {
      saveAndDisplaySearch(searchInput);
      fetchWeatherData(cityName);
    }
  })

  // !next function here
  function fetchWeatherData(cityName) {
  const apiKey = '1d73cb51ff64bea50849446211d470ad'; 
  const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=$' + apiKey;

  fetch(requestUrl)
    .then(function(response) {
      if (!response.status) {
        throw new Error('An error occurred: ${response.statusText');
        
      }
      console.log(response.json()); //!
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });

}



  displayPastSearches();
});



