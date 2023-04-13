/* Elements */
const searchCityInput = document.querySelector("#search-city")
const cityNameElement = document.querySelector("#city-name")
const favoriteStarElement = document.querySelector("#favorite-star")
const favoriteCitiesMenu = document.querySelector("#favorite-cities")
const countryCodeElement = document.querySelector("#country-code")
const nationalFlagElement = document.querySelector("#national-flag")
const currentTemperatureElement = document.querySelector("#current-temperature")
const currentTemperatureSignElement = document.querySelector("#current-temperature-sign")
const currentWeatherElement = document.querySelector("#current-weather")
const currentWeatherIconElement = document.querySelector("#weather-icon")

const apiKey = "c5b83392add58be24fb5a7bd362ced83"  
const defaultCity = "Vancouver"
const isCelsius = true

let favoriteCities = []

/* User's location */
// If user's current location is sucessful to get, display the weather there
// If it's failed to get, display the weather of the default city
navigator.geolocation.getCurrentPosition(showWeatherInCurrentLocation, showWeatherInDefaultCity);

function showWeatherInCurrentLocation(currentLocation) {
    favoriteStarElement.style["opacity"] = 100
    showWeatherByLocation(currentLocation["coords"]["latitude"], currentLocation["coords"]["longitude"])
}

function showWeatherInDefaultCity() {
    favoriteStarElement.style["opacity"] = 100
    showWeatherByCityName(defaultCity)
}


/* Auto Complete */
window.initMap = function() {
    const autocomplete = new google.maps.places.Autocomplete(searchCityInput);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        showWeatherByCityName(searchCityInput.value)
    });
}


/* Favorite Cities */
// Add an event listener to the favorite star icon
favoriteStarElement.addEventListener("click", onFavoriteStarClicked)
// Add an event listener to the pull-down menu
favoriteCitiesMenu.addEventListener("change", onFavoriteCitySelected)

// Set up for user's favorite cities
getFavoriteCitiesFromStorage()

function getFavoriteCitiesFromStorage() {
    // Get user's favorite cities from local storage
    const key = "favorite-cities"
    let favoriteCitiesJSON = localStorage.getItem(key)

    // If data exists
    if(favoriteCitiesJSON !== null) {
        // Convert to an array
        favoriteCities = JSON.parse(favoriteCitiesJSON)

        // Deploy to the pull-down menu
        for(let favoriteCity of favoriteCities) {
            const favoriteCityOption = document.createElement("option")
            favoriteCityOption.classList.add("favorite-city")
            favoriteCityOption.innerText = favoriteCity
            favoriteCitiesMenu.appendChild(favoriteCityOption)
        }
    }
}

function onFavoriteStarClicked() {
    const displayedCity = cityNameElement.innerText

    // If the displayed city is new
    if(!favoriteCities.includes(displayedCity)) {
        // Add to the list of the favorite cities
        favoriteCities.push(displayedCity)

        // Add to the pull-down menu
        const newFavoriteCityOption = document.createElement("option")
        newFavoriteCityOption.classList.add("favorite-city")
        newFavoriteCityOption.innerText = displayedCity
        favoriteCitiesMenu.appendChild(newFavoriteCityOption)
        
    }
    // If the displayed city is already registered
    else {
        // Remove the displayed city from the favorite cities
        let index = favoriteCities.indexOf(displayedCity)
        favoriteCities.splice(index, 1)

        // Remove the displayed city from the pull-down menu
        favoriteCitiesMenu.removeChild(favoriteCitiesMenu.children[index+1])
    }

    // Update user's local storage (Just fully copy the array as JSON)
    localStorage.setItem("favorite-cities", JSON.stringify(favoriteCities))

    // Update the star sign
    setFavoriteStar()

    // Change the selected city on the pull-down menu
    changeSelectedFavoriteCityOption(cityNameElement.innerHTML)
}

function setFavoriteStar() {
    // If displayed city is one of the favorite then the star should be filled
    if(favoriteCities.includes(cityNameElement.innerHTML)) {
        favoriteStarElement.src = "img/star-on.png"
    } else {
        favoriteStarElement.src = "img/star-off.png"
    }
}

function onFavoriteCitySelected(event) {
    // Show the weather based on the selected city
    showWeatherByCityName(event.target.value)

    // Update the star sign
    setFavoriteStar()
}


// Make the displayed city selected if it's one of the favorite cities
function changeSelectedFavoriteCityOption(displayedCityName) {
    // Make the title selected in case the displayed city is not a favorite city
    favoriteCitiesMenu.children[0].selected = true

    // Check every option and make it selected if it matches the displayed city
    for(favoriteCityOption of favoriteCitiesMenu.children) {
        if(favoriteCityOption.innerText === displayedCityName) {
            favoriteCityOption.selected = true
        } else {
            favoriteCityOption = false
        }
    }
}

/* Current Weather */
function showWeather(request) {
    // Call OpenWeather API to get data
    fetch(request).then((response) => {
        if(response.status !== 200) {
            return;
        }
        return response.json()
    })
    .then((currentWeather) => {
        // Show the data obtained from API (Debug)
        console.log(currentWeather)

        // Update the display using the data
        cityNameElement.innerText = currentWeather["name"]
        currentTemperatureElement.innerText = Math.floor(currentWeather["main"]["temp"])
        currentTemperatureSignElement.innerText = "℃"
        currentWeatherElement.innerText = currentWeather["weather"][0]["main"]
        currentWeatherIconElement.src = "https://openweathermap.org/img/wn/" + currentWeather["weather"][0]["icon"] + "@4x.png"

        const countryCode = currentWeather["sys"]["country"]
        countryCodeElement.innerText = countryCode
        nationalFlagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`

        // Update the star sign
        setFavoriteStar()

        // Change the selected city on the pull-down menu
        changeSelectedFavoriteCityOption(cityNameElement.innerHTML)

        // Call the function to display the weather of the next 5 days here
        showFiveDaysWeather(currentWeather["name"])
    })
    .catch((error) => {
        console.log("Fetch Error: " + error)
    })
}

function showWeatherByCityName(cityName) {
    const temperatureType = isCelsius ? "metric" : "imperial" 
    const request = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${temperatureType}&appid=${apiKey}`

    showWeather(request)
}

function showWeatherByLocation(latitude, longtitude) {
    const temperatureType = isCelsius ? "metric" : "imperial" 
    const request = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&units=${temperatureType}&appid=${apiKey}`

    showWeather(request)
}




//const apiKey ="3b2df1883208190d986bcd1b1e48eff4"

// to change the unit of temperature from Kelvin to Celsius
const temperatureType = "metric"


function showFiveDaysWeather(cityName) {
    const request = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${temperatureType}&appid=${apiKey}`
    fetch(request)
    .then(
        function(response) {
            if(response.status !== 200){
                return;
            }
            response.json().then(function(fiveDaysWeather) {
                console.log(fiveDaysWeather);


                // get currentDate
                let currentDate = new Date();

                // for the if statement to specific the date, the time and weather infos
                let day = 1;
                
                // get all the weather info
                fiveDaysWeather["list"].forEach( eachWeatherInfo=> {
                    console.log(eachWeatherInfo);

                    // convert unix-time to date
                    let date = new Date(eachWeatherInfo["dt"] * 1000);
                    

                    // show the next 5 days' weather              
                    if(date.getDate() === currentDate.getDate() + day) {
                        if(date.getHours() >=12 && date.getHours() <=15) {
                            console.log(eachWeatherInfo["weather"][0]["main"],eachWeatherInfo["main"]["temp_max"],eachWeatherInfo["main"]["temp_min"]);
                            document.getElementById(`day${day}`).innerHTML= eachWeatherInfo["weather"][0]["main"]
                            document.getElementById(`day${day}-temp-max`).innerHTML= eachWeatherInfo["main"]["temp_max"]
                            document.getElementById(`day${day}-temp-min`).innerHTML= eachWeatherInfo["main"]["temp_min"]
                                    
                            day = day +1; 
                        }
                    }
                })
            })
        }
    )
}


threeHRange("Vancouver", 1);

let weatherIconElement = document.getElementsByClassName("weatherImg");
let rangeIndex = 0;

function threeHRange (city, day) {
    
    fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=42da94770c5c8f2ed979107d60b61299`)
    .then(
        function(response) {
            response.json() .then(function(data) {
                console.log(data);

                console.log(data["list"][0]);
                let date = new Date(data["list"][0]["dt"] * 1000);
                console.log(date)

                let weatherList = data["list"]
                
                console.log(weatherList[0]["weather"][0]["main"])


            const currentDate = new Date();
            const compareDate = currentDate.getDate() + day;

            let threeHBox = document.getElementsByClassName("threeH-box");

            

            weatherList.forEach((weather, index) => {
                

                let date = new Date(weather["dt"] * 1000);
                

                if (date.getDate() === compareDate) {
                    const weatherRange = document.getElementsByClassName("weatherRange" + rangeIndex);
                    weatherRange[0].innerText = weather["weather"][0]["main"];
                    
                    weatherIconElement[rangeIndex].src = "https://openweathermap.org/img/wn/" + weather["weather"][0]["icon"] + "@4x.png";
                    
                    rangeIndex += 1;

                    console.log(weatherRange)
                
                
                }
                

            })
            
            })
        }
    )

}