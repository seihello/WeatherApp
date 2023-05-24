import { Weather } from "./weather.js"
import { FavoriteCity } from "./favoriteCity.js"


$(() => {
    let weatherManager = new Weather()
    let favorityCityManager = new FavoriteCity(weatherManager)
    weatherManager.setFavoriteCity(favorityCityManager)

    /* User's location */
    // If user's current location is sucessful to get, display the weather there
    // If it's failed to get, display the weather of the default city
    navigator.geolocation.getCurrentPosition((currentLocation) => {
        weatherManager.showWeatherInCurrentLocation(currentLocation)
    }, () => {
        weatherManager.showWeatherInDefaultCity()
    });

    $("#search-city").on("change", () => {
        weatherManager.showWeatherByCityName($("#search-city").val())
    })
})



