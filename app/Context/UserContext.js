import { createContext } from 'react';

const defaultUserInfo = {
    email: '',
    name: '',
    painPoints: [],
    equipment: [],
    postureType: null,
    currentLevel: 1,
    currentProtocol: [],
    progressMade: {
        1: 0,
        2: 0,
        3: 0,
    },
};

const UserContext = createContext(defaultUserInfo);

export default UserContext;
