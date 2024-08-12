const POST = 'POST';
const GET = 'GET';
const DELETE = 'DELETE';
const PATCH = 'PATCH';

const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

const API_LIST = {
    TEST_EP: {
        method: GET,
        path: `${API_SERVER_URL}/word/test`,
        desc: '테스트용'
    }
}

export { API_LIST };
