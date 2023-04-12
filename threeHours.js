threeHRange("Vancouver", 1);

function threeHRange (city, day) {

fetch (`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=42da94770c5c8f2ed979107d60b61299`)
.then(
    function(response) {
        response.json() .then(function(data) {
            console.log(data);

            console.log(data["list"][0]);
            var date = new Date(data["list"][0]["dt"] * 1000);
            console.log(date)

            let weatherList = data["list"]
            
            console.log(weatherList[0]["weather"][0]["main"])


           const currentDate = new Date();
           const compareDate = currentDate.getDate() + day;

           let threeHBox = document.getElementsByClassName("threeH-box");

          let rangeIndex = 0;

           weatherList.forEach((weather, index) => {
           


            let date = new Date(weather["dt"] * 1000);
            

            if (date.getDate() === compareDate) {
                const weatherRange = document.getElementsByClassName("weatherRange" + rangeIndex);
                weatherRange[0].innerText = weather["weather"][0]["main"];
                rangeIndex += 1;

                console.log(weatherRange)
            
            
            }

            

          })
           

    
          
        })
    }
)

}