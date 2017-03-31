(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');

var accCalendar = {};

accCalendar.serviceTitles = [];

/** 月初 **/
accCalendar.getBeginningOfMonth = function(target, num) {
    var date = new Date(target.getTime());
    if (num != null) {
        date.setDate(num);
    } else {
        date.setDate(1);
    }
    return date;
};

/** 月末 **/
accCalendar.getEndOfMonth = function(target) {
    var date = new Date(target.getTime());
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date;
};

/** 曜日の位置を取得する **/
accCalendar.getIndexOfDay = function(date) {
    var day = date.getDay();
    if (day == 0) {
        return 7;
    }
    return day;
}

/** カレンダーの生成に必要な情報を取得 **/
accCalendar.getCalendarData = function(target, num) {
    var begin = accCalendar.getBeginningOfMonth(target, num);
    var end = accCalendar.getEndOfMonth(target);
    return {
        "begin": begin,
        "end": end,
        "beginDay": accCalendar.getIndexOfDay(begin),
        "endDay": accCalendar.getIndexOfDay(end)
    };
}

/** 今日の曜日を強調する **/
accCalendar.setTodaysDay = function() {
    var id;
    var today = new Date();
    switch (today.getDay()) {
        case 0:
            id = "sun";
            break;
        case 1:
            id = "mon";
            break;
        case 2:
            id = "tue";
            break;
        case 3:
            id = "wed";
            break;
        case 4:
            id = "thu";
            break;
        case 5:
            id = "fri";
            break;
        case 6:
            id = "sat";
            break;
    }
    var th = document.getElementById(id);
    th.style.backgroundColor = "#eeeeee";
};

accCalendar.clearHighlightDay = function() {
    var list = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    for (var i = 0; i < list.length; i++) {
        var th = document.getElementById(list[i]);
        th.style.backgroundColor = "";
    }
};

accCalendar.setMonthHeaderText = function() {
    var target = accCalendar.target;
    var h1 = htmler.h1(target.getFullYear() + "年" + (target.getMonth() + 1) + "月", null, "month_header");
    var monthHeader = document.getElementById("month_header");
    if (monthHeader) {
        monthHeader.parentNode.replaceChild(h1, monthHeader);
    } else {
        document.getElementById("month_area").appendChild(h1);
    }
};

accCalendar.appendTr = function(opt_style) {
    var tr = htmler.tr(opt_style);
    document.getElementById("calendar_body").appendChild(tr);
    return tr;
};

accCalendar.appendTd = function(tr, opt_colspan, opt_text, opt_className, opt_id) {
    var td = htmler.td(opt_colspan, opt_className, opt_id);
    if (opt_text) {
      td.innerText = opt_text;
    }
    tr.appendChild(td);
    return td;
};

/** その月の第何週目かを返す **/
accCalendar.getWeek = function(date) {
    var d = new Date(date.getTime());
    return Math.floor((d.getDate() - d.getDay() + 12) / 7);
};

/** いい感じの TD の値を返す **/
accCalendar.judge = function(campaign, first, last, calendarData) {
    var prefix, suffix, main, d;

    if (first == calendarData.begin.getDate()) {
        prefix = calendarData.beginDay - 1;
    }

    d = new Date(calendarData.begin.getTime());

    for (var i = first; i <= last; i++) {
        // TODO: 判定する
    }
};

accCalendar.createCampaignBar = function(tr, campaign, calendarData, first, last, idPrefix) {
    var campaignStart = new Date(Date.parse(campaign.date.start));
    var campaignEnd = null;
    if (campaign.date.end != null && campaign.date.end.length == 10) {
      campaignEnd = new Date(Date.parse(campaign.date.end + " 23:59"));
    } else if (campaign.date.end != null) {
      campaignEnd = new Date(Date.parse(campaign.date.end));
    }
    var firstDate = new Date(calendarData.begin.getTime());
    firstDate.setDate(first);
    var lastDate = new Date(calendarData.begin.getTime());
    lastDate.setDate(last);

    var date = firstDate;
    var isEmpty = false;
    var td = null;

    while (date < lastDate) {
        if (!campaign.validateOn_(date) ||
            (campaignStart != null && campaignStart > date) ||
            (campaignEnd != null && campaignEnd < date)) { // 開始前 or 終了済み

            if (isEmpty && td != null) {
                td.colSpan = td.colSpan + 1;
            } else {
                if (td != null) {
                    tr.appendChild(td);
                }
                td = htmler.td();
                td.setAttribute("class", "campaign");
                td.colSpan = 1;
            }
            isEmpty = true;
        } else {
            if (isEmpty || td == null) {
                if (td != null) {
                    tr.appendChild(td);
                }
                td = htmler.td();
                var title = "【" + campaign.serviceTitle + "】" + campaign.title;
                if (campaign.urls != null && campaign.urls.length > 0) {
                  var a = htmler.a(campaign.urls[0]);
                  a.innerText = title;
                  td.appendChild(a);
                } else {
                  td.innerText = title;
                }
                td.title = title;
                td.setAttribute("class", "campaign " + accCalendar.getThemeColorClass(accCalendar.serviceTitles.indexOf(campaign.serviceTitle)) + " lighten-4");
                td.id = idPrefix + campaign.id;
                td.colSpan = 1;
            } else {
                td.colSpan = td.colSpan + 1;
            }
            isEmpty = false;
        }
        date.setDate(date.getDate() + 1);
    }
    if (td != null) {
        tr.appendChild(td);
    }
    document.getElementById("calendar_body").appendChild(tr);
};

accCalendar.next = function() {
    accCalendar.target.setMonth(accCalendar.target.getMonth() + 1);
    accCalendar.makeCalendar(accCalendar.campaigns);
};

accCalendar.prev = function() {
    accCalendar.target.setMonth(accCalendar.target.getMonth() - 1);
    accCalendar.makeCalendar(accCalendar.campaigns);
};

/** カレンダー作成 **/
accCalendar.makeCalendar = function(campaigns) {
    var tr, td, date, week, i, campaign, first, last, result;

    var target = accCalendar.target;
    var today = new Date();

    var tbody = htmler.tbody();
    tbody.id = "calendar_body";
    var oldtbody = document.getElementById("calendar_body");
    oldtbody.parentNode.replaceChild(tbody, oldtbody);

    accCalendar.setMonthHeaderText();

    if (today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear()) {
        date = accCalendar.target.getDate();
        accCalendar.setTodaysDay();
        document.getElementById("month_prev").onclick = null;
        document.getElementById("month_next").onclick = accCalendar.next;
    } else {
        date = 1;
        accCalendar.clearHighlightDay();
        document.getElementById("month_prev").onclick = accCalendar.prev;
        document.getElementById("month_next").onclick = accCalendar.next;
    }

    week = accCalendar.getWeek(target);
    var calendarData = accCalendar.getCalendarData(target, date);

    tr = accCalendar.appendTr();

    if (calendarData.beginDay - 1 > 0) {
      accCalendar.appendTd(tr, calendarData.beginDay - 1);
    }

    first = date;
    for (i = calendarData.beginDay; i <= 7; i++) {
        accCalendar.appendTd(tr, null, date);
        date++;
    }
    last = date;

    for (i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i];

        tr = accCalendar.appendTr("borderhidden");

        if (calendarData.beginDay - 1 > 0) {
          accCalendar.appendTd(tr, calendarData.beginDay - 1, null, "campaign");
        }

        accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
    }
    week++;

    while (date <= calendarData.end.getDate()) {
        tr = accCalendar.appendTr();

        first = date;
        for (var i = 1; i <= 7; i++) {
            if (date > calendarData.end.getDate()) {
                break;
            }
            accCalendar.appendTd(tr, null, date);
            date++;
        }
        last = date;

        for (var i = 0; i < campaigns.length; i++) {
            tr = htmler.tr("borderhidden");
            campaign = campaigns[i];
            accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
        }
        week++;
    }
};

accCalendar.getThemeColorClass = function(seed) {
  return constants.Colors[seed % constants.Colors.length];
};

window.onload = function() {
    info.getCampaign(function(campaigns, serviceTitles) {
        accCalendar.campaigns = campaigns;
        accCalendar.serviceTitles = serviceTitles;
        accCalendar.target = new Date();
        accCalendar.target.setMonth(accCalendar.target.getMonth());
        accCalendar.makeCalendar(accCalendar.campaigns);
    });
};

},{"./campaign":2,"./constants":3,"./htmler":4,"./info":5}],2:[function(require,module,exports){
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

},{"./constants":3}],3:[function(require,module,exports){
module.exports.Color = [
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

},{}],4:[function(require,module,exports){
/** <div> 作成 */
module.exports.div = function(opt_className, opt_id, opt_text) {
  var element = document.createElement("div");
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  if (opt_text) {
    element.innerText = opt_text;
  }
  return element;
};

/** <a> 作成 */
module.exports.a = function(href, opt_text, target, opt_className, opt_id) {
  if (typeof target === 'undefined') { // 未定義の場合は target="_blank"
    opt_target = '_blank';
  }
  if (typeof href === 'undefined') {
    href = 'https://tanjoin.github.io';
  }
  var element = document.createElement("a");
  if (href) {
    element.href = href;
  }
  if (target) {
    element.target = target;
  }
  if (opt_text) {
    element.innerText = opt_text;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <p> 作成 */
module.exports.p = function(opt_className, opt_id, opt_text) {
  var element = document.createElement("p");
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  if (opt_text) {
    element.innerText = opt_text;
  }
  return element;
};

/** <img> 作成 */
module.exports.img = function(src, width, height, className, opt_id) {
  if (typeof src === 'undefined') {
    src = 'https://tanjoin.github.io/acc/img/404.png';
  }
  if (typeof width === 'undefined') {
    width = "100%";
  }
  if (typeof height === 'undefined') {
    height = "100%";
  }
  if (typeof className === 'undefined') {
    className = 'materialboxed';
  }
  var element = document.createElement("img");
  if (src) {
    element.src = src;
  }
  if (width) {
    element.width = width;
  }
  if (height) {
    element.height = height;
  }
  if (className) {
    element.className = className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <i> 作成 */
module.exports.i = function(type, className, opt_id) {
  if (typeof type === 'undefined') {
    type = "";
  }
  if (typeof className === 'undefined') {
    className = "material-icons";
  }
  var element = document.createElement("i");
  if (type) {
    element.innerText = type;
  }
  if (className) {
    element.className = className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <tbody> 作成 */
module.exports.tbody = function(opt_className, opt_id) {
  var element = document.createElement('tbody');
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <td> 作成 */
module.exports.td = function(opt_colspan, opt_className, opt_id) {
  var element = document.createElement('td');
  if (opt_colspan) {
    td.colspan = opt_colspan;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <tr> 作成 */
module.exports.tr = function(opt_className, opt_id) {
  var element = document.createElement('tr');
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <h1> 作成 */
module.exports.h1 = function(text, opt_className, opt_id) {
  if (typeof text === 'undefined') {
    text = "";
  }
  var element = document.createElement('h1');
  if (text) {
    element.text = text;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

/** <h4> 作成 */
module.exports.h4 = function(text, opt_className, opt_id) {
  if (typeof text === 'undefined') {
    text = "";
  }
  var element = document.createElement('h4');
  if (text) {
    element.innerText = text;
  }
  if (opt_className) {
    element.className = opt_className;
  }
  if (opt_id) {
    element.id = opt_id;
  }
  return element;
};

},{}],5:[function(require,module,exports){
var Campaign = require('./campaign');

var ACC_URL = "https://tanjo.in/acc/campaign.json";

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

},{"./campaign":2}]},{},[1]);
