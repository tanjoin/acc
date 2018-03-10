(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
var constants = require('./constants');

/** @constructor */
var Campaign = function(opt_jsonData) {
  /**
   * JSON 文字列を parse したもの.
   * @type {Object|undefined}
   * @private
   */
  if (opt_jsonData) {
    this.id = opt_jsonData.id;
    this.title = opt_jsonData.title;
    this.serviceTitle = opt_jsonData.service_title;
    this.date = opt_jsonData.date;
    this.on = opt_jsonData.on;
    this.urls = opt_jsonData.urls;
    this.img = opt_jsonData.img;
    this.description = opt_jsonData.description;
  }
};

Campaign.prototype.toJSON = function() {
  return {
    id: this.id,
    service_title: this.serviceTitle,
    title: this.title,
    description: this.description,
    urls: this.urls,
    img: this.img,
    date: this.date,
    on: this.on
  }
}

Campaign.prototype.startText = function() {
  return this.date.start || '';
};

Campaign.prototype.endText = function() {
  return this.date.end || '';
};

Campaign.prototype.dayText = function() {
  if (this.startText().length > 0 || this.endText().length > 0) {
    return this.startText() + "〜" + this.endText();
  }
  return "";
};

Campaign.prototype.hasDayText = function() {
  var dayText = this.dayText();
  return dayText && dayText.length > 0;
};

Campaign.prototype.hasUrl = function() {
    return this.urls && this.urls.length > 0;
};

Campaign.prototype.hasImage = function() {
    return this.img && this.img.length > 0;
};

Campaign.prototype.isShow = function(now) {
    return this.validateDate_(now) && this.validateOn_(now);
};

Campaign.prototype.isExpired = function(now) {
  if (!now) {
      now = new Date();
  }

  var end = new Date(Date.parse(this.date.end));
  if (end && now.getTime() > end.getTime()) {
      return true;
  }
  return false;
}

Campaign.prototype.containsInOn = function(on) {
    return this.on && this.on.indexOf(on) !== -1;
};

// URLクエリにある hide[N]=id の id が一致したかどうか
Campaign.prototype.validateHide = function(urlQuery) {
  for (var i = 0; i < urlQuery.length; i++) {
      if (this.id == urlQuery["hide[" + i + "]"]) {
          return false;
      }
  }
  return true;
};

/** @private */
Campaign.prototype.validateOn_ = function(now) {
    if (!this.on) {
        return false;
    }
    if (this.containsInOn(constants.On.ALL)) {
      return true;
    }
    var key;
    for (key in constants.On.DAY) {
      if (this.validateOnForDay_(now, constants.On.DAY[key])) {
        return true;
      }
    }
    for (key in constants.On.DATE) {
      if (this.validateOnForDate_(now, constants.On.DATE[key])) {
        return true;
      }
    }
    return false;
};

/** @private */
Campaign.prototype.validateOnForDay_ = function(now, onDay) {
    return now.getDay() === onDay.day && this.containsInOn(onDay.text);
};

/** @private */
Campaign.prototype.validateOnForDate_ = function(now, onDate) {
    return now.getDate() === onDate.date && this.containsInOn(onDate.text);
};

/** @private 日付チェック */
Campaign.prototype.validateDate_ = function(now) {
    if (!now) {
        now = new Date();
    }
    var start = new Date(Date.parse(this.date.start));
    var end = new Date(Date.parse(this.date.end));
    if (start && start.getTime() > now.getTime()) {
        return false;
    }
    if (end && now.getTime() > end.getTime()) {
        return false;
    }
    return true;
};

module.exports = Campaign;

},{"./constants":2}],2:[function(require,module,exports){
module.exports.Colors = [
  "red",
  "pink",
  "purple",
  "deep-purple",
  "indigo",
  "blue",
  "light-blue",
  "cyan",
  "teal",
  "green",
  "light-green",
  "lime",
  "yellow",
  "amber",
  "orange",
  "deep-orange",
  "brown",
  "grey",
  "blue-grey"
];

module.exports.DAYOFTHEWEEK = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

module.exports.On = {
    ALL: "All",
    DAY: {
        SUN: {
            day: 0,
            text: "Sun"
        },
        MON: {
            day: 1,
            text: "Mon"
        },
        TUE: {
            day: 2,
            text: "Tue"
        },
        WED: {
            day: 3,
            text: "Wed"
        },
        THU: {
            day: 4,
            text: "Thu"
        },
        FRI: {
            day: 5,
            text: "Fri"
        },
        SAT: {
            day: 6,
            text: "Sat"
        }
    },
    DATE: {
        D_05: {
            date: 5,
            text: "5th"
        },
        D_10: {
            date: 10,
            text: "10th"
        },
        D_15: {
            date: 15,
            text: "15th"
        },
        D_20: {
            date: 20,
            text: "20th"
        },
        D_25: {
            date: 25,
            text: "25th"
        },
        D_30: {
            date: 30,
            text: "30th"
        }
    }
};

},{}],3:[function(require,module,exports){
const Campaign = require('./campaign');
const info = require('./info');

var acc = {
  campaigns: [],
  serviceTitles: [],
  inverse: [],
  underway: []
};

const showRemovedInverseCampaignJson = () => {
  const now = new Date();
  for (var i = 0; i < acc.campaigns.length; i++) {
    const campaign = acc.campaigns[i];
    if (!campaign.isExpired(now)) {
      acc.underway.push(campaign);
    }
  }
};

window.onload = () => {
  info.getCampaigns((campaigns, serviceTitles) => {
    acc.campaigns = campaigns;
    acc.serviceTitles = serviceTitles
    showRemovedInverseCampaignJson();
    var p = document.createElement('pre');
    p.innerText = JSON.stringify({
      campaigns: acc.underway.map((c) => c.toJSON())
    }, null, 2);
    p.id = 'result';
    p.className = 'clipboard';
    p.setAttribute("style", "margin:16px;");
    p.setAttribute('data-clipboard-target', '#result');
    document.getElementById('contents').appendChild(p);
    new ClipboardJS('.clipboard');
  });
};

},{"./campaign":1,"./info":4}],4:[function(require,module,exports){
var Campaign = require('./campaign');

var ACC_URL = "https://tanjoin.github.io/acc/campaign.json";

/** キャンペーン情報を取得する. */
module.exports.getCampaigns = function(callback) {
  var request = new XMLHttpRequest();
  request.open('GET', ACC_URL, true);
  request.onload = function() {
    /** JSON データを Campaign に変換. */
    var data = JSON.parse(this.responseText);
    var campaigns = data.campaigns.map((data) => new Campaign(data));
    var serviceTitles = campaigns
        .map((c) => c.serviceTitle)
        .filter((x, i, self) => self.indexOf(x) === i);
    callback(campaigns, serviceTitles);
  };
  request.send(null);
};

/** Get URL Query Parameters. */
module.exports.getUrlQuery = function() {
    var url = window.location.search;
    var hash = url.slice(1).split("&");
    var queries = [];
    for (var i = 0; i < hash.length; i++) {
        var splitedData = hash[i].split("=");
        queries.push(splitedData[0]);
        queries[splitedData[0]] = splitedData[1];
    }
    return queries;
};

module.exports.getId = function(urlQuery) {
  if (urlQuery && urlQuery.id) {
    return decodeURIComponent(urlQuery.id);
  }
  return null;
};

module.exports.getServiceTitle = function(urlQuery) {
  if (urlQuery && urlQuery.service_title && urlQuery.service_title.length > 0) {
    return decodeURIComponent(urlQuery.service_title);
  }
  return null;
};

module.exports.getInverse = function(urlQuery) {
  if (urlQuery && urlQuery.inverse && urlQuery.inverse.length > 0) {
    return decodeURIComponent(urlQuery.inverse);
  }
  return false;
};

},{"./campaign":1}]},{},[3]);
