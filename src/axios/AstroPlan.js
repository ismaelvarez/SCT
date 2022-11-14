import axios from 'axios';

const API_URL = 'http://localhost:5000/';

const headersUpdate = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods' : 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':'application/json'
}

export class AstroPlan {

    async getSunInfo(startTime, endTime){
        const url = `${API_URL}sun/${startTime}/${endTime}`;
        return await axios.get(url, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }

    async getMoonInfo(startTime, endTime){
        const url = `${API_URL}moon/${startTime}/${endTime}`;
        return await axios.get(url, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }

    async getDayInfo(startTime, endTime){
        const url = `${API_URL}day/${startTime}/${endTime}`;
        return await axios.get(url, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }

    async isObjectVisible(startTime, endTime, objectName, type){
        const url = `${API_URL}visible/${startTime}/${endTime}/${objectName}/${type}`;
        console.log(objectName)
        return await axios.get(url, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }

    async optimizeObservingPlan(observationPlan){
        const url = `${API_URL}optimize/`;
        console.log(url)
        return await axios.post(url, observationPlan, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }

    async toOnStep(observationPlan){
        const url = `${API_URL}toOnStep/`;
        console.log(url)
        return await axios.post(url, observationPlan, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }
}