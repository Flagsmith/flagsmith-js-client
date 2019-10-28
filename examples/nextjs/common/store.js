
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import promiseMiddleware from 'redux-promise-middleware';
import { composeWithDevTools } from 'redux-devtools-extension';

import './app-actions';
import rootSaga from './saga';

let _store;
export default function (initialState = {}) {
    if (_store) return _store;
    const sagaMiddleware = createSagaMiddleware();

    const middlewares = [
        sagaMiddleware,
        promiseMiddleware,
    ];

    const store = createStore(
        require('./reducer').default,
        initialState,
        composeWithDevTools(applyMiddleware(...middlewares)),
    );

    store.sagaTask = sagaMiddleware.run(rootSaga);
    _store = store;
    return _store;
}

export const getStoreDangerous = () => _store;
