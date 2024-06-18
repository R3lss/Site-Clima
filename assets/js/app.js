'use strict';

import { fetchData , url } from './api.js';
import * as module from "./module.js";

const addEventOnElements = function(elements, eventType, callback){
    for (const element of elements) element.addEventListener(eventType, callback)
}

const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);


const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");

let searchTimeout = null; 
const searchTimeoutDuracao = 500;

searchField.addEventListener('input', function(){
    searchTimeout ?? clearTimeout(searchTimeout);

    if(!searchField.value){
        searchResult.classList.remove("active");
        searchResult.innerHTML = "";
        searchField.classList.remove("procurando")
    } else {
        searchField.classList.add("procurando")
    }

    if(searchField.value){
        searchTimeout = setTimeout(() => {
            fetchData(url.geo(searchField.value), function(locations) {
                searchField.classList.remove("procurando");
                searchResult.classList.add("active")
                searchResult.innerHTML = `
                <ul class="ver-lista" data-search-list>
                </ul>
                `;

                const items = [];

                for(const {name, lat, lon, country, state} of locations){
                    const searchItem = document.createElement("li");
                    searchItem.classList.add("ver-item");

                    searchItem.innerHTML = `
                        <span class="m-icon">location_on</span>
        
                            <div>
                                <p class="item-titulo">${name}</p>
        
                                <p class="label-2 item-subtitulo">${state || ""}, ${country}</p>
                            </div>
        
                            <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link tem-estado" aria-label="${name} weather" data-search-toggler></a>
                        `;

                    searchResult.querySelector("[data-search-list]").appendChild(searchItem);
                    items.push(searchItem.querySelector("[data-search-toggler]"));
                }

                addEventOnElements(items, "click", function(){
                    toggleSearch();
                    searchResult.classList.remove("active");
                })
            })
        }, searchTimeoutDuracao);
    }
})

const container = document.querySelector("[data-container]");
const loading = document.querySelector("[data-loading]");
const localizacaoAtualBtn = document.querySelector("[data-current-location-btn]");
const errorContent = document.querySelector("[data-error-content]");

export const attClima = function(lat, lon) {
    loading.style.display = "grid";
    container.style.overflowY = "hidden";
    container.classList.remove("fade-in");
    errorContent.style.display = "none";

    const climaAtualSection = document.querySelector("[data-current-weather]");
    const highlightSection = document.querySelector("[data-highlights]");
    const horaSection = document.querySelector("[data-hourly-forecast]");
    const previsaoSection = document.querySelector("[data-5-day-forecast]");

    climaAtualSection.innerHTML = "";
    highlightSection.innerHTML = "";
    horaSection.innerHTML = "";
    previsaoSection.innerHTML = "";

    if(window.location.hash === "#current-location"){
        localizacaoAtualBtn.setAttribute("disabled", "");
    } else {
        localizacaoAtualBtn.removeAttribute("disabled");
    }

    fetchData(url.climaAgora(lat, lon), function(climaAgora){
        const {
            weather,
            dt: dateUnix,
            sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC},
            main: {temp, feels_like, pressure, humidity},
            visibility,
            timezone
        } = climaAgora
        const [{ description, icon}] = weather

        const card = document.createElement("div");
        card.classList.add("card", "card-lg", "clima-agora-card");
        card.innerHTML = `
                <h2 class="titulo-2 card-titulo">Agora</h2>

                    <div class="weapper">
                        <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

                        <img src="assets/imagens/icones_climas/${icon}.png" width="64" height="64" alt="${description}" class="icone-clima">
                    </div>

                    <p class="body-3">${description}</p>

                    <ul class="meta-lista">
                        <li class="meta-item">
                            <span class="m-icon">calendar_today</span>

                            <p class="titulo-3 meta-texto">${module.getDia(dateUnix, timezone)}<p>
                        </li>

                        <li class="meta-item">
                            <span class="m-icon">location_on</span>

                            <p class="titulo-3 meta-texto" data-location></p>
                        </li>
                    </ul>
        `;

        fetchData(url.reverseGeo(lat, lon), function([{name, country}]) {
            card.querySelector("[data-location]").innerHTML = `${name}, ${country}`
        });

        climaAtualSection.appendChild(card);

        fetchData(url.poluicao(lat, lon), function(airPollution){
            const [{
                main: {aqi},
                components: { no2, o3, so2, pm2_5}
            }] = airPollution.list;

            const card = document.createElement("div");
            card.classList.add("card", "card-lg");

            card.innerHTML = `
                    <h2 class="titulo-2" id="highlights-label">Previsões de Hoje</h2>

                    <div class="lista-previsoes">

                            <div class="card card-sm previsoes-card um">

                                <h3 class="titulo-3">Qualidade do Ar</h3>

                                <div class="wrapper">

                                    <span class="m-icon">air</span>

                                    <ul class="card-lista">

                                        <li class="card-item">
                                            <p class="titulo-1">${pm2_5.toPrecision(3)}</p>

                                            <p class="label-1">PM<sub>2.5</sub></p>
                                        </li>
                                        <li class="card-item">
                                            <p class="titulo-1">${so2.toPrecision(3)}</p>

                                            <p class="label-1">SO<sub>2</sub></p>
                                        </li>
                                        <li class="card-item">
                                            <p class="titulo-1">${no2.toPrecision(3)}</p>

                                            <p class="label-1">NO<sub>2</sub></p>
                                        </li>
                                        <li class="card-item">
                                            <p class="titulo-1">${o3.toPrecision(3)}</p>

                                            <p class="label-1">O<sub>3</sub></p>
                                        </li>
                                    </ul>

                                </div>

                                <span class="badge aqi-${aqi} label-${aqi}" title="${module.aqiTexto[aqi].message}">${module.aqiTexto[aqi].level}</span>
                            </div>

                            <div class="card card-sm previsoes-card dois">
                                <h3 class="titulo-3">Nascer e Por do Sol</h3>

                                <div class="card-lista">

                                    <div class="card-item">
                                        <span class="m-icon">clear_day</span>

                                        <div>
                                            <p class="label-1">Nascer do Sol</p>

                                            <p class="titulo-1">${module.getHoras(sunriseUnixUTC, timezone)}</p>
                                        </div>
                                    </div>

                                    <div class="card-item">
                                        <span class="m-icon">clear_night</span>

                                        <div>
                                            <p class="label-1">Por do Sol</p>

                                            <p class="titulo-1">${module.getHoras(sunsetUnixUTC, timezone)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="card card-sm previsoes-card">

                                <h3 class="titulo-3">Umidade</h3>

                                <div class="wrapper">
                                    <span class="m-icon">humidity_percentage</span>

                                    <p class="titulo-1">${humidity}<sub>%</sub></p>
                                </div>

                            </div>

                            <div class="card card-sm previsoes-card">

                                <h3 class="titulo-3">Pressão ATM</h3>

                                <div class="wrapper">
                                    <span class="m-icon">airwave</span>

                                    <p class="titulo-1">${pressure}<sub>hPA</sub></p>
                                </div>

                            </div>

                            <div class="card card-sm previsoes-card">

                                <h3 class="titulo-3">Visibilidade</h3>

                                <div class="wrapper">
                                    <span class="m-icon">visibility</span>

                                    <p class="titulo-1">${visibility / 1000}<sub>km</sub></p>
                                </div>

                            </div>

                            <div class="card card-sm previsoes-card">

                                <h3 class="titulo-3">Sensação Térmica</h3>

                                <div class="wrapper">
                                    <span class="m-icon">thermostat</span>

                                    <p class="titulo-1">${parseInt(feels_like)}&deg;<sup>c</sup></p>
                                </div>

                            </div>

                    </div>
            `;

            highlightSection.appendChild(card);
        });

        fetchData(url.previsao(lat, lon), function(previsao){
            const {
                list: forecastList, 
                city: { timezone }
            } = previsao;

            horaSection.innerHTML = `
                    <h2 class="titulo-2">Hoje as</h2>

                    <div class="slider-container">
                        <ul class="slider-lista" data-temp></ul>

                        <ul class="slider-lista" data-wind></ul>

                    </div>
            `;

            for (const [index, data] of forecastList.entries()){
                if(index > 7) break; 

                const {
                    dt: dateTimeUnix,
                    main: { temp },
                    weather,
                    wind: { deg: windDirection, speed: windSpeed}
                } = data
                const [{ icon, description}] = weather 

                const tempLi = document.createElement("li");
                tempLi.classList.add("slider-item");

                tempLi.innerHTML = `
                    <div class="card card-sm slider-card">
                        <p class="body-3">${module.getTime(dateTimeUnix, timezone)}</p>

                        <img src="assets/imagens/icones_climas/${icon}.png" width="48" height="48" loading="lazy" alt="${description}" class="icone-clima" title="${description}">

                        <p class="body-3">${parseInt(temp)}&deg;<sup>c</sup></p>
                    </div>
                `;
                horaSection.querySelector("[data-temp]").appendChild(tempLi);

                const windLi = document.createElement('li');
                windLi.classList.add("slider-item");

                windLi.innerHTML =`
                <div class="card card-sm slider-card">
                    <p class="body-3">${module.getTime(dateTimeUnix, timezone)}</p>

                    <img src="assets/imagens/icones_climas/direction.png" width="48" height="48" loading="lazy" alt="direction" class="icone-clima" style="transform: rotate(${windDirection - 180}deg)">

                    <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>
                </div>
                `;
                horaSection.querySelector("[data-wind]").appendChild(windLi);
            }

            previsaoSection.innerHTML = `
                    <h2 class="titulo-2" id="previsao-label">Previsão de 5 dias</h2>

                    <div class="card card-lg previsao-card">
                        <ul data-forecast-list> </ul>
                    </div>
            `;

            for(let i = 7, len = forecastList.length; i < len; i+=8){
                const{
                    main: { temp_max },
                    weather,
                    dt_txt
                } = forecastList[i];
                const [{icon, description}] = weather
                const dia = new Date(dt_txt);

                const li = document.createElement("li");
                li.classList.add("card-item");
                
                li.innerHTML = `
                <div class="icon-wrapper">
                    <img src="assets/imagens/icones_climas/${icon}.png" width="36" height="36" alt="${description}" class="icone-clima" title="${description}">

                    <span class="span">
                         <p class="titulo-2"><p>Média</p>${parseInt(temp_max)}&deg;<sup>c</sup></p>
                    </span>
                 </div>

                <p class="label-1">${dia.getUTCDate()} ${module.meses[dia.getUTCMonth()]}</p>

                <p class="label-1">${module.diasSemana[dia.getUTCDay()]}</p>
                `;
                previsaoSection.querySelector("[data-forecast-list]").appendChild(li);
            }

            loading.style.display = "none";
            container.style.overflowY = "overlay";
            container.classList.add("fade-in");
        });

    });

}

export const erro404 = () => errorContent.style.display = "flex";