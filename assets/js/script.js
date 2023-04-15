



// TODO $(document).ready(function() {
// !create function that pulls from local storage and populates the recent searches portion
// !see if I can limit the number displayed previous searches to 6 or so

// !add event listener to search box and button that will talk to the API and populate the weather-container div
// !use temperature, wind, humidity, and perhaps any other relevant information

$(document).ready(function () {
  //display past searches on page load
  function saveAndDisplaySearch(input) {
    const cityName = input.value; //! I think I might have to use GeoCoder and change cityName to an ID?
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

  // Creates buttons based on past searches stored in local, then runs the create search button function
  function displayPastSearches() {
    for (let i = 0; i < localStorage.length; i++) {
      const cityName = localStorage.key(i);
      displaySearchButton(cityName);
    }
  }

  //event listener for button and input box
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
    const apiKey = '7dfcee8991fd1edc7b57c5df746b672b'; 
  const requestUrl = 'https://api.openweathermap.org/data/2.5/weather?q=$' + cityName + '&appid=$' + apiKey;

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



