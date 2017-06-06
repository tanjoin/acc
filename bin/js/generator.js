(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Generator {
    onload() {
        this.applyAutoResize();
        this.applyCreateJson();
        this.applyCheckBoxSettings();
    }
    applyCheckBoxSettings() {
        var labels = document.querySelectorAll('label.mdl-checkbox');
        var checkboxes = document.querySelectorAll('input.mdl-checkbox__input');
        for (var i = 0; i < checkboxes.length; i++) {
            var checkbox = checkboxes[i];
            checkbox.addEventListener('change', function (event) {
                console.log('change');
                if (this.checked) {
                    if (this.id === 'checkbox-on__all') {
                        Array.from(checkboxes)
                            .filter((checkbox, index, array) => checkbox.id !== 'checkbox-on__all')
                            .forEach((checkbox, index, array) => checkbox.checked = false);
                        Array.from(labels)
                            .filter((label, index, array) => label.getAttribute('for') !== 'checkbox-on__all')
                            .forEach((label, index, array) => label.MaterialCheckbox.uncheck());
                    }
                    else {
                        document.getElementById('checkbox-on__all').checked = false;
                        document.querySelector('label[for=checkbox-on__all]').MaterialCheckbox.uncheck();
                    }
                }
            });
        }
    }
    applyCreateJson() {
        var createBtn = document.getElementById('create_btn');
        createBtn.addEventListener('click', function (event) {
            document.getElementById('result_json').style.visibility = 'visible';
        });
    }
    applyAutoResize() {
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
