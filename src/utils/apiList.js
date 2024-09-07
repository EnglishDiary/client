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
    },
    FIND_WORD: (word) => ({
        method: GET,
        path: `${API_SERVER_URL}/word/${word}`,
        desc: '단어 조회'
    }),
    SAVE_WORD: (word) => ({
        method: POST,
        path: `${API_SERVER_URL}/word/save/${word}`,
        desc: '단어 저장'
    }),
    GET_USER_WORDS: {
        method: GET,
        path: `${API_SERVER_URL}/word/list`,
        desc: '유저 단어 목록 조회'
    },
    GET_USER_WORDS_BY_CATEGORY: (categoryId) => ({
        method: GET,
        path: `${API_SERVER_URL}/word/${categoryId}/list`,
        desc: '카테고리별 유저 단어 목록 조회'
    }),
    DELETE_WORD: (word) => ({
        method: DELETE,
        path: `${API_SERVER_URL}/word/delete/${word}`,
        desc: '유저 단어 삭제'
    }),
    UPDATE_WORD: (word) => ({
        method: POST,
        path: `${API_SERVER_URL}/word/update/${word}`,
        desc: '유저 단어 수정'
    }),
    GET_USER_CATEGORIES: {
        method: GET,
        path: `${API_SERVER_URL}/word/category`,
        desc: '유저 단어장 카테고리 조회'
    },
    REQUEST_AI_CORRECTION: {
        method: POST,
        path: `${API_SERVER_URL}/diary/ai-correction`,
        desc: '영어일기 AI 첨삭 요청'
    },
    GET_OFFICIAL_DIARY_CATEGORIES: {
        method: GET,
        path: `${API_SERVER_URL}/diary/category/official`,
        desc: '다이어리 공식 카테고리 조회'
    },
    PUBLISH_DIARY: {
        method: POST,
        path: `${API_SERVER_URL}/diary/save`,
        desc: '영어일기 발행'
    }

}

export { API_LIST };
