(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var campaign_1 = require("./model/campaign");
var day_1 = require("./model/day");
var campaign = new campaign_1.default("{\n    \"id\": 175,\n    \"service\": \"\u30BB\u30D6\u30F3\u30A4\u30EC\u30D6\u30F3\",\n    \"title\": \"\u63DA\u3052\u7269\u30FB\u30D5\u30E9\u30F3\u30AF\u3092\u4E00\u5EA6\u306B300\u5186\u8CB7\u3046\u3068\u5BFE\u8C61\u306E\u30BB\u30D6\u30F3\u30D7\u30EC\u30DF\u30A2\u30E0\u306E\u60E3\u83DC\u7121\u6599\u5F15\u63DB\u5238\u30D7\u30EC\u30BC\u30F3\u30C8\uFF01\uFF5C\u30BB\u30D6\u30F3\u2010\u30A4\u30EC\u30D6\u30F3\uFF5E\u8FD1\u304F\u3066\u4FBF\u5229\uFF5E\",\n    \"description\": \"\u5B9F\u65BD\u671F\u95932017\u5E745\u67085\u65E5\uFF08\u91D1\uFF09\u30FB12\u65E5\uFF08\u91D1\uFF09\u30FB19\u65E5\uFF08\u91D1\uFF09\u30FB26\u65E5\uFF08\u91D1\uFF09 \\n\u7121\u6599\u5238\u5F15\u63DB\u671F\u95932017\u5E745\u670831\u65E5\uFF08\u6C34\uFF09\u307E\u3067\\n\u203B5\u67085\u65E5\uFF08\u91D1\uFF09\u300112\u65E5\uFF08\u91D1\uFF09\u300119\u65E5\uFF08\u91D1\uFF09\u300126\u65E5\uFF08\u91D1\uFF09\u306B\u767A\u884C\u3055\u308C\u305F\u7121\u6599\u5238\u5171\u901A\u306E\u5F15\u63DB\u671F\u9593\u3068\u306A\u308A\u307E\u3059\u3002\\n\",\n    \"urls\": [\n        \"http://www.sej.co.jp/cmp/hotsnack1705.html\"\n    ],\n    \"images\": [\"http://www.sej.co.jp/mngdbps/_template_/_user_/_SITE_/localhost/_res/cmp/hotsnack1705/main.jpg\"],\n    \"event_period\": {\n      \"start\": \"2017/05/18\",\n      \"end\": \"2017/05/19\"\n    },\n    \"particular_days\": [\"Sun\"]\n}");
console.log(new campaign_1.default());
console.log(campaign);
console.log(day_1.default.Sunday);
console.log(campaign.particularDays[0] === day_1.default.Sunday);

},{"./model/campaign":2,"./model/day":3}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stage_1 = require("./stage");
var Campaign = (function () {
    function Campaign(obj) {
        if (!obj) {
            return;
        }
        var jsonObj = JSON.parse(obj);
        if (!jsonObj) {
            return;
        }
        this.id = jsonObj["id"];
        this.title = jsonObj["title"];
        this.service = jsonObj["service"];
        this.description = jsonObj["description"];
        this.images = jsonObj["images"];
        this.urls = jsonObj["urls"];
        this.entryPeriod = jsonObj["entry_period"];
        this.eventPeriod = jsonObj["event_period"];
        this.lotteryPeriod = jsonObj["lottery_period"];
        this.particularDays = jsonObj["particular_days"];
        this.particularDates = jsonObj["particular_dates"];
    }
    Campaign.prototype.isShow = function () {
        var now = new Date();
        if (this.entryPeriod && this.entryPeriod.isDisplay(now)) {
            return true;
        }
        if (this.eventPeriod && this.eventPeriod.isDisplay(now)) {
            return true;
        }
        if (this.lotteryPeriod && this.lotteryPeriod.isDisplay(now)) {
            return true;
        }
        return false;
    };
    Campaign.prototype.getStages = function () {
        var now = new Date();
        var stages = [];
        if (this.entryPeriod && this.entryPeriod.isDisplay(now)) {
            stages.push(stage_1.default.ENTRY);
        }
        if (this.eventPeriod && this.eventPeriod.isDisplay(now)) {
            stages.push(stage_1.default.EVENT);
        }
        if (this.lotteryPeriod && this.lotteryPeriod.isDisplay(now)) {
            stages.push(stage_1.default.LOTTERY);
        }
        if (stages.length === 0) {
            stages.push(stage_1.default.UNKNOWN);
        }
        return stages;
    };
    return Campaign;
}());
exports.default = Campaign;

},{"./stage":4}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Day;
(function (Day) {
    Day.Monday = "Mon";
    Day.Tuesday = "Tue";
    Day.Wednesday = "Wed";
    Day.Thursday = "Thu";
    Day.Friday = "Fri";
    Day.Saturday = "Sat";
    Day.Sunday = "Sun";
})(Day || (Day = {}));
exports.default = Day;

},{}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stage;
(function (Stage) {
    Stage.ENTRY = "Entry";
    Stage.EVENT = "Event";
    Stage.LOTTERY = "Lottery";
    Stage.UNKNOWN = "Unknown";
})(Stage || (Stage = {}));
exports.default = Stage;

},{}]},{},[1]);
