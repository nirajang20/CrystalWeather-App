document.addEventListener('DOMContentLoaded', function () {
    // --- State and Config ---
    let tempChart;
    let currentUnit = 'imperial';
    let localTimeInterval;
    let lastQuery;

    // --- DOM Elements ---
    const allElements = {
        favicon: document.getElementById('favicon'), // This line is correct
        location: document.getElementById('current-location'),
        localTime: document.getElementById('local-time'),
        // ... all other elements
        temp: document.getElementById('current-temp'),
        tempUnit: document.getElementById('temp-unit'),
        icon: document.getElementById('current-weather-icon'),
        desc: document.getElementById('current-weather-desc'),
        range: document.getElementById('current-temp-range'),
        feelsLike: document.getElementById('current-feels-like'),
        wind: document.getElementById('current-wind'),
        aqiBadge: document.querySelector('.aqi-badge'),
        aqiValue: document.getElementById('aqi-value'),
        aqiLabel: document.getElementById('aqi-label'),
        forecast: document.getElementById('forecast-container'),
    };
    
    // ... all other variables and constants ...
    const loader = document.getElementById('loader');
    const body = document.body;
    const effectsContainer = document.getElementById('weather-effects-container');
    const unitSwitch = document.getElementById('unit-switch');
    const searchBtn = document.querySelector('.search-btn');
    const searchOverlay = document.getElementById('search-overlay');
    const closeSearchBtn = document.getElementById('close-search');
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const citySuggestions = document.getElementById('city-suggestions');
    const majorCities = ["Tokyo","Delhi","Shanghai","Sao Paulo","Mumbai","Mexico City","Beijing","Osaka","Cairo","New York","Dhaka","Karachi","Buenos Aires","Kolkata","Istanbul","Chongqing","Lagos","Manila","Rio de Janeiro","Tianjin","Kinshasa","Guangzhou","Los Angeles","Moscow","Shenzhen","Lahore","Bangalore","Paris","Bogota","Jakarta","Chennai","Lima","Bangkok","Seoul","Nagoya","Hyderabad","London","Tehran","Chicago","Chengdu","Nanjing","Wuhan","Ho Chi Minh City","Luanda","Ahmedabad","Kuala Lumpur","Hong Kong","Dongguan","Hangzhou","Foshan","Riyadh","Shenyang","Baghdad","Santiago","Surat","Madrid","Suzhou","Pune","Harbin","Houston","Dallas","Toronto","Dar es Salaam","Miami","Belo Horizonte","Singapore","Philadelphia","Atlanta","Fukuoka","Khartoum","Barcelona","Johannesburg","Saint Petersburg","Qingdao","Dalian","Washington, D.C.","Yangon","Alexandria","Jinan","Guadalajara"];

    // --- Core Logic & UI Updates ---
    function updateUI(weatherData, aqiData) {
        const { city, list } = weatherData;
        const firstForecast = list[0];
        const units = { temp: currentUnit === 'metric' ? '°C' : '°F', wind: currentUnit === 'metric' ? 'km/h' : 'mph', windFactor: currentUnit === 'metric' ? 3.6 : 1, };

        // THIS IS THE CORRECTED, DEFENSIVE CODE
        // First check if the favicon element was found before trying to use it
        if (allElements.favicon) {
            allElements.favicon.href = `https://openweathermap.org/img/wn/${firstForecast.weather[0].icon}@2x.png`;
        }

        // Update main UI (rest of the function is the same)
        allElements.location.textContent = `${city.name}, ${city.country}`;
        allElements.temp.textContent = Math.round(firstForecast.main.temp);
        allElements.tempUnit.textContent = units.temp;
        allElements.desc.textContent = firstForecast.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
        allElements.icon.src = `https://openweathermap.org/img/wn/${firstForecast.weather[0].icon}@4x.png`;
        allElements.range.textContent = `H: ${Math.round(firstForecast.main.temp_max)}° / L: ${Math.round(firstForecast.main.temp_min)}°`;
        allElements.feelsLike.textContent = `Feels like: ${Math.round(firstForecast.main.feels_like)}°`;
        allElements.wind.textContent = `Wind: ${Math.round(firstForecast.wind.speed * units.windFactor)} ${units.wind}`;
        
        updateLocalTime(city.timezone);
        updateAqiUI(aqiData);
        updateHourlyChart(list);
        updateDailyForecastUI(list);
        applyWeatherEffect(mapWeatherCodeToEffect(firstForecast.weather[0].id));
    }
    
    // ... (All other functions from the previous step are correct and do not need to be changed)
    function updateLocalTime(timezoneOffset){clearInterval(localTimeInterval);localTimeInterval=setInterval(()=>{const now=new Date();const utc=now.getTime()+(now.getTimezoneOffset()*60000);const cityTime=new Date(utc+(timezoneOffset*1000));allElements.localTime.textContent=cityTime.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'})},1000)}
    function updateAqiUI(data){const aqi=data?data.list[0].main.aqi:null;const aqiClasses=['aqi-1','aqi-2','aqi-3','aqi-4','aqi-5'];allElements.aqiBadge.classList.remove(...aqiClasses);allElements.aqiBadge.style.color='';if(aqi){allElements.aqiBadge.classList.add(`aqi-${aqi}`);allElements.aqiValue.textContent=aqi;allElements.aqiLabel.textContent=mapAqiToLabel(aqi)}else{allElements.aqiValue.textContent='N/A';allElements.aqiLabel.textContent='AQI'}}
    async function getWeatherData(query){lastQuery=query;loader.classList.add('visible');try{const proxyUrl=`weather-proxy.php?${query}&units=${currentUnit}`;const response=await fetch(proxyUrl);const combinedData=await response.json();if(!response.ok){throw new Error(combinedData.message||`City not found (${response.status})`)}updateUI(combinedData.forecast,combinedData.aqi)}catch(error){alert(error.message);console.error("Error fetching weather data via proxy:",error)}finally{loader.classList.remove('visible')}}
    function initialLoad(){if(navigator.geolocation){navigator.geolocation.getCurrentPosition(pos=>getWeatherData(`lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`),()=>getWeatherData("q=London"))}else{getWeatherData("q=London")}initializeChart([],[])}
    unitSwitch.addEventListener('change',()=>{currentUnit=unitSwitch.checked?'imperial':'metric';if(lastQuery)getWeatherData(lastQuery)});searchBtn.addEventListener('click',()=>searchOverlay.classList.add('visible'));closeSearchBtn.addEventListener('click',()=>searchOverlay.classList.remove('visible'));searchForm.addEventListener('submit',e=>{e.preventDefault();const city=cityInput.value.trim();if(city){getWeatherData(`q=${city}`);searchOverlay.classList.remove('visible');cityInput.value='';citySuggestions.innerHTML=''}});cityInput.addEventListener('input',()=>{const query=cityInput.value.toLowerCase();citySuggestions.innerHTML='';if(query.length<2)return;const filteredCities=majorCities.filter(city=>city.toLowerCase().startsWith(query)).slice(0,5);filteredCities.forEach(city=>{const item=document.createElement('div');item.className='suggestion-item';item.textContent=city;item.addEventListener('click',()=>{cityInput.value=city;searchForm.requestSubmit()});citySuggestions.appendChild(item)})});document.addEventListener('click',e=>{if(!searchForm.contains(e.target)){citySuggestions.innerHTML=''}});
    function updateHourlyChart(list){const hourlyLabels=[];const hourlyTemps=[];for(let i=0;i<9;i++){const forecast=list[i];const date=new Date(forecast.dt*1000);hourlyLabels.push(`${date.getHours()}:00`);hourlyTemps.push(Math.round(forecast.main.temp))}if(tempChart){tempChart.data.labels=hourlyLabels;tempChart.data.datasets[0].data=hourlyTemps;tempChart.update()}else{initializeChart(hourlyLabels,hourlyTemps)}}
    function updateDailyForecastUI(list){allElements.forecast.innerHTML='';const dailyData={};list.forEach(item=>{const date=new Date(item.dt*1000).toISOString().split('T')[0];if(!dailyData[date]){dailyData[date]={temps:[],icons:[],descs:[]}}dailyData[date].temps.push(item.main.temp);if(new Date(item.dt*1000).getHours()>=12){dailyData[date].icons.push(item.weather[0].icon);dailyData[date].descs.push(item.weather[0].main)}});Object.keys(dailyData).slice(1,5).forEach(date=>{const day=dailyData[date];const dayDate=new Date(date);const dayName=dayDate.toLocaleDateString('en-US',{weekday:'long'});const highTemp=Math.round(Math.max(...day.temps));const lowTemp=Math.round(Math.min(...day.temps));const icon=day.icons.length>0?day.icons[0]:'01d';const desc=day.descs.length>0?day.descs[0]:'Clear';const forecastDayEl=document.createElement('div');forecastDayEl.className='forecast-day';forecastDayEl.innerHTML=`<h3>${dayName}</h3><img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}" class="weather-icon small"><p class="temp-range">${lowTemp}° ~ ${highTemp}°</p><p class="desc">${desc}</p>`;allElements.forecast.appendChild(forecastDayEl)})}
    function initializeChart(l,d){const c=document.getElementById('tempChart').getContext('2d');const g=c.createLinearGradient(0,0,0,180);g.addColorStop(0,'rgba(255,196,0,0.8)');g.addColorStop(1,'rgba(35,166,213,0.8)');tempChart=new Chart(c,{type:'line',data:{labels:l,datasets:[{label:'Temperature (°C)',data:d,borderColor:g,borderWidth:4,tension:.4,pointBackgroundColor:'#fff',pointBorderColor:'rgba(0,0,0,0.5)',pointBorderWidth:2,pointRadius:6,pointHoverRadius:8,fill:!1}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{enabled:!0,backgroundColor:'rgba(0,0,0,0.7)',callbacks:{label:c=>`${c.raw}°`}}},scales:{y:{display:!0,ticks:{color:'rgba(255,255,255,0.7)',font:{size:12,weight:'500'}},grid:{display:!1,drawBorder:!1}},x:{ticks:{color:'rgba(255,255,255,0.7)',font:{size:12,weight:'500'}},grid:{color:'rgba(255,255,255,0.1)',drawBorder:!1}}}}})}
    function createElements(c,n,f){for(let i=0;i<c;i++){const e=document.createElement('div');e.className=n;f(e,i);effectsContainer.appendChild(e)}}const effects={sunny:()=>{createElements(5,'god-ray',e=>{e.style.left=`${Math.random()*100}vw`;e.style.animationDelay=`${Math.random()*15}s`;e.style.animationDuration=`${5+Math.random()*10}s`})},cloudy:()=>{createElements(30,'cloud',e=>{const s=100+Math.random()*250,d=(Math.random()*-600)-100;e.style.cssText=`width: ${s}px; height: ${s}px; top: ${Math.random()*80}vh; left: ${Math.random()*100}vw; opacity: ${.2+Math.random()*.4}; --depth: ${d}px; animation-duration: ${40+Math.random()*40}s; animation-delay: ${Math.random()*-80}s;`})},rainy:()=>{createElements(100,'rain-streak',e=>{e.style.left=`${Math.random()*100}vw`;e.style.animationDelay=`${Math.random()*1}s`;e.style.animationDuration=`${.5+Math.random()*.3}s`;const d=Math.random();if(d<.3){e.style.transform='translateZ(-200px)';e.style.opacity='0.4'}else if(d>.7){e.style.transform='translateZ(100px)';e.style.opacity='0.9';e.style.filter='blur(1px)'}})},thunderstorm:()=>{effects.rainy();const e=document.createElement('div');e.className='lightning-flash';effectsContainer.appendChild(e)},windy:()=>{createElements(30,'wind-particle',e=>{e.style.top=`${Math.random()*100}vh`;e.style.animationDuration=`${1+Math.random()*2}s`;e.style.animationDelay=`${Math.random()*2}s`;const d=Math.random();e.style.transform=`translateZ(${d*400-200}px)`;e.style.opacity=`${.3+d*.7}`})},snowy:()=>{createElements(150,'snowflake',e=>{e.style.left=`${Math.random()*100}vw`;e.style.animationDuration=`${8+Math.random()*10}s`;e.style.animationDelay=`${Math.random()*10}s`;const d=Math.random(),s=2+d*8;e.style.width=`${s}px`;e.style.height=`${s}px`;e.style.opacity=`${.3+d*.7}`;const z=(d*-400)-50;e.style.transform=`translateZ(${z}px)`;if(d>.8&&z<-300)e.style.filter='blur(1px)'})}};
    function mapWeatherCodeToEffect(c){if(c>=200&&c<300)return'thunderstorm';if(c>=300&&c<600)return'rainy';if(c>=600&&c<700)return'snowy';if(c>=700&&c<800)return'foggy';if(c===800)return'sunny';if(c>800)return'cloudy';return'clear'}
    function applyWeatherEffect(e){const b=['sunny-bg','cloudy-bg','rainy-bg','thunderstorm-bg','snowy-bg','windy-bg','foggy-bg','snow-text-shadow'];effectsContainer.innerHTML='';body.classList.remove(...b);body.querySelector('.weather-app').style.animation='none';if(e!=='clear')body.classList.add(`${e}-bg`);if(e==='snowy')body.classList.add('snow-text-shadow');if(effects[e])effects[e]()}
    function mapAqiToLabel(a){switch(a){case 1:return'Good';case 2:return'Fair';case 3:return'Moderate';case 4:return'Poor';case 5:return'Very Poor';default:return'Unknown'}}
    
    initialLoad();
});