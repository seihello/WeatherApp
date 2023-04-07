let autocomplete
function initMap() {
    const searchCityInput = document.querySelector("#search-city")

    autocomplete = new google.maps.places.Autocomplete(searchCityInput);
}