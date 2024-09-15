import axios from 'axios';

const jsonHeader = { 'Content-Type': 'application/json' }
const formHeader = { 'Content-Type': 'multipart/form-data' }
const ACCESS_TOKEN = 'access_token'

// TODO 240909 signup, login과 같이 토큰 필요없는 요청은 토큰 세팅없이 요청 보내는 게 맞음
const setUserToken = (header) => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    console.log('setUserToken 호출')
    if (userToken) {
        header.Authorization = `Bearer ${userToken}`
    }
}

const createFomrData = (parameters, file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jsonData', new Blob([JSON.stringify(parameters)], {
        type: "application/json"
    }));
    return formData;
}

const createAxiosConfig = (apiSpec, headers, parameters, file) => {
    const url = apiSpec.path;
    const axiosConfig = {
        method: apiSpec.method,
        url,
        headers,
    };

    if (file) {
        axiosConfig.data = createFomrData(parameters, file);
        return axiosConfig;
    }

    if (apiSpec.method.toUpperCase() === 'GET') {
        axiosConfig.params = parameters;
        return axiosConfig;
    }

    // POST, PATCH, DELETE, etc..
    axiosConfig.data = parameters;
    return axiosConfig;
};

const requestWithAxios = async (config) => {
    try {
        const response = await axios(config);
        return response.data;
    } catch (error) {
        const code = error.response.status
        const data = error.response.data

        handleErrorByCode(code, data)

        return error.response.data;
    }
};

const handleErrorByCode = (code, data) => {
    if (code === 500) {
        alert(data.message);
    }

    if (code === 401) { // 인증 오류
        localStorage.removeItem(ACCESS_TOKEN)
        location.href = '/login'
    }

    if (code === 400) {

    }

};

const apiCall = (apiSpec, parameters, customHeader) => {
    const header = { ...jsonHeader, customHeader };
    if (!apiSpec.open) {
        setUserToken(header);
    }

    const config = createAxiosConfig(apiSpec, header, parameters);

    return requestWithAxios(config);
};

const apiCallWithFileUpload = (apiSpec, parameters, file, customHeader) => {
    const header = { ...formHeader, customHeader };
    setUserToken(header);

    const config = createAxiosConfig(apiSpec, header, parameters, file);

    return requestWithAxios(config);
}

export { apiCall, apiCallWithFileUpload }