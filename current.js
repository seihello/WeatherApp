// Auto Complete
let autocomplete
let searchCityInput

function initMap() {
    searchCityInput = document.querySelector("#search-city")

    autocomplete = new google.maps.places.Autocomplete(searchCityInput);

    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        console.log(searchCityInput.value)
    });
}

const currentWeatherElement = document.querySelector("#weather-info")

const apiKey = "c5b83392add58be24fb5a7bd362ced83"
const limit = 1

showWeather("Vancouver")

function showWeather(cityName) {
    
    const locationRequest = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`

    let lat = 0
    let lon = 0
    fetch(locationRequest).then((response) => {
        return response.json()
    })
    .then((data) => {
        let location = data[0]
        lat = location["lat"]
        lon = location["lon"]
    
        const weatherRequest = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
    
        return fetch(weatherRequest)
    })
    .then((response) => {
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