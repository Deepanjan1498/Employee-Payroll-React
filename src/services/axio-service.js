//import axios, * as others from 'axios';
const axios = require('axios').default;
class AxiosService {
    postService(url , data){
        return axios({
            method: 'post',
            url: url,
            data: data
        })
    }
    putService(url = "", payload = null, tokenRequired = false, httpOptions = null) {
        return axios.put(url, payload, tokenRequired && httpOptions);
    }

    deleteService(url = "") {
        return axios.delete(url);
    }

    getService(url = "", tokenRequired = false, httpOptions = null) {
        return axios.get(url, tokenRequired && httpOptions);
    }
}
module.exports = new AxiosService();