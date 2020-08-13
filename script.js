


$(document).ready(function(){



var cities = ["Salt Lake City", "San Franscisco", "Dallas", "Las Vegas"];

      function displayCityInfo() {
        
        let city = $(this).attr("data-name");
        const APIKey = "166a433c57516f51dfab1f7edaed8413"
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
       
        
        
        $.get(queryURL, function (response) {
         
          console.log(response)
          // const time = moment('');
          // console.log(moment().utc().utcOffset(parseInt(response.timezone)/ *  6000))
       
          const cityWeatherDisplay = $('<div>');
          const cityName = $('<h1>').text(response.name)
          const cityDate = $('<p>').text(new Date());
          const cityIcon = $('<img>').attr('src', 'http://openweathermap.org/img/wn/' +response.weather[0].icon+'@2x.png')
          const cityWindSpeed = $('<p>').text('Wind Speed: ' + response.wind.speed + ' mph');
          const cityTemp = $('<p>').text(response.main.temp);
          const cityHumidity = $('<p>').text('Humidity: ' + response.main.humidity+ '%');
          const cityUV =$('<p>').text('UV Index: ' )
          cityWeatherDisplay.append(cityName, cityDate, cityIcon, cityWindSpeed , cityTemp, cityHumidity, cityUV)
          $('#cityWeatherContainer').append(cityWeatherDisplay)
        });
      }

 
        function renderButtons() {
          $("#cityButtonsContainer").empty();
          for (var i = 0; i < cities.length; i++) {
            var cityButton = $("<button>");
            
            cityButton.addClass("city");
            // Added cityButton data-attribute
            cityButton.attr("data-name", cities[i]);
            // Provided the initial button text
            cityButton.text(cities[i]);
            // Added the button to the buttons-view div
            $("#cityButtonsContainer").append(cityButton);
          }
        }

        // This function handles events where the add movie button is clicked
        $("#searchCity").on("click", function (event) {
          
          event.preventDefault();
          if ($('#cityInput').val() == '') {
            return false;
          }
          // This line of code will grab the input from the textbox
          var city = $("#cityInput").val().trim();

          // The movie from the textbox is then added to our array
          cities.push(city);

          // Calling renderButtons which handles the processing of our movie array
          renderButtons();
        });

        // Adding click event listeners to all elements with a class of "movie"
        $(document).on("click", '.city', displayCityInfo);

        // Calling the renderButtons function to display the initial buttons
        renderButtons();











    })