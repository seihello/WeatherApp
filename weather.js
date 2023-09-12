import { Setting, API, Common } from "./common.js"
import { FavoriteCity } from "./favoriteCity.js"

export class Weather {

    constructor() {
        this.favoriteCity = new FavoriteCity(this)
        this.selectedCity = ""

        // Hide the current weather until calling all API finishes
        $("#current-weather-section").css("opacity", 0)

        $(".daily-forecast").each((index, element) => {
            $(element).on("click", () => {
                this.showThreeHourlyWeather(index+1)
            })
        })
    }

    /* Current Weather */
    showWeather(request) {
        // Call OpenWeather API to get data
        fetch(request).then((response) => {
            if(response.status === 404) {
                alert("No weather data of the selected place.")
                return;
            } else if(response.status !== 200) {
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
            const currentTime = new Date(currentWeather["dt"]*1000)
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
            if(response.status !== 200){
                return;
            }
            return response.json()
        })
        .then((fiveDaysWeather) => {

            // get currentDate
            let currentDate = new Date();
            // for the if statement to specific the date, the time and weather infos
            let day = 1;

            // get all the weather info
            fiveDaysWeather["list"].forEach( (threeHourlyWeather, index) => {
            
                // convert unix-time to date
                let date = new Date(threeHourlyWeather["dt"] * 1000);  
                
                // show the next 5 days' weather              
                if(date.getDate() === currentDate.getDate() + day && (date.getHours() >= 6 && date.getHours() <= 9)) {

                    const dateText = `${Common.toDay(date.getDay())} ${Common.toMonthText(date.getMonth())} ${date.getDate()}`
                    $(".daily-forecast").eq(day-1).children("p").eq(0).text(dateText)

                    $(".daily-forecast").eq(day-1).children("p").eq(1).text(threeHourlyWeather["weather"][0]["main"])
                    $(".daily-forecast").eq(day-1).children("img").attr("src", API.getImageUrl(threeHourlyWeather["weather"][0]["icon"]));

                    const temperature = Math.floor(threeHourlyWeather["main"]["temp"])
                    $(".daily-forecast").eq(day-1).children("p").eq(3).text(`${temperature}℃`)
                    
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

            // Set empty value to all the 3-hourly range
            $(".three-hour-forecast").each((index, element) => {
                $(element).children("p").eq(1).text("")
                $(element).children("p").eq(2).text("")
                $(element).children("img").attr("src", "")
            })

            //For Each to show the Weather through all the hour Ranges
            weatherList.forEach((weather, index) => {
                
                let date = new Date(weather["dt"] * 1000);
    
                if (date.getDate() === selectedDate) {
                    // Calculate in which range the data should be
                    const rangeIndex = Math.floor(date.getHours() / 3)
                    const rangeDiv = $(".three-hour-forecast").eq(rangeIndex)

                    rangeDiv.children("p").eq(1).text(weather["weather"][0]["main"]);
                    rangeDiv.children("img").attr("src", API.getImageUrl(weather["weather"][0]["icon"]))
                    rangeDiv.children("p").eq(2).text(`${Math.floor(weather["main"]["temp"])}°C`);                      
                }
            })
        })
        .catch((error) => {
            console.log("Fetch Error: " + error)
        })
    }
}

