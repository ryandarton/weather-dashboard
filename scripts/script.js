const APIKey = '74760e6759bf8ce85d049eef88abed35';
const url = 'https://api.openweathermap.org/data/2.5/weather?q=';
const iconUrl = 'http://openweathermap.org/img/w/';

document.getElementById('search-form').addEventListener('submit', function (event) {
  event.preventDefault();
  document.getElementById('main').classList.remove('display');
  document.getElementById('main').classList.add('no-display');
  document.getElementById('spinner').classList.remove('no-display');
  const currentDate = new Date();
  const formattedDate = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear().toString().slice(-2)}`;
  const city = document.getElementById('search-input').value;
  fetch(`${url}${city}&appid=${APIKey}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Invalid city.');
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
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
    })
    .catch((error) => {
      console.error(error);
      alert('Invalid city. Please try again.');
      document.getElementById('spinner').classList.remove('display');
      document.getElementById('spinner').classList.add('no-display');
    });
});
