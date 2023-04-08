// Auto Complete
let autocomplete
let searchCityInput

function initMap() {
    searchCityInput = document.querySelector("#search-city")

    autocomplete = new google.maps.places.Autocomplete(searchCityInput);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        showWeather(searchCityInput.value)
    });
}

const currentWeatherElement = document.querySelector("#weather-info")

const apiKey = "c5b83392add58be24fb5a7bd362ced83"
const limit = 1

showWeather("Tokyo")

function showWeather(cityName) {
    const weatherRequest = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`

    fetch(weatherRequest).then((response) => {
        return response.json()
    })
    .then((data) => {
        console.log(data)
    
        currentWeatherElement.innerHTML = data["weather"][0]["main"]
    })
    .catch((error) => {
        console.log("Fetch Error: " + error)
    })
}