import { combineReducers } from 'redux';

const INITIAL_STATE = {

    count: 0,
};

const counterReducer = (state = INITIAL_STATE, action) => {
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

const rootReducer = combineReducers({
    counter: counterReducer
});

export default rootReducer;