// Auto Complete
const searchCityInput = document.querySelector("#search-city")

function initMap() {
    const autocomplete = new google.maps.places.Autocomplete(searchCityInput);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        showWeather(searchCityInput.value)
    });
}


// Favorite Cities
let favoriteCities = []

const selectedCityNameElement = document.querySelector("#city-name")
const favoriteStarElement = document.querySelector("#favorite-star")
favoriteStarElement.addEventListener("click", onFavoriteStarClicked)

const favoriteCitiesMenu = document.querySelector("#favorite-cities")

function onFavoriteStarClicked() {
    const selectedCity = selectedCityNameElement.innerHTML

    if(!favoriteCities.includes(selectedCity)) {
        // Add to the list of the favorite cities
        favoriteCities.push(selectedCity)

        // Add to the pull-down menu
        const newFavoriteCityOption = document.createElement("option")
        newFavoriteCityOption.innerHTML = selectedCity
        favoriteCitiesMenu.appendChild(newFavoriteCityOption)
    } else {
        let index = favoriteCities.indexOf(selectedCity)

        // Remove the selected city from the favorite cities
        favoriteCities.splice(index, 1)

        // Remove the selected city from the pull-down menu
        favoriteCitiesMenu.removeChild(favoriteCitiesMenu.children[index+1])
    }

    setFavoriteStar()
}

function setFavoriteStar() {
    if(favoriteCities.includes(selectedCityNameElement.innerHTML)) {
        favoriteStarElement.src = "img/star-on.png"
    } else {
        favoriteStarElement.src = "img/star-off.png"
    }
}

// Current Weather
const apiKey = "c5b83392add58be24fb5a7bd362ced83"
const defaultCity = "Vancouver"

const currentTemperatureElement = document.querySelector("#current-temperature")
const currentWeatherElement = document.querySelector("#current-weather")

showWeather("Vancouver, BC, Canada")

function showWeather(cityName) {
    const weatherRequest = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`

    fetch(weatherRequest).then((response) => {
        if(response.status !== 200) {
            return;
        }
        return response.json()
    })
    .then((data) => {
        selectedCityNameElement.innerHTML = cityName
        currentTemperatureElement.innerHTML = data["main"]["temp"]
        currentWeatherElement.innerHTML = data["weather"][0]["main"]

        setFavoriteStar()
    })
    .catch((error) => {
        console.log("Fetch Error: " + error)
    })



    // Call the function to display the weather of the next 5 days
}
