(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var local_storage_util_1 = require("./util/local_storage_util");
window.onload = function () {
    var lastViewedId = local_storage_util_1.default.getLastViewedId();
    if (lastViewedId === null) {
        console.log(lastViewedId);
    }
};

},{"./util/local_storage_util":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LocalStorageUtils;
(function (LocalStorageUtils) {
    var KEY_LAST_VIEWED_ID = "last_viewed_id";
    function saveLastViewedId(lastViewedId) {
        window.localStorage.setItem(KEY_LAST_VIEWED_ID, lastViewedId);
    }
    LocalStorageUtils.saveLastViewedId = saveLastViewedId;
    function getLastViewedId() {
        return window.localStorage.getItem(KEY_LAST_VIEWED_ID);
    }
    LocalStorageUtils.getLastViewedId = getLastViewedId;
})(LocalStorageUtils || (LocalStorageUtils = {}));
exports.default = LocalStorageUtils;

},{}]},{},[1]);
