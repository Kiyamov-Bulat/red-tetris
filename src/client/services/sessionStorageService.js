import { v4 as uuidv4 } from 'uuid';

const SSKeys = {
    SESSION_ID: 'session-id'
};

const setItem = (key, item) => {
    const strItem = typeof item === 'string' ? item : JSON.stringify(item);

    sessionStorage.setItem(key, strItem);
};

const sessionStorageService = {
    setSessionId: (id = uuidv4()) => {
        setItem(SSKeys.SESSION_ID, id);
    },

    getSessionId: () => {
        return sessionStorage.getItem(SSKeys.SESSION_ID) || '';
    }
};

export default sessionStorageService;