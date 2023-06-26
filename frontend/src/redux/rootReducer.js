import { combineReducers } from 'redux';

const INITIAL_STATE = {
    profile: {},
    count: 0,
};

const counterReducer = (state = INITIAL_STATE.count, action) => {
    switch (action.type) {
        case 0:
           return {
             ...state, count: state.count + 1,
           };
        case 1:
           return {
              ...state, count: state.count - 1,
           };
         default: return state;
        }
    }

const profileReducer = (state = INITIAL_STATE.profile, action) => {        
    switch (action.type) {
        case "updateProfile":
            if(action.profile) return state;
           return {
             ...state, profile: {...state.profile ,...action.profile},
           };
        case "clearProfile":
            if(action.profile) return state;
           return {
              ...state, profile: {},
           };
        case "setProfile":
            if(action.profile) return state;
           return {
              ...state, profile: {...action.profile},
           };
         default: return state;
        }
    }



const rootReducer = combineReducers({
    counter: counterReducer,
    profile: profileReducer,
});

export default rootReducer;