import axios from 'axios';

const API_URL = 'http://localhost:5000/';
/*const headerLogin = {
    'Content-Type': 'application/json'
}*/

/*const headers = {
    'Content-Type': 'application/json'
}*/

const headersUpdate = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : 'http://localhost:8080',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods' : 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':'application/json'
}

export class SimbadAPI {

    async getObject(name){
        const url = `${API_URL}query/`;
        return await axios.get(url+name, {
            headers: headersUpdate
        }).then((response) => response).catch( error => { console.log(error); });
    }
}