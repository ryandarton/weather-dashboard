const APIKey = '74760e6759bf8ce85d049eef88abed35';
const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
const iconUrl = 'http://openweathermap.org/img/w/';

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
  fetch(`${url}${city}&appid=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid city.');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
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
    })
    .catch((error) => {
      console.error(error);
      alert('Invalid city. Please try again.');
      document.getElementById('spinner').classList.remove('display');
      document.getElementById('spinner').classList.add('no-display');
    });
}

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  document.getElementById('main').classList.remove('display');
  document.getElementById('main').classList.add('no-display');
  document.getElementById('spinner').classList.remove('no-display');
  const city = document.getElementById('search-input').value;
  fetchWeatherData(city);
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
