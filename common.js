
export class API {
    static KEY = "c5b83392add58be24fb5a7bd362ced83"

    static getCurrentWeatherUrlByCity(city) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API.KEY}`
    }

    static getCurrentWeatherUrlByLocation(latitude, longitude) {
        return `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API.KEY}`
    }

    static getForecastUrl(city) {
        return `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API.KEY}`
    }

    static getImageUrl(weatherCode) {
        return `https://openweathermap.org/img/wn/${weatherCode}@4x.png`
    }
}

export class Setting {
    static isCelsius = true
    static defaultCity = "Vancouver"
    static storageKey = "favoriteCities"
}

export class Common {

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
