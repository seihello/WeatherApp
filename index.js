import { Weather } from "./weather.js"

$(() => {
    let weatherManager = new Weather()

    /* User's location */
    // If user's current location is sucessful to get, display the weather there
    // If it's failed to get, display the weather of the default city
    navigator.geolocation.getCurrentPosition((currentLocation) => {
        weatherManager.showWeatherInCurrentLocation(currentLocation)
    }, () => {
        weatherManager.showWeatherInDefaultCity()
    });

    const searchCityInput = document.querySelector("#search-city")
    let option = { types: ['(cities)'] };
    const autocomplete = new google.maps.places.Autocomplete(searchCityInput, option);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        weatherManager.showWeatherByCityName(searchCityInput.value)
    });
})



