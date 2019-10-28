import { put, all, takeLatest } from 'redux-saga/effects';

export function* startup(action = {}) {
    try {
        const {
            ...rest
        } = action.data || {};
        yield put({ type: Actions.STARTUP_LOADED, data: { ready: true, ...rest } });
    } catch (e) {
        yield put(API.ajaxHandler(Actions.STARTUP_ERROR, e));
        action.onError && action.onError();
    }
}

function* rootSaga() {
    yield all([
        takeLatest(Actions.STARTUP, startup),
    ]);
}

export default rootSaga;
