import { Setting, API, Common } from "./common.js"
import { FavoriteCity } from "./favoriteCity.js"

export class Weather {

    constructor() {
        this.favoriteCity = new FavoriteCity(this)
        this.selectedCity = ""

        // Hide the current weather until calling all API finishes
        $("#current-weather-section").css("opacity", 0)


    }

    /* Current Weather */
    showWeather(request) {
        // Call OpenWeather API to get data
        fetch(request).then((response) => {
            if (response.status === 404) {
                alert("No weather data of the selected place.")
                return;
            } else if (response.status !== 200) {
                console.log("Status Error!", response.status)
                return
            }
            return response.json()
        })
            .then((currentWeather) => {
                console.log(currentWeather)
                // Update the display using the data
                $("#city-name").text(currentWeather["name"])
                $("#current-temperature-text").text(Math.floor(currentWeather["main"]["temp"]))
                $("#current-weather-text").text(currentWeather["weather"][0]["main"])
                $("#weather-icon").attr("src", API.getImageUrl(currentWeather["weather"][0]["icon"]))

                const countryCode = currentWeather["sys"]["country"]
                $("#country-code").text(countryCode)
                $("#national-flag").attr("src", `https://flagsapi.com/${countryCode}/flat/64.png`)
                const currentTime = new Date(currentWeather["dt"] * 1000)
                const currentTimeText = `As of ${Common.toMonthText(currentTime.getMonth())}${currentTime.getDate()}, ${currentTime.getFullYear()} ${Common.toAMPM(currentTime.getHours(), currentTime.getMinutes())}`
                $("#current-time").text(currentTimeText)

                // Update the star sign
                this.favoriteCity.setFavoriteStar()

                // Show the current weather
                $("#current-weather-section").css("opacity", 1)

                // Change the selected city on the pull-down menu
                this.favoriteCity.changeSelectedFavoriteCityOption($("#city-name").text())

                // Call the function to display the weather of the next 5 days here
                this.selectedCity = currentWeather["name"]
                this.showFiveDaysWeather()
                this.showThreeHourlyWeather(0)
            })
            .catch((error) => {
                console.log("Fetch Error: " + error)
            })
    }

    showWeatherInCurrentLocation(currentLocation) {
        $("#favorite-star").css({
            opacity: 100
        })
        this.showWeather(API.getCurrentWeatherUrlByLocation(currentLocation["coords"]["latitude"], currentLocation["coords"]["longitude"]))
    }

    showWeatherInDefaultCity() {
        $("#favorite-star").css({
            opacity: 100
        })
        this.showWeather(API.getCurrentWeatherUrlByCity(Setting.defaultCity))
    }


    showFiveDaysWeather() {

        fetch(API.getForecastUrl(this.selectedCity))
            .then((response) => {
                if (response.status !== 200) {
                    return;
                }
                return response.json()
            })
            .then((fiveDaysWeather) => {

                let currentDate = new Date();
                let day = 0;

                $("#daily-forecast").html("");

                // get all the weather info
                fiveDaysWeather["list"].forEach((threeHourlyWeather, index) => {

                    // convert unix-time to date
                    let date = new Date(threeHourlyWeather["dt"] * 1000);

                    let isTarget = false;

                    if (date.getDate() === currentDate.getDate() + day) {
                        if (index === 0) {
                            if (12 <= date.getHours()) {
                                isTarget = true;
                            }
                        } else if (fiveDaysWeather["list"].length - 1) {
                            isTarget = true;
                        } else {
                            if ((12 <= date.getHours() && date.getHours() <= 15)) {
                                isTarget = true;
                            }
                        }
                    }

                    // show the next 5 days' weather              
                    if (isTarget) {

                        const dateText = `${Common.toDay(date.getDay())} ${Common.toMonthText(date.getMonth())} ${date.getDate()}`;
                        const weatherText = threeHourlyWeather["weather"][0]["main"];
                        const iconSource = API.getImageUrl(threeHourlyWeather["weather"][0]["icon"]);
                        const temperature = Math.floor(threeHourlyWeather["main"]["temp"])

                        const oneDayForecastElement = `
                            <div class="one-day-forecast">
                                <p class="date">${dateText}</p>
                                <p class="weather">${weatherText}</p>
                                <img class="icon" src="${iconSource}">
                                <p class="temperature">${temperature}℃</p>
                            </div>`;
                        $("#daily-forecast").append(oneDayForecastElement);

                        $("#daily-forecast").children().each((index, element) => {
                            $(element).on("click", () => {
                                this.showThreeHourlyWeather(index)
                            })
                        })

                        day++;
                        
                    }
                })
            })
            .catch((error) => {
                console.log("Fetch Error: " + error)
            })
    }


    showThreeHourlyWeather(selectedDateOffset) {
        fetch(API.getForecastUrl(this.selectedCity))
            .then((response) => {
                return response.json()
            })
            .then((data) => {

                let weatherList = data["list"]

                const selectedDate = new Date().getDate() + selectedDateOffset;

                $("#three-hourly-forecast").html("");

                //For Each to show the Weather through all the hour Ranges
                weatherList.forEach((weather, index) => {

                    let date = new Date(weather["dt"] * 1000);

                    if (date.getDate() === selectedDate) {
                        // Calculate in which range the data should be
                        const rangeIndex = Math.floor(date.getHours() / 3)

                        const threeHoulyForecastElement = `
                        <div class="three-hour-forecast">
                            <p>${threeHourSpanText[rangeIndex]}</p>
                            <p>${weather["weather"][0]["main"]}</p>
                            <img class="three-hour-forecast-image" src=${API.getImageUrl(weather["weather"][0]["icon"])}>
                            <p>${Math.floor(weather["main"]["temp"])}°C</p>
                        </div>`;

                        $("#three-hourly-forecast").append(threeHoulyForecastElement);
                    }
                })

                if (selectedDateOffset === 0) {
                    $("#three-hourly-forecast").addClass("today");
                } else {
                    $("#three-hourly-forecast").removeClass("today");
                }
            })
            .catch((error) => {
                console.log("Fetch Error: " + error)
            })
    }
}

const threeHourSpanText = [
    "12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"
];

