import { call, put } from 'redux-saga/effects';
import api from '../../services/api';

import { Creators as LoginActions } from '../ducks/login';
import { Creators as ErrorActions } from '../ducks/error';

export function* login(data) {
  try {
    const { payload } = data;
    const response = yield call(api.post, '/login', {
      email: payload.data.user,
      password: payload.data.password,
    });
    if (response.status === 200) {
      window.localStorage.setItem('token', response.data.token);
      yield put(LoginActions.loginSuccess(response.data));
      window.location = '/';
    }
  } catch (err) {
    const errorMessage = err.response.data.message;
    const errorStatus = err.response.status;
    if (errorStatus === 401) yield put(ErrorActions.setError(errorMessage));
    else {
      yield put(ErrorActions.setError('Não foi possível logar'));
      yield put(LoginActions.loginSuccess(null));
    }
  }
}
