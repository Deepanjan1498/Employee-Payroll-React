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
    putService(url = "", data) {
        return axios.put(url, data);
    }

    deleteService(url = "") {
        return axios.delete(url);
    }

    getService(url = "", tokenRequired = false, httpOptions = null) {
        return axios.get(url, tokenRequired && httpOptions);
    }
}
module.exports = new AxiosService();