'use strict';

export const diasSemana = [ 
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado"
];

export const meses = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
];

export const getDia = function(dateUnix, timezone){
    const dia = new Date((dateUnix + timezone) * 1000);
    const diaDaSemana = diasSemana[dia.getUTCDay()];
    const nomeMes = meses[dia.getUTCMonth()];

    return `${diaDaSemana} ${dia.getUTCDate()}, ${nomeMes}`;
}

export const getTime = function(timeUnix, timezone){
    const dia = new Date((timeUnix + timezone) * 1000);
    const horas = dia.getUTCHours();
    const minutos = dia.getUTCMinutes();

    return `${horas}:${minutos}${minutos}`;
}

export const getHoras = function(timeUnix, timezone){
    const dia = new Date((timeUnix + timezone) * 1000);
    const horas = dia.getUTCHours();
    const minutos = dia.getUTCMinutes();

    return `${horas}:${minutos}`;
}

export const mps_to_kmh = mps => {
    const mph = mps * 3600;
    return mph / 1000;
}

export const aqiTexto = {
    1:{
        level: "Bom",
        message: "Qualidade do ar ideal para a maioria das pessoas, desfrute normalmente de suas atividades ao ar livre."
    },
    2:{
        level: "Razoável",
        message: "Qualidade do ar aceitável para a maioria das pessoas. No entanto, grupos sensíveis podem apresentar sintomas leves a moderados em caso de exposição prolongada."
    },
    3:{
        level: "Ruim",
        message: "O ar atingiu um nível de poluição elevado e não é saudável para grupos sensíveis. Reduza o tempo destinado às atividades ao ar livre caso esteja sentindo sintomas como dificuldade de respiração ou irritação na garganta."
    },
    4:{
        level: "Insalubre",
        message: "Grupos sensíveis podem sentir imediatamente os efeitos à saúde. Indivíduos saudáveis podem sentir dificuldades de respiração e irritação na garganta em caso de exposição prolongada. Reduza as atividades ao ar livre."
    },
    5:{
        level: "Muito insalubre",
        message: "Qualquer exposição ao ar, mesmo por alguns minutos, pode trazer sérias implicações à saúde. Evite atividades ao ar livre."
    }
}