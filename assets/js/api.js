'use strict';

const chave_api = '3cad099d73c3dd8e15650d209178a18c';

/**
 * 
 * @param {string} URL API url
 * @param {function} callback callback
 */
export const fetchData = function(URL, callback){
    fetch(`${URL}&appid=${chave_api}`)
        .then(res => res.json())
        .then(data => callback(data));
}

export const url = {
    climaAgora(lat, lon){
        return `https://api.openweathermap.org/data/2.5/weather?${lat}&${lon}&units=metric`
    },
    previsao(lat, lon){
        return `https://api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`
    },
    poluicao(lat, lon){
        return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`
    },
    reverseGeo(lat, lon){
        return `http://api.openweathermap.org/geo/1.0/reverse?${lat}&${lon}&limit=5`
    },
    geo(query){
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`
    }
}