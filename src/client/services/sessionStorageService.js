import { v4 as uuidv4 } from 'uuid';

const SSKeys = {
    SESSION_ID: 'session-id'
}

const setItem = (key, item) => {
    const strItem = typeof item === 'string' ? item : JSON.stringify(item);

    sessionStorage.setItem(key, strItem);
};

const sessionStorageService = {
    setSessionId: () => {
        setItem(SSKeys.SESSION_ID, uuidv4());
    },

    getSessionId: () => {
        return sessionStorage.getItem(SSKeys.SESSION_ID) || '';
    }
};

export default sessionStorageService;