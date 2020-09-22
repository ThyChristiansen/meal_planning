import { all } from 'redux-saga/effects';
import loginSaga from './loginSaga';
import registrationSaga from './registrationSaga';
import userSaga from './userSaga';
import landingPageSaga from './landingPageSaga';
import searchRecipesSaga from './searchRecipesSaga';
import calendarPageSaga from './calendarPageSaga';


export default function* rootSaga() {
  yield all([
    loginSaga(),
    registrationSaga(),
    userSaga(),
    landingPageSaga(),
    searchRecipesSaga(),
    calendarPageSaga(),
  ]);
}
