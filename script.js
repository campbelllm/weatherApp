 $(document).ready(function () {
  
  const APIKey = "166a433c57516f51dfab1f7edaed8413";
  let cities = [];
  
  function displayCityInfo() {
    let city = $(this).attr("data-name");
    let queryURL ="https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey;
    $.get(queryURL, function (response) {
     //setting values to html elements to display searched cities current weather
      $("#selectedCity").text(response.name);
      $("#weatherIcon").attr("src","http://openweathermap.org/img/wn/" + response.weather[0].icon +"@2x.png");
      $('#currentDate').text(moment().format("MMMM Do, YYYY"));
      $('windSpeed').text("Wind Speed: " + response.wind.speed + " mph");
      $('#currentTemp').text(response.main.temp);
      $('#humidty').text(response.main.humidity + "%");
      //setting longitude and latitude values for future use
      let lon = response.coord.lon;
      let lat = response.coord.lat;
      //grabbing longitude and latitude values for parameters in next API
      getFiveDayForecast(lon, lat);
    });
  }
  //calling new api provides us with our 5 day forecast and UV index, this api takes longitude and latitude, grabbing those from previous api
  function getFiveDayForecast(lon, lat) {
    $.get(
      "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + APIKey,
      function (response) {
        //grabbing uv index from this API, not available on previous one
        $('#uvIndex').text(response.current.uvi);
        //changing color of UV index to represent current conditions
        if (response.current.uvi <= 3) {
          $('#uvIndex').css("background-color", "green");
        }else if(response.current.uvi <= 6){
          $('#uvIndex').css("background-color", "yellow");
        }else if(response.current.uvi <= 10){
          $('#uvIndex').css("background-color", "orange");
        }else{
          $('#uvIndex').css("background-color", "red");
        }
        //passing in the 5 day forcast array for this function to use
        renderFiveDay(response.daily)
      }
    );
  }

  function renderFiveDay(arr){
     //one cities weather shows up at a time
    $('.fiveDayContainers').empty()
    //creating and assigning elements for 5 day forecast
    for(let i =1; i < arr.length; i++){
      const forecastDays = $('<div>').addClass('forecastDays')
      const forecastDate = $('<p>').text(moment().add(i, 'days').format("ddd-Do"));
      const forecastIcon = $('<img>').attr("src", "http://openweathermap.org/img/wn/" + arr[i].weather[0].icon +"@2x.png");
      const forecastTemp = $('<p>').text('Temp: ' + arr[i].temp.day)
      const forecastHumidity =  $('<p>').text('Humidity: ' + arr[i].humidity)
      forecastDays.append(forecastDate, forecastIcon, forecastTemp, forecastHumidity);
      $('.fiveDayContainers').append(forecastDays)
    }
  }
  //making buttons for each city input
  function renderCityButtons() {
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
  //when the submit button is clicked, grab the input value, and push it to the array, then render the buttons
  $("#searchCity").on("click", function (event) {
    event.preventDefault();
    // doesn't allow user to submit blank input
    if ($("#cityInput").val() == "") {
      return false;
    }
    var city = $("#cityInput").val().trim();
    //pushing city input to our array
    cities.push(city);
    renderCityButtons();
    //clears out input box
    $('#cityInput').val('')
    storeCityInfo()
  });
  // listening for click on classes of .city, then running the displayCity Info function
  $(document).on("click", ".city", displayCityInfo);
  // Calling the renderCityButtons function to display the initial buttons
  
  //LOCAL STORAGE... here we come

  //setting items in cities arr to local storage
  function storeCityInfo() {
     localStorage.setItem('cities',  JSON.stringify(cities));
  }
 //getting stored items,from previouse searches, to render as buttons
  function getCities(){
    //if there are items in a stored 'cities' key, grab them and push to cities arr
    if (localStorage.getItem("cities")) {
      const savedCities = JSON.parse(localStorage.getItem("cities"))
      cities.push(...savedCities)
    }
  }
  getCities()
  renderCityButtons();
 $('button:last-child').click()
  
});
