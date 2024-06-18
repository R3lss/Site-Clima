'use strict';

import { attClima, erro404 } from "./app.js";
const localizacaoDefault = "#/weather?lat=-23.084229579180285&lon=-47.21714107885926";

const localizacaoAgora = function(){
    window.navigator.geolocation.getCurrentPosition(res => {
        const {latitude, longitude} = res.coords;

        attClima(`lat=${latitude}`, `lon=${longitude}`);
    }, err => {
        window.location.hash = localizacaoDefault;
    });
}

const localizacaoProcurada = query => attClima(...query.split("&"));
// attclima('lat=-23.084229579180285', 'lon=-47.21714107885926')

const routes = new Map([
    ["/current-location", localizacaoAgora],
    ["/weather", localizacaoProcurada]
]);

const checkHash = function () {
    const requestURL = window.location.hash.slice(1);

    const [route, query] = requestURL.includes ? requestURL.split("?") : [requestURL];

    routes.get(route) ? routes.get(route)(query) : erro404();
}

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function(){
    if(!window.location.hash){
       window.location.hash = "#/current-location" 
    } else{
        checkHash();
    }
});