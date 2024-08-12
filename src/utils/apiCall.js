import axios from 'axios';

const jsonHeader = { 'Content-Type': 'application/json' }
const formHeader = { 'Content-Type': 'multipart/form-data' }
const ACCESS_TOKEN = 'access_token'

const setUserToken = (header) => {
    const userToken = localStorage.getItem(ACCESS_TOKEN);
    if (userToken) {
        header.Authorization = `Bearer ${userToken}`
    }
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
        console.log('에러내용 => ', error);
        if (error.response) {
            const errorData = error.response.data;
            handleErrorByCode(errorData.code);
            return errorData;
        }
        alert('알 수 없는 에러가 발생하였습니다.');
        return error;
    }
};

const handleErrorByCode = (code) => {
    if (code === 500) {
        alert('알 수 없는 에러가 발생하였습니다.');
    }
};

const apiCall = (apiSpec, parameters, customHeader) => {
    const header = { ...jsonHeader, customHeader };
    setUserToken(header);

    const config = createAxiosConfig(apiSpec, header, parameters);

    return requestWithAxios(config);
};

const apiCallWithFileUpload = (apiSpec, parameters, file) => {
    const header = { ...formHeader, customHeader };
    setUserToken(header);

    const config = createAxiosConfig(apiSpec, header, parameters, file);

    return requestWithAxios(config);
}

export { apiCall }