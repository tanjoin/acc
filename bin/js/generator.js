(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Generator {
    onload() {
        this.autoResize();
        var createBtn = document.getElementById('create_btn');
        createBtn.addEventListener('click', function (event) {
            document.getElementById('result_json').style.visibility = 'visible';
        });
    }
    autoResize() {
        var textarea = document.getElementById('content_description');
        textarea.addEventListener('focus', function (event) {
            event.target.style.height = 'auto';
            var height = this.scrollHeight + 'px';
            event.target.style.height = height;
        });
        textarea.addEventListener('blur', function (event) {
            event.target.style.height = 'auto';
            var height = this.scrollHeight + 'px';
            event.target.style.height = height;
        });
        textarea.addEventListener('input', function (event) {
            event.target.style.height = 'auto';
            var height = this.scrollHeight + 'px';
            event.target.style.height = height;
        });
    }
}
exports.default = Generator;
window.onload = function () {
    new Generator().onload();
};

},{}]},{},[1]);
