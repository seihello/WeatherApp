import { Setting, API } from "./common.js"

export class FavoriteCity {
    constructor(currentWeather) {

        this.currentWeather = currentWeather
        this.favoriteCities = {}

        // Add an event listener to the favorite star icon
        $("#favorite-star").on("click", () => {
            this.onFavoriteStarClicked()
        })
        // Add an event listener to the pull-down menu
        $("#favorite-cities").on("change", (event) => {
            this.onFavoriteCitySelected(event)
        })
        // Add an event listener to the favorite star icon
        $("#clear-input").on("click", () => {
            this.onClickedClearInput()
        })

        // Set up for user's favorite cities
        this.getFavoriteCitiesFromStorage()
    }

    getFavoriteCitiesFromStorage() {
        // Get user's favorite cities from local storage
        let favoriteCitiesJSON = localStorage.getItem(Setting.storageKey)

        // If data exists
        if (favoriteCitiesJSON !== null) {
            // Convert to an array
            this.favoriteCities = JSON.parse(favoriteCitiesJSON)

            // Deploy to the pull-down menu
            for (let countryGroup of Object.keys(this.favoriteCities)) {

                const countryOptionGroup = document.createElement("optgroup")
                countryOptionGroup.label = countryGroup

                for (let favoriteCity of this.favoriteCities[countryGroup]) {
                    const favoriteCityOption = document.createElement("option")
                    favoriteCityOption.classList.add("favorite-city")
                    favoriteCityOption.innerText = favoriteCity
                    countryOptionGroup.appendChild(favoriteCityOption)
                }
                $("#favorite-cities").append(countryOptionGroup)
            }
        }
    }

    onFavoriteStarClicked() {
        const displayedCity = $("#city-name").text()
        const displayedCountry = $("#country-code").text()
        let isNewCity = true
        let isNewCountry = true

        if (displayedCountry in this.favoriteCities) {
            isNewCountry = false
            if (this.favoriteCities[displayedCountry].includes(displayedCity)) {
                isNewCity = false
            }
        }

        // If the displayed city is new
        if (isNewCity) {
            // Create an option element that will be added to the pull-down menu
            const newFavoriteCityOption = document.createElement("option")
            newFavoriteCityOption.classList.add("favorite-city")
            newFavoriteCityOption.innerText = displayedCity

            if (isNewCountry) {
                // Add a new country group with a new city to the favorite cities
                this.favoriteCities[displayedCountry] = [displayedCity]

                // Add a new country group with a new option to the pull-down menu
                const newCountryGroup = document.createElement("optgroup")
                newCountryGroup.label = displayedCountry
                newCountryGroup.appendChild(newFavoriteCityOption)
                $("#favorite-cities").append(newCountryGroup)
            } else {
                // Add a new city to its country group that already exists
                this.favoriteCities[displayedCountry].push(displayedCity)

                // Add a new option to its country group that already exists
                for (let i = 1; i < $("#favorite-cities").children.length; i++) {
                    if ($("#favorite-cities").children().eq(i).attr("label") === displayedCountry) {
                        $("#favorite-cities").children().eq(i).append(newFavoriteCityOption)
                    }
                }
            }

        }
        // If the displayed city is already registered
        else {
            // Remove the displayed city from the favorite cities
            let index = this.favoriteCities[displayedCountry].indexOf(displayedCity)
            this.favoriteCities[displayedCountry].splice(index, 1)
            if (this.favoriteCities[displayedCountry].length === 0) {
                delete this.favoriteCities[displayedCountry]
            }

            // Remove the displayed city from the pull-down menu
            $("#favorite-cities").children().each((index, countryGroup) => {
                if (index !== 0) {
                    if ($(countryGroup).attr("label") === displayedCountry) {
                        $(countryGroup).children().each((index, cityOption) => {
                            if ($(cityOption).text() === displayedCity) {
                                $(cityOption).remove()
                            }
                        })
                    }
                    if ($(countryGroup).children().length === 0) {
                        $(countryGroup).remove()
                    }
                }
            })
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
            if (element.includes($("#city-name").text())) {
                cityExists = true
            }
        })

        if (cityExists) {
            $("#favorite-star").attr("src", "img/star-on.png")
        } else {
            $("#favorite-star").attr("src", "img/star-off.png")
        }
    }

    onFavoriteCitySelected(event) {
        // Show the weather based on the selected city
        this.currentWeather.showWeather(API.getCurrentWeatherUrlByCity(event.target.value))

        // Update the star sign
        this.setFavoriteStar()
    }


    // Make the displayed city selected if it's one of the favorite cities
    changeSelectedFavoriteCityOption(displayedCityName) {
        // Make the title selected in case the displayed city is not a favorite city
        $("#favorite-cities").children().eq(0).attr("selected", true)

        // Check every option and make it selected if it matches the displayed city
        for (const favoriteCountryGroup of $("#favorite-cities").children()) {
            for (const favoriteCityOption of favoriteCountryGroup.children) {
                if (favoriteCityOption.innerText === displayedCityName) {
                    favoriteCityOption.selected = true
                } else {
                    favoriteCityOption.selected = false
                }
            }
        }
    }

    onClickedClearInput() {
        $("#search-city").val("");
    }
}