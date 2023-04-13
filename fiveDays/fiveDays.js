const cityName ="Fukuoka"
const apiKey ="3b2df1883208190d986bcd1b1e48eff4"

// to change the unit of temperature from Kelvin to Celsius
const temperatureType = "metric"
const request = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=${temperatureType}&appid=${apiKey}`


fetch(request)
.then(
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
            fiveDaysWeather["list"].forEach( eachWeatherInfo=> {
                console.log(eachWeatherInfo);

                // convert unix-time to date
                let date = new Date(eachWeatherInfo["dt"] * 1000);
                

                // show the next 5 days' weather              
                if(date.getDate() === currentDate.getDate() + day) {
                    if(date.getHours() >=12 && date.getHours() <=15) {
                        console.log(eachWeatherInfo["weather"][0]["main"],eachWeatherInfo["main"]["temp_max"],eachWeatherInfo["main"]["temp_min"]);
                        document.getElementById(`day${day}`).innerHTML= eachWeatherInfo["weather"][0]["main"]
                        document.getElementById(`day${day}-temp-max`).innerHTML= eachWeatherInfo["main"]["temp_max"]
                        document.getElementById(`day${day}-temp-min`).innerHTML= eachWeatherInfo["main"]["temp_min"]
                                  
                        day = day +1; 
                    }
                }
            })
        })
    }
)
