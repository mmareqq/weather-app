import { createEl, appendEl } from './modules/elementCreator';
import { getSVG, appendSVG } from './modules/getSVG';
import formatDate from './modules/dateFormatter';

const myKey = '';

(() => {
   const themeBtn = document.querySelector('#theme');
   themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('theme--light');
      document.body.classList.toggle('theme--dark');
   });
   const btn = document.querySelector('button[type="submit"]');
   btn.addEventListener('click', handleClick);
   handleClick();
   const lightIconEl = document.querySelector('.theme-light-icon');
   const darkIconEl = document.querySelector('.theme-dark-icon');
   appendSVG('./assets/icons/clear-day.svg', lightIconEl);
   appendSVG('./assets/icons/cloudy.svg', darkIconEl);
})();

async function getData(city) {
   try {
      const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${myKey}&contentType=json`;
      const response = await fetch(url, {
         method: 'GET',
         headers: {},
      });
      const json = await response.json();
      return json;
   } catch (err) {
      console.error('Error fetching weather data:', err);
      const errorEl = document.querySelector('.error-message');
      errorEl.classList.add('visible');
      errorEl.textContent = 'Provided city or place is not valid. Please try again.';
   }
}

function updateResultsTime(dateEpoch) {
   const date = new Date(dateEpoch);
   const formattedDate = formatDate(date);
   const resultTimeEl = document.querySelector('.results-time');
   resultTimeEl.textContent = `Results for: ${formattedDate}`;
}

handleClick();

async function handleClick() {
   const input = document.querySelector('#city');
   const value = input.value;
   let city = value;
   if (!city) city = 'New York City';
   let data = await getData(city);
   createNewCard(data, 0, city);
}

function createNewCard(data, index, city) {
   if (!data) return;
   console.log(data);
   const card = new Card(data, index, city);
   updateResultsTime(data.days[index].datetime);
   card.updateDOM();
   if (btnEU.dataset.selected === 'true') {
      updateUnit('us');
      updateUnit('eu');
   } else {
      updateUnit('us');
   }
}

class Card {
   constructor(data, index, city) {
      this.data = data;
      this.index = index;
      this.city = city;
      this.card = this.createCard();
   }

   createCard() {
      const container = document.querySelector('.main__grid');
      container.innerHTML = '';
      const left = appendEl(container, 'div', 'main__left');
      const titleCon = appendEl(left, 'div');
      appendEl(titleCon, 'h2', 'main__title');
      const locationEl = appendEl(left, 'div', 'location');
      appendEl(locationEl, 'span', 'location-icon');
      appendEl(locationEl, 'span', 'lat');
      appendEl(locationEl, 'span', 'long');
      const sunriseEl = appendEl(left, 'div', 'sunrise');
      appendEl(sunriseEl, 'span', 'sunrise-icon');
      appendEl(sunriseEl, 'span', 'content');

      const sunsetEl = appendEl(left, 'div', 'sunset');
      appendEl(sunsetEl, 'span', 'sunset-icon');
      appendEl(sunsetEl, 'span', 'content');

      const right = appendEl(container, 'div', 'main__right');

      const tempEl = appendEl(right, 'div', 'temperature');
      const tempContent = appendEl(tempEl, 'span', 'content');
      tempContent.setAttribute('data-temp', '');
      appendEl(tempEl, 'span', 'temp-unit');

      const tempAmpEl = appendEl(right, 'div', 'temp-amplitude');
      appendEl(tempAmpEl, 'div', 'temp-icon');
      const tempMinEl = appendEl(tempAmpEl, 'div', 'temp-min');
      const slashEl = document.createTextNode('/');
      tempAmpEl.append(slashEl);
      const tempMaxEl = appendEl(tempAmpEl, 'div', 'temp-max');
      const tempMinContent = appendEl(tempMinEl, 'span', 'content');
      const tempMaxContent = appendEl(tempMaxEl, 'span', 'content');
      tempMinContent.setAttribute('data-temp', '');
      tempMaxContent.setAttribute('data-temp', '');
      appendEl(tempMinEl, 'span', 'temp-unit');
      appendEl(tempMaxEl, 'span', 'temp-unit');

      const humiEl = appendEl(right, 'div', 'humidity');
      appendEl(humiEl, 'span', 'humi-icon');
      appendEl(humiEl, 'span', 'content');

      const pressureEl = appendEl(right, 'div', 'pressure');
      appendEl(pressureEl, 'span', 'pressure-icon');
      appendEl(pressureEl, 'span', 'content');

      appendEl(right, 'div', 'wind');

      const precipEl = appendEl(right, 'div', 'precip');
      appendEl(precipEl, 'span', 'precip-icon');
      appendEl(precipEl, 'span', 'content');
      return container;
   }

   updateDOM() {
      const data = this.data;
      const titleEl = this.getEl('main__title');
      const latEl = this.getEl('lat');
      const longEl = this.getEl('long');
      const sunriseEl = this.getElContent('sunrise');
      const sunsetEl = this.getElContent('sunset');
      const temperatureEl = this.getElContent('temperature');
      const minTempEl = this.getElContent('temp-min');
      const maxTempEl = this.getElContent('temp-max');
      const humidityEl = this.getElContent('humidity');
      const windEl = this.getEl('wind');
      const rainChanceEl = this.getElContent('precip');
      const pressureEl = this.getElContent('pressure');

      minTempEl.textContent = data.days[this.index].tempmin;
      maxTempEl.textContent = data.days[this.index].tempmax;

      titleEl.textContent = data.resolvedAddress;
      latEl.textContent = `${data.latitude}, `;
      longEl.textContent = data.longitude;
      sunriseEl.textContent = `Sunrise: ${stripLastChars(data.days[this.index].sunrise)}`;
      sunsetEl.textContent = `Sunset: ${stripLastChars(data.days[this.index].sunset)}`;
      temperatureEl.textContent = `${data.days[this.index].temp}`;
      humidityEl.textContent = `Humidity: ${data.days[this.index].humidity}%`;
      createWindEl(data.days[this.index].winddir, data.days[this.index].windspeed, windEl);
      pressureEl.textContent = `Pressure: ${data.days[this.index].pressure}hPa`;
      rainChanceEl.textContent = `Chance of preciptation: ${data.days[this.index].precipprob}%`;

      appendSVG('./assets/icons/location.svg', this.getEl('location-icon'));
      appendSVG('./assets/icons/sunrise.svg', this.getEl('sunrise-icon'));
      appendSVG('./assets/icons/sunset.svg', this.getEl('sunset-icon'));
      appendSVG('./assets/icons/temperature.svg', this.getEl('temp-icon'));
      appendSVG('./assets/icons/humidity.svg', this.getEl('humi-icon'));
      appendSVG('./assets/icons/pressure.svg', this.getEl('pressure-icon'));
      appendSVG('./assets/icons/rain.svg', this.getEl('precip-icon'));

      this.createHours(data.days[this.index].hours);
      this.createDays(data.days, this.index);
   }

   createHours(hours) {
      if (!hours) return;
      const hourCon = document.querySelector('.hours');
      hourCon.innerHTML = '';
      const fragment = document.createDocumentFragment();
      hours.forEach((hour, index) => {
         const hourEl = new Hour(index, hour.temp, hour.precip, hour.windspeed, hour.winddir).hourEl;

         fragment.appendChild(hourEl);
      });
      hourCon.appendChild(fragment);
   }

   createDays(days, activeIndex) {
      const daysCon = document.querySelector('.forecast');
      daysCon.innerHTML = '';
      const fragment = document.createDocumentFragment();
      days.forEach((day, index) => {
         const dayEl = new Day(this.data, index, this.city, day.tempmin, day.tempmax, day.precip, day.icon).dayEl;
         if (index === activeIndex) {
            dayEl.classList.add('day-active');
         }
         fragment.appendChild(dayEl);
      });
      daysCon.appendChild(fragment);
   }

   getElContent(name) {
      return this.card.querySelector(`.${name}`).querySelector('span.content');
   }

   getEl(name) {
      return this.card.querySelector(`.${name}`);
   }
}

async function createWindEl(dir, speed, container) {
   container.innerHTML = '';
   const icon = appendEl(container, 'span', 'wind-icon');
   const content = appendEl(container, 'span', 'content', 'Wind:');
   appendEl(container, 'span', 'velocity-unit');
   const windDir = appendEl(content, 'span', 'wind-dir');
   windDir.innerHTML = await getSVG('./assets/icons/wind-dir.svg');
   const dirIcon = windDir.querySelector(':scope > svg');
   dirIcon.style.rotate = `${dir}deg`;

   const speedNode = createEl('span');
   speedNode.setAttribute('data-velocity', '');
   speedNode.textContent = speed;
   content.append(speedNode);

   appendSVG('./assets/icons/wind.svg', icon);
}

class Hour {
   constructor(index, temp, precip, wind, windDir) {
      this.index = index;
      this.temp = temp;
      this.precip = precip;
      this.wind = wind;
      this.windDir = windDir;
      this.hourEl = this.createHourEl();
   }

   createHourEl() {
      const container = createEl('div', 'hour');
      const timeEl = appendEl(container, 'div', 'hour__time', `${this.index}:00`);

      const tempEl = appendEl(container, 'div', 'hour__temp');
      const tempContentEl = appendEl(tempEl, 'span', 'content', `${this.temp}`);
      tempContentEl.setAttribute('data-temp', '');
      appendEl(tempEl, 'span', 'temp-unit');

      const windEl = appendEl(container, 'div', 'hour__wind');
      this.createHourWindEl(this.windDir, this.wind, windEl);

      const precipEl = appendEl(container, 'div', 'day__precip');
      const precipIcon = appendEl(precipEl, 'div', 'day__precip-icon');

      appendSVG('./assets/icons/rain.svg', precipIcon);
      appendEl(precipEl, 'span', 'content', `${this.precip}%`);

      return container;
   }

   async createHourWindEl(dir, speed, el) {
      el.innerHTML = '';
      const content = appendEl(el, 'span', 'content');

      const speedNode = createEl('span');
      speedNode.setAttribute('data-velocity', '');
      speedNode.textContent = speed;
      content.append(speedNode);

      appendEl(el, 'span', 'velocity-unit');

      const windDir = appendEl(el, 'span', 'wind-dir');
      windDir.innerHTML = await getSVG('./assets/icons/wind-dir.svg');
      const dirIcon = windDir.querySelector(':scope > svg');
      dirIcon.style.rotate = `${dir}deg`;
   }
}

class Day {
   constructor(data, index, city, minTemp, maxTemp, precip, icon) {
      this.data = data;
      this.index = index;
      this.city = city;
      this.minTemp = minTemp;
      this.maxTemp = maxTemp;
      this.precip = precip;
      this.icon = icon;
      this.dayEl = this.createDay();
   }

   createDay() {
      const container = createEl('button', 'day');
      this.addListener(container);
      const iconEl = appendEl(container, 'div', 'day-icon');
      appendSVG(`./assets/icons/${this.icon}.svg`, iconEl);

      const tempAmp = appendEl(container, 'div', 'day__temp');
      const tempMin = appendEl(tempAmp, 'div', 'day__temp-min');
      const tempMax = appendEl(tempAmp, 'div', 'day__temp-max');

      const tempMinContent = appendEl(tempMin, 'span', 'content', this.minTemp);
      const tempMaxContent = appendEl(tempMax, 'span', 'content', this.maxTemp);
      tempMinContent.setAttribute('data-temp', '');
      tempMaxContent.setAttribute('data-temp', '');

      appendEl(tempMin, 'span', 'temp-unit');
      appendEl(tempMax, 'span', 'temp-unit');

      const precipEl = appendEl(container, 'div', 'day__precip');
      const precipIcon = appendEl(precipEl, 'div', 'day__precip-icon');

      appendSVG('./assets/icons/rain.svg', precipIcon);
      appendEl(precipEl, 'span', 'content', `${this.precip}%`);

      return container;
   }

   addListener(button) {
      button.addEventListener('click', () => {
         createNewCard(this.data, this.index, this.city);
      });
   }
}

function stripLastChars(string) {
   return string.slice(0, string.length - 3);
}

// OTHER

const btnUS = document.querySelector('button[data-unit="us"]');
const btnEU = document.querySelector('button[data-unit="eu"]');

function handleUnit(e) {
   const btn = e.target;
   updateUnit(btn.dataset.unit);
}

btnUS.addEventListener('click', e => {
   if (btnUS.dataset.selected === 'true') return;
   handleUnit(e);
   btnEU.dataset.selected = 'false';
   btnUS.dataset.selected = 'true';
});
btnEU.addEventListener('click', e => {
   if (btnEU.dataset.selected === 'true') return;
   handleUnit(e);
   btnEU.dataset.selected = 'true';
   btnUS.dataset.selected = 'false';
});

function updateUnit(unit) {
   const tempUnit = unit === 'us' ? 'ºF' : 'ºC';
   const velocityUnit = unit === 'us' ? 'm/s' : 'km/h';
   const tempArr = document.querySelectorAll('.temp-unit');
   const VelocityArr = document.querySelectorAll('.velocity-unit');

   tempArr.forEach(element => {
      element.textContent = tempUnit;
   });
   VelocityArr.forEach(element => {
      element.textContent = velocityUnit;
   });

   const dataTempArr = document.querySelectorAll('[data-temp]');
   const dataVelocityArr = document.querySelectorAll('[data-velocity]');

   dataTempArr.forEach(el => {
      const temp = parseFloat(el.textContent);
      el.textContent = convertTemp(temp, unit);
   });

   dataVelocityArr.forEach(el => {
      const vel = parseFloat(el.textContent);
      el.textContent = convertVelocity(vel, unit);
   });
}

function convertTemp(temp, unit) {
   if (unit === 'us') {
      return (temp * 1.8 + 32).toFixed(1);
   } else if (unit === 'eu') {
      return (((temp - 32) * 5) / 9).toFixed(1);
   }
}

function convertVelocity(vel, unit) {
   if (unit === 'us') {
      return ((vel * 5) / 18).toFixed(1);
   } else if (unit === 'eu') {
      return (vel * 3.6).toFixed(1);
   }
}
