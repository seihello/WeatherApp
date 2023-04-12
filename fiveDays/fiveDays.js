const cityName ="Fukuoka"
const apiKey ="3b2df1883208190d986bcd1b1e48eff4"
const temperatureType = "metric"
const request = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`


fetch(request)
.then(
    function(response) {
        if(response.status !== 200){
            return;
        }
        response.json().then(function(fiveDaysWeather) {
            console.log(fiveDaysWeather);


            // fecth all the weather info
            let allTheWeatherInfo =fiveDaysWeather["list"].forEach( allTheWeatherInfos=> 
                console.log(allTheWeatherInfos));
        })
    }
)
