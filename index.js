/* Elements */
const searchCityInput = document.querySelector("#search-city")
const favoriteStarElement = document.querySelector("#favorite-star")
const favoriteCitiesMenu = document.querySelector("#favorite-cities")
const currentWeatherSectionElement = document.querySelector("#current-weather-section")
const currentWeatherElement = document.querySelector("#current-weather")
let selectedCity = ""

let weatherManager = null
let favorityCityManager = null

/* Auto Complete */
window.initMap = function() {
    // Suggest only cities
    let option = {
        types: ['(cities)']
    };
    const autocomplete = new google.maps.places.Autocomplete(searchCityInput, option);

    google.maps.event.addListener(autocomplete, 'place_changed', () => {
        weatherManager.showWeatherByCityName(searchCityInput.value)
    });
}

$(() => {

    weatherManager = new Weather()
    favorityCityManager = new FavoriteCity(weatherManager)
    weatherManager.setFavoriteCity(favorityCityManager)

    /* User's location */
    // If user's current location is sucessful to get, display the weather there
    // If it's failed to get, display the weather of the default city
    navigator.geolocation.getCurrentPosition((currentLocation) => {
        weatherManager.showWeatherInCurrentLocation(currentLocation)
    }, () => {
        weatherManager.showWeatherInDefaultCity()
    });
});

class Admin {
    static apiKey = "c5b83392add58be24fb5a7bd362ced83"
}

class Setting {
    static isCelsius = true
    static defaultCity = "Vancouver"
    static storageKey = "favoriteCities"
}

class FavoriteCity {
    constructor(currentWeather) {
        this.currentWeather = currentWeather
        this.favoriteCities = {}

        // Add an event listener to the favorite star icon
        favoriteStarElement.addEventListener("click", () => {
            this.onFavoriteStarClicked()
        })
        // Add an event listener to the pull-down menu
        favoriteCitiesMenu.addEventListener("change", () => {
            this.onFavoriteCitySelected()
        })

        // Set up for user's favorite cities
        this.getFavoriteCitiesFromStorage()
    }

    getFavoriteCitiesFromStorage() {
        // Get user's favorite cities from local storage
        let favoriteCitiesJSON = localStorage.getItem(Setting.storageKey)

        // If data exists
        if(favoriteCitiesJSON !== null) {
            // Convert to an array
            this.favoriteCities = JSON.parse(favoriteCitiesJSON)

            // Deploy to the pull-down menu
            for(let countryGroup of Object.keys(this.favoriteCities)) {

                const countryOptionGroup = document.createElement("optgroup")
                countryOptionGroup.label = countryGroup
        
                for(let favoriteCity of this.favoriteCities[countryGroup]) {
                    const favoriteCityOption = document.createElement("option")
                    favoriteCityOption.classList.add("favorite-city")
                    favoriteCityOption.innerText = favoriteCity
                    countryOptionGroup.appendChild(favoriteCityOption)
                }
                favoriteCitiesMenu.appendChild(countryOptionGroup)
            }
        }
    }

    onFavoriteStarClicked() {    
        const displayedCity = $("#city-name").text()
        const displayedCountry = $("#country-code").text()
        let isNewCity = true
        let isNewCountry = true

        if(displayedCountry in this.favoriteCities) {
            isNewCountry = false
            if(this.favoriteCities[displayedCountry].includes(displayedCity)) {
                isNewCity = false
            }
        }
        
        // If the displayed city is new
        if(isNewCity) {
            // Create an option element that will be added to the pull-down menu
            const newFavoriteCityOption = document.createElement("option")
            newFavoriteCityOption.classList.add("favorite-city")
            newFavoriteCityOption.innerText = displayedCity
            
            if(isNewCountry) {
                // Add a new country group with a new city to the favorite cities
                this.favoriteCities[displayedCountry] = [displayedCity]

                // Add a new country group with a new option to the pull-down menu
                const newCountryGroup = document.createElement("optgroup")
                newCountryGroup.label = displayedCountry
                newCountryGroup.appendChild(newFavoriteCityOption)
                favoriteCitiesMenu.appendChild(newCountryGroup)
            } else {
                // Add a new city to its country group that already exists
                this.favoriteCities[displayedCountry].push(displayedCity)

                // Add a new option to its country group that already exists
                for(let i = 1; i < favoriteCitiesMenu.children.length; i++) {
                    if(favoriteCitiesMenu.children[i].label === displayedCountry) {
                        favoriteCitiesMenu.children[i].appendChild(newFavoriteCityOption)
                    }
                }
            }
            
        }
        // If the displayed city is already registered
        else {
            // Remove the displayed city from the favorite cities
            let index = this.favoriteCities[displayedCountry].indexOf(displayedCity)
            this.favoriteCities[displayedCountry].splice(index, 1)
            if(this.favoriteCities[displayedCountry].length === 0) {
                delete this.favoriteCities[displayedCountry]
            }

            // Remove the displayed city from the pull-down menu
            for(let i = 1; i < favoriteCitiesMenu.children.length; i++) {
                if(favoriteCitiesMenu.children[i].label === displayedCountry) {
                    for(let j = 0; j < favoriteCitiesMenu.children[i].children.length; j++) {
                        if(favoriteCitiesMenu.children[i].children[j].innerText === displayedCity) {
                            favoriteCitiesMenu.children[i].removeChild(favoriteCitiesMenu.children[i].children[j])
                        }
                    }
                }
                if(favoriteCitiesMenu.children[i].children.length === 0) {
                    favoriteCitiesMenu.removeChild(favoriteCitiesMenu.children[i])
                }
            }
        }

        // Update user's local storage (Just fully copy the array as JSON)
        localStorage.setItem(Setting.storageKey, JSON.stringify(this.favoriteCities))

        // Update the star sign
        this.setFavoriteStar()

        // Change the selected city on the pull-down menu
        this.changeSelectedFavoriteCityOption($("#city-name").text())
    }

    setFavoriteStar() {
        // If displayed city is one of the favorite then the star should be filled
        let cityExists = false
        Object.values(this.favoriteCities).forEach((element, index) => {
            if(element.includes($("#city-name").text())) {
                cityExists = true
            }
        })
        
        if(cityExists) {
            favoriteStarElement.src = "img/star-on.png"
        } else {
            favoriteStarElement.src = "img/star-off.png"
        }
    }

    onFavoriteCitySelected(event) {
        // Show the weather based on the selected city
        this.currentWeather.showWeatherByCityName(event.target.value)

        // Update the star sign
        this.setFavoriteStar()
    }


    // Make the displayed city selected if it's one of the favorite cities
    changeSelectedFavoriteCityOption(displayedCityName) {
        // Make the title selected in case the displayed city is not a favorite city
        favoriteCitiesMenu.children[0].selected = true
        console.log(favoriteCitiesMenu)

        // Check every option and make it selected if it matches the displayed city
        for(const favoriteCountryGroup of favoriteCitiesMenu.children) {
            for(const favoriteCityOption of favoriteCountryGroup.children) {
                if(favoriteCityOption.innerText === displayedCityName) {
                    favoriteCityOption.selected = true
                } else {
                    favoriteCityOption.selected = false
                }
            }
        }
    }
}

class Weather {

    constructor() {
        // Hide the current weather until calling all API finishes
        currentWeatherSectionElement.style["opacity"] = 0

        // Display today's 3-hourly weather when the user clickes the current weather
        currentWeatherElement.addEventListener("click", () => {
            weatherManager.showThreeHourlyWeather(0)
        })

        $(".daily-forecast").each((index, element) => {
            $(element).on("click", () => {
                weatherManager.showThreeHourlyWeather(index+1)
            })
        })
    }

    setFavoriteCity(favoriteCity) {
        this.favoriteCity = favoriteCity
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
            // Update the display using the data
            $("#city-name").text(currentWeather["name"])
            $("#current-temperature-text").text(Math.floor(currentWeather["main"]["temp"]))
            $("#current-weather-text").text(currentWeather["weather"][0]["main"])
            $("#weather-icon").attr("src", `https://openweathermap.org/img/wn/${currentWeather["weather"][0]["icon"]}@4x.png`)

            const countryCode = currentWeather["sys"]["country"]
            $("#country-code").text(countryCode)
            $("#national-flag").attr("src", `https://flagsapi.com/${countryCode}/flat/64.png`)
            const currentTime = new Date(currentWeather["dt"]*1000)
            const currentTimeText = `As of ${Common.toMonthText(currentTime.getMonth())}${currentTime.getDate()}, ${currentTime.getFullYear()} ${Common.toAMPM(currentTime.getHours(), currentTime.getMinutes())}`
            $("#current-time").text(currentTimeText)

            // Update the star sign
            this.favoriteCity.setFavoriteStar()

            // Show the current weather
            currentWeatherSectionElement.style["opacity"] = 1

            // Change the selected city on the pull-down menu
            this.favoriteCity.changeSelectedFavoriteCityOption($("#city-name").text())

            // Call the function to display the weather of the next 5 days here
            selectedCity = currentWeather["name"]
            this.showFiveDaysWeather()
            this.showThreeHourlyWeather(0)
        })
        .catch((error) => {
            console.log("Fetch Error: " + error)
        })
    }

    showWeatherByCityName(cityName) {
        const temperatureType = Setting.isCelsius ? "metric" : "imperial" 
        const request = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${Setting.temperatureType}&appid=${Admin.apiKey}`

        this.showWeather(request)
    }

    showWeatherByLocation(latitude, longtitude) {
        const temperatureType = Setting.isCelsius ? "metric" : "imperial" 
        const request = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&units=${temperatureType}&appid=${Admin.apiKey}`

        this.showWeather(request)
    }

    showWeatherInCurrentLocation(currentLocation) {
        favoriteStarElement.style["opacity"] = 100
        this.showWeatherByLocation(currentLocation["coords"]["latitude"], currentLocation["coords"]["longitude"])
    }

    showWeatherInDefaultCity() {
        favoriteStarElement.style["opacity"] = 100
        this.showWeatherByCityName(Setting.defaultCity)
    }


    showFiveDaysWeather() {
        const request = `https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${Admin.apiKey}`

        fetch(request).then(
            function(response) {
                if(response.status !== 200){
                    return;
                }
                response.json().then(function(fiveDaysWeather) {
                    console.log(fiveDaysWeather);

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
                            $(".daily-forecast").eq(day-1).children("img").attr("src", `https://openweathermap.org/img/wn/${threeHourlyWeather["weather"][0]["icon"]}@4x.png`);

                            const temperature = Math.floor(threeHourlyWeather["main"]["temp"])
                            $(".daily-forecast").eq(day-1).children("p").eq(3).text(`${temperature}℃`)
                            
                            day++;
                        }
                    })
                })
            }
        ).catch((error) => {
            console.log("Fetch Error: " + error)
        })
    }


    showThreeHourlyWeather(selectedDateOffset) {
        fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${selectedCity}&units=metric&appid=${Admin.apiKey}`)
        .then(
            function(response) {
                response.json().then(function(data) {

                    let weatherList = data["list"]
                    
                    const selectedDate = new Date().getDate() + selectedDateOffset;

                    // Set empty value to all the 3-hourly range
                    $(".three-hour-forecast").each((index, element) => {
                        $(element).children("p").eq(1).text("")
                        $(element).children("p").eq(2).text("")
                        $(element).children("img").attr("src", "")
                    })

                    
                    //For Each to show the Weather through all the hour Ranges
                    let rangeIndex = 0
                    weatherList.forEach((weather, index) => {
                        
                        let date = new Date(weather["dt"] * 1000);
            
                        console.log(weather)
                        if (date.getDate() === selectedDate) {
                            $(".three-hour-forecast").eq(rangeIndex).children("p").eq(1).text(weather["weather"][0]["main"]);
                            
                            $(".three-hour-forecast").eq(rangeIndex).children("img").attr("src", `https://openweathermap.org/img/wn/${weather["weather"][0]["icon"]}@4x.png`);
                            
                            $(".three-hour-forecast").eq(rangeIndex).children("p").eq(2).text(`${weather["weather"][0]["main"]}°C`);

                            rangeIndex += 1;                    
                        }
                    }) 
                })
            }
        )
    }
}





class Common {

    static toMonthText(month) {
        switch(month) {
            case 0:
                return "Jan."
            case 1:
                return "Fab."
            case 2:
                return "Mar."
            case 3:
                return "Apr."
            case 4:
                return "May."
            case 5:
                return "Jun."
            case 6:
                return "Jul."
            case 7:
                return "Aug."
            case 8:
                return "Sep."
            case 9:
                return "Oct."
            case 10:
                return "Nov."
            case 11:
                return "Dec."
        }
    }
    
    static toAMPM(hour, minute) {
        if(minute < 10) {
            minute = "0" + minute
        }
        if(hour === 0) {
            return `${12}:${minute} AM`
        }
        else if(hour < 12) {
            return `${hour}:${minute} AM`
        }
        else if(hour === 12) {
            return `${12}:${minute} PM`
        }
        else if(hour > 12) {
            return `${hour-12}:${minute} PM`
        }
    }
    
    static toDay(day) {
        switch(day) {
            case 0:
                return "Sun"
            case 1:
                return "Mon"
            case 2:
                return "Tue"
            case 3:
                return "Wed"
            case 4:
                return "Thu"
            case 5:
                return "Fri"
            case 6:
                return "Sat"
            default:
                return "None"
        }
    }
}





