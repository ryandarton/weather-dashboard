const APIKey = '74760e6759bf8ce85d049eef88abed35';
const weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=';
const iconUrl = 'http://openweathermap.org/img/w/';
const forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?';

function displayWeatherData(data) {
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
  const temp = (((data.main.temp - 273.15) * 9) / 5 + 32).toFixed(2);
  const windSpeed = (data.wind.speed * 2.23694).toFixed(2);
  document.getElementById('current-city').innerHTML = `${data.name}`;
  document.getElementById('current-date').innerHTML = `(${formattedDate})`;
  document.getElementById('current-icon').src = `${iconUrl}${data.weather[0].icon}.png`;
  document.getElementById('current-temp').innerHTML = `Temp: ${temp}°F`;
  document.getElementById('current-wind').innerHTML = `Wind: ${windSpeed} MPH`;
  document.getElementById('current-humidity').innerHTML = `Humidity: ${data.main.humidity}%`;
  document.getElementById('main').classList.remove('no-display');
  document.getElementById('main').classList.add('display');
  document.getElementById('spinner').classList.remove('display');
  document.getElementById('spinner').classList.add('no-display');
}

function fetchWeatherData(city) {
  fetch(`${weatherUrl}${city}&appid=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid city.');
      }
      return response.json();
    })
    .then((data) => {
      // console.log(data);
      displayWeatherData(data);
      // Store the city in local storage if it doesn't already exist
      const cityEntries = JSON.parse(localStorage.getItem('cityEntries')) || [];
      if (!cityEntries.includes(city)) {
        cityEntries.push(city);
        localStorage.setItem('cityEntries', JSON.stringify(cityEntries));
        // Add an <li> element for the city in the history list
        const historyList = document.getElementById('history-list');
        const li = document.createElement('li');
        li.classList.add('history-item', 'no-bullet');
        const button = document.createElement('button');
        button.classList.add('secondary');
        button.id = city;
        button.textContent = city;
        li.appendChild(button);
        historyList.appendChild(li);
      }
      // Fetch forecast data using lat and lon
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      fetchForecastData(lat, lon);
    })
    .catch((error) => {
      console.error(error);
      alert('Invalid city. Please try again.');
      document.getElementById('spinner').classList.remove('display');
      document.getElementById('spinner').classList.add('no-display');
    });
}

function fetchForecastData(lat, lon) {
  fetch(`${forecastUrl}lat=${lat}&lon=${lon}&appid=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch forecast data.');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // gather all of the dt values from the forecast data
      const dtValues = [];
      for (let i = 0; i < data.list.length; i += 8) {
        dtValues.push(data.list[i].dt);
      }
      // convert the dt values to dates
      const dates = dtValues.map((dt) => {
        const date = new Date(dt * 1000);
        return date;
      });
      // format the dates to MM/DD/YY
      const formattedDates = dates.map((date) => {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear().toString().slice(-2)}`;
      });
      // gather all of the weather icons from the forecast data
      const icons = [];
      for (let i = 0; i < data.list.length; i += 8) {
        icons.push(data.list[i].weather[0].icon);
      }
      // gather all of the temperatures from the forecast data
      const temps = [];
      for (let i = 0; i < data.list.length; i += 8) {
        temps.push((((data.list[i].main.temp - 273.15) * 9) / 5 + 32).toFixed(2));
      }
      // gather all of the wind speeds from the forecast data
      const windSpeeds = [];
      for (let i = 0; i < data.list.length; i += 8) {
        windSpeeds.push((data.list[i].wind.speed * 2.23694).toFixed(2));
      }
      // gather all of the humidity values from the forecast data
      const humidities = [];
      for (let i = 0; i < data.list.length; i += 8) {
        humidities.push(data.list[i].main.humidity);
      }
      // display the forecast data
      displayForecastData(formattedDates, icons, temps, windSpeeds, humidities);
    });
}

displayForecastData = (dates, icons, temps, windSpeeds, humidities) => {
  const forecastWrapper = document.querySelector('.forecast-wrapper');
  forecastWrapper.innerHTML = ''; // Clear existing forecast cards

  for (let i = 0; i < 5; i++) {
    const forecastCard = document.createElement('div');
    forecastCard.classList.add('forecast-card');

    const date = document.createElement('h3');
    date.classList.add('forecast-info-date');
    date.id = `forecast-info-date-${i}`;
    date.innerHTML = dates[i];
    forecastCard.appendChild(date);

    const icon = document.createElement('p');
    icon.classList.add('forecast-info');
    const iconImg = document.createElement('img');
    iconImg.id = `forecast-info-icon-${i}`;
    iconImg.src = `${iconUrl}${icons[i]}.png`;
    icon.appendChild(iconImg);
    forecastCard.appendChild(icon);

    const temp = document.createElement('p');
    temp.classList.add('forecast-info');
    temp.id = `forecast-info-temp-${i}`;
    temp.innerHTML = `Temp: ${temps[i]}°F`;
    forecastCard.appendChild(temp);

    const wind = document.createElement('p');
    wind.classList.add('forecast-info');
    wind.id = `forecast-info-wind-${i}`;
    wind.innerHTML = `Wind: ${windSpeeds[i]} MPH`;
    forecastCard.appendChild(wind);

    const humidity = document.createElement('p');
    humidity.classList.add('forecast-info');
    humidity.id = `forecast-info-humidity-${i}`;
    humidity.innerHTML = `Humidity: ${humidities[i]}%`;
    forecastCard.appendChild(humidity);

    forecastWrapper.appendChild(forecastCard);
  }
};

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  document.getElementById('main').classList.remove('display');
  document.getElementById('main').classList.add('no-display');
  document.getElementById('spinner').classList.remove('no-display');
  const city = document.getElementById('search-input').value;
  fetchWeatherData(city);
  document.getElementById('search-input').value = ''; // Clear the form input
});

document.getElementById('history-list').addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    event.preventDefault();
    document.getElementById('main').classList.remove('display');
    document.getElementById('main').classList.add('no-display');
    document.getElementById('spinner').classList.remove('no-display');
    const city = event.target.textContent;
    fetchWeatherData(city);
  }
});

// Load all of the last searched cities from local storage
const cityEntries = JSON.parse(localStorage.getItem('cityEntries')) || [];
const historyList = document.getElementById('history-list');
cityEntries.forEach((cityEntry) => {
  const li = document.createElement('li');
  li.classList.add('history-item', 'no-bullet');
  const button = document.createElement('button');
  button.classList.add('secondary');
  button.textContent = cityEntry;
  li.appendChild(button);
  historyList.appendChild(li);
});
