// Auto Complete
const searchCityInput = document.querySelector("#search-city")

function initMap() {
    const autocomplete = new google.maps.places.Autocomplete(searchCityInput);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        showWeather(searchCityInput.value)
    });
}

// Current Weather
const apiKey = "c5b83392add58be24fb5a7bd362ced83"
const defaultCity = "Vancouver"

const selectedCityNameElement = document.querySelector("#city-name")
const currentTemperatureElement = document.querySelector("#current-temperature")
const currentWeatherElement = document.querySelector("#current-weather")

showWeather(defaultCity)

function showWeather(cityName) {
    const weatherRequest = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

    fetch(weatherRequest).then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data)
    
        selectedCityNameElement.innerHTML = cityName
        currentTemperatureElement.innerHTML = data["main"]["temp"]
        currentWeatherElement.innerHTML = data["weather"][0]["main"]
    })
    .catch((error) => {
        console.log("Fetch Error: " + error)
    })

    // Call the function to display the weather of the next 5 days
}