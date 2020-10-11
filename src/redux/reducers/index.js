import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { productReducers } from './productReducer';
import { slideReducer } from './slideReducer'

export const Reducer = combineReducers({
    authReducer,
    productReducers,
    slideReducer
})