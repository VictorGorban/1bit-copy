import _ from "lodash";
import EJSON from 'ejson'
import { createStore, createApi } from "effector";

let userDataDefault = null;
const $userData = createStore(_.cloneDeep(userDataDefault));
$userData.api = createApi($userData, {
  replace(state, payload) {
    if (payload === undefined) payload = _.clone(state);
    let newState = payload;
    localStorage.setItem("$userData", EJSON.stringify(newState));
    return newState;
  },
  update(state, payload) {
    let newState = { ...state, ...payload };
    localStorage.setItem("$userData", EJSON.stringify(newState));
    return newState;
  },
  reset(state, payload) {
    // _cloneDeep - потому что объект при init не копируется
    let newState = userDataDefault;
    localStorage.setItem("$userData", EJSON.stringify(newState));
    return newState;
  },
});
export { $userData };

let isGlobalsLoadedDefault = false;
const $isGlobalsLoaded = createStore(_.cloneDeep(isGlobalsLoadedDefault));
$isGlobalsLoaded.api = createApi($isGlobalsLoaded, {
  replace(state, payload) {
    if (payload === undefined) payload = _.clone(state);
    let newState = payload;
    return newState;
  },
  reset(state, payload) {
    // _cloneDeep - потому что объект при init не копируется
    let newState = isGlobalsLoadedDefault;
    return newState;
  },
});
export { $isGlobalsLoaded };
