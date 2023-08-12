import { combineReducers } from 'redux';

const INITIAL_STATE = {
    profile: {},
    games: {},
    count: 0,
};

const profileReducer = (state = INITIAL_STATE.profile, action) => {
    switch (action.type) {
        case "updateProfile":
            console.log("Before profile: ", state);
            console.log("After profile: ", state ,action.profile);
            if(!action.profile) return state;
           return {
             ...state ,...action.profile
           };
        case "clearProfile":
           return {
                ...INITIAL_STATE.profile,
           };
        case "setProfile":
            if(!action.profile) return state;
           return {
              ...action.profile,
           };
         default: return state;
        }
    }

const gamesReducer = (state = INITIAL_STATE.games, action) => {
    switch (action.type) {
        case "setAccessGame":
            if(!action.accessGame) return state;
           return {
             ...state, accessGame: {...action.accessGame},
           };
        case "clearAccessGame":
            if(!action.profile) return state;
           return {
              ...state, accessGame: {},
           };
         default: return state;
        }
    }



const rootReducer = combineReducers({
    profile: profileReducer,
    games: gamesReducer,
});

export default rootReducer;