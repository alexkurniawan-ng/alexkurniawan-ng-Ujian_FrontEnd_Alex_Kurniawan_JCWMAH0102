import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter} from 'react-router-dom';
// fungsi createStore : Digunakan untuk membuat global store dari combine Reducer
import { applyMiddleware, createStore } from 'redux';
// provider : Digunakan untuk menghubungkan antara component, action dan reducer
import { Provider } from 'react-redux';
import { Reducer } from './redux/reducers';
import ReduxThunk from 'redux-thunk';

const storeReducer = createStore(Reducer, {}, applyMiddleware(ReduxThunk))
ReactDOM.render(
  <Provider store={storeReducer}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
