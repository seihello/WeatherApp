let autocomplete
function initMap() {
    const searchCityInput = document.querySelector("#search-city")

    autocomplete = new google.maps.places.Autocomplete(searchCityInput);
}


const apiKey = "c5b83392add58be24fb5a7bd362ced83"
let cityName = "Vancouver"
const limit = 1
let requestURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`


fetch(requestURL).then((responce) => {
    responce.json().then((data) => {
        console.log(data)
    })
})
.catch((error) => {
    console.log("Fetch Error: " + error)
})