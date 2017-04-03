(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');
var HtmlBuilder = require('./html-builder');

var accCalendar = {
  campaigns: [],
  serviceTitles: [],
  target: new Date()
};

/** 月初 **/
var getBeginningOfMonth = function(target, num) {
  var date = new Date(target.getTime());
  if (num) {
    date.setDate(num);
  } else {
    date.setDate(1);
  }
  return date;
};

/** 月末 **/
var getEndOfMonth = function(target) {
  var date = new Date(target.getTime());
  date.setDate(1);
  date.setMonth(date.getMonth() + 1);
  date.setDate(0);
  return date;
};

/** 曜日の位置を取得する **/
var getIndexOfDay = function(date) {
  var day = date.getDay();
  if (day === 0) {
    return 7;
  }
  return day;
};

/** カレンダーの生成に必要な情報を取得 **/
var getCalendarData = function(target, num) {
  var begin = getBeginningOfMonth(target, num);
  var end = getEndOfMonth(target);
  return {
    "begin": begin,
    "end": end,
    "beginDay": getIndexOfDay(begin),
    "endDay": getIndexOfDay(end)
  };
};

/** 今日の曜日を強調する **/
var setTodaysDay = function() {
  var today = new Date();
  new HtmlBuilder(constants.DAYOFTHEWEEK[today.getDay()])
  .intercept((th) => th.style.backgroundColor = "#eeeeee")
  .build();
};

var clearHighlightDay = function() {
  for (var i = 0; i < constants.DAYOFTHEWEEK.length; i++) {
    var th = document.getElementById(list[i]);
    th.style.backgroundColor = "";
  }
};

var setMonthHeaderText = function() {
  var target = accCalendar.target;
  new HtmlBuilder("month_area")
  .clean()
  .h1(null, "month_header")
  .text(target.getFullYear() + "年" + (target.getMonth() + 1) + "月")
  .build();
};

/** その月の第何週目かを返す **/
var getWeek = function(date) {
  var d = new Date(date.getTime());
  return Math.floor((d.getDate() - d.getDay() + 12) / 7);
};

var createCampaignBar = function(tr, campaign, calendarData, first, last, idPrefix) {
  var campaignStart = new Date(Date.parse(campaign.date.start));
  var campaignEnd = null;
  if (campaign.date.end && campaign.date.end.length === 10) {
    campaignEnd = new Date(Date.parse(campaign.date.end + " 23:59"));
  } else if (campaign.date.end) {
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
    if (!campaign.validateOn_(date) || (campaignStart && campaignStart > date) || (campaignEnd && campaignEnd < date)) { // 開始前 or 終了済み
      if (isEmpty && td) {
        td.colSpan = td.colSpan + 1;
      } else {
        if (td) {
          tr.appendChild(td);
        }
        td = htmler.td(1, "campaign");
      }
      isEmpty = true;
    } else {
      if (isEmpty || !td) {
        if (td) {
          tr.appendChild(td);
        }
        td = htmler.td(
          1,
          "campaign " + getThemeColorClass(campaign.serviceTitle) + " lighten-4",
          idPrefix + campaign.id
        );
        var title = "【" + campaign.serviceTitle + "】" + campaign.title;
        if (campaign.urls && campaign.urls.length > 0) {
          td.appendChild(htmler.a(campaign.urls[0], title));
        } else {
          td.innerText = title;
        }
        // ツールチップの表示
        td.title = title;
      } else {
        td.colSpan = td.colSpan + 1;
      }
      isEmpty = false;
    }
    date.setDate(date.getDate() + 1);
  }
  if (td) {
    tr.appendChild(td);
  }
  document.getElementById("calendar_body").appendChild(tr);
};

var nextMonth = function() {
  accCalendar.target.setMonth(accCalendar.target.getMonth() + 1);
  makeCalendar();
};

var prevMonth = function() {
  accCalendar.target.setMonth(accCalendar.target.getMonth() - 1);
  makeCalendar();
};

/** カレンダー作成 **/
var makeCalendar = function() {
  var campaigns = accCalendar.campaigns;
  var target = accCalendar.target;
  var today = new Date();

  new HtmlBuilder("calendar_body").clean();

  setMonthHeaderText();

  var isThisMonth = today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear();
  if (isThisMonth) {
    date = target.getDate();
    setTodaysDay();
  } else {
    date = 1;
    clearHighlightDay();
  }
  document.getElementById("month_prev").onclick = isThisMonth ? null : prevMonth;
  document.getElementById("month_next").onclick = nextMonth;

  var week = getWeek(target);
  var calendarData = getCalendarData(target, date);

  new HtmlBuilder("calendar_body")
  .tr()
  .intercept((tr) => {
    var colSpan = calendarData.beginDay - 1;
    new HtmlBuilder(tr)
    .then(colSpan > 0, (self) => self.td(null, null, colSpan))
    .build();

    first = date;
    for (var i = calendarData.beginDay; i <= 7; i++) {
      new HtmlBuilder(tr)
      .td()
      .build();
      date++;
    }
    last = date;

    for (i = 0; i < campaigns.length; i++) {
      campaign = campaigns[i];

      new HtmlBuilder("calendar_body")
      .tr("borderhidden")
      .intercept((tr) => {
        var colSpan = calendarData.beginDay - 1;
        if (colSpan > 0) {
          new HtmlBuilder(tr)
          .then(colSpan > 0, (self) => self.td("campaign", null, colSpan))
          .build();
        }
        createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
      })
      .build();
    }
    week++;

    while (date <= calendarData.end.getDate()) {
      new HtmlBuilder("calendar_body")
      .tr()
      .intercept((tr) => {
        first = date;
        for (var i = 1; i <= 7; i++) {
          if (date > calendarData.end.getDate()) {
            break;
          }
          new HtmlBuilder(tr)
          .td()
          .then(date, (self) => self.intercept((td) => td.innerText = date))
          .build();
          date++;
        }
        last = date;

        for (i = 0; i < campaigns.length; i++) {
          tr = htmler.tr("borderhidden");
          campaign = campaigns[i];
          createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
        }
      })
      .build();
      week++;
    }
  })
  .build();
};

var getThemeColorClass = function(serviceTitle) {
  var seed = accCalendar.serviceTitles.indexOf(serviceTitle);
  return constants.Colors[seed % constants.Colors.length];
};

window.onload = function() {
  info.getCampaigns(function(campaigns, serviceTitles) {
    accCalendar.campaigns = campaigns;
    accCalendar.serviceTitles = serviceTitles;
    accCalendar.target = new Date();
    makeCalendar(accCalendar.campaigns);
  });
};

},{"./campaign":2,"./constants":3,"./html-builder":4,"./htmler":5,"./info":6}],2:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
/** @constructor */
var HtmlBuilder = function(element) {
  if (typeof element === "string") {
    this.element = document.getElementById(element);
  } else if (typeof element === "object") {
    this.element = element;
  }
  this.paragraph = [];
};

HtmlBuilder.prototype = {
  then : function(conditoin, callback) {
    if (callback && conditoin) {
      var result = callback(this);
      if (result) {
        return result;
      }
    }
    return this;
  },
  ifElse : function(conditoin, trueCallback, falseCallback) {
    if (conditoin) {
      if (trueCallback) {
        var trueResult = rueCallback(this);
        if (trueResult) {
          return trueResult;
        }
      }
    } else {
      if (falseCallback) {
        var falseResult = falseCallback(this);
        if (falseResult) {
          return falseResult;
        }
      }
    }
    return this;
  },
  clean : function() {
    var element = this.toElement();
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
    return this;
  },
  intercept : function(callback) {
    callback(this.toElement(), this);
    return this;
  },
  toElement : function() {
    if (this.paragraph.length > 0) {
      return this.paragraph[this.paragraph.length - 1];
    } else if (this.element) {
      return this.element;
    }
    return null;
  },
  build : function() {
    for (var i = 0; i < this.paragraph.length; i++) {
      if (i === 0) {
        if (this.element) {
          this.element.appendChild(this.paragraph[i]);
        } else {
          this.element = this.paragraph[i];
        }
      } else {
        this.paragraph[i - 1].appendChild(this.paragraph[i]);
      }
    }
    this.paragraph = [];
    return this;
  },
  div : function(opt_className, opt_id) {
    var element = document.createElement("div");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  text : function(text) {
    this.paragraph.push(document.createTextNode(text));
    return this.build();
  },
  a : function(href, opt_className, opt_id, opt_onclick) {
    if (href) {
      var element = document.createElement("a");
      element.href = href;
      if (opt_className) {
        element.className = opt_className;
      }
      if (opt_id) {
        element.id = opt_id;
      }
      if (opt_onclick) {
        element.onclick = opt_onclick;
      }
      this.paragraph.push(element);
    }
    return this;
  },
  p : function(opt_innerText, opt_className, opt_id) {
    var element = document.createElement("p");
    if (opt_innerText) {
      element.innerText = opt_innerText;
    }
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  img : function(src, opt_className, opt_id) {
    var element = document.createElement("img");
    element.src = src;
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this.build();
  },
  i : function(opt_className, opt_id) {
    var element = document.createElement("i");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  tbody : function(opt_className, opt_id) {
    var element = document.createElement("tbody");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  tr : function(opt_className, opt_id) {
    var element = document.createElement("tr");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  td : function(opt_className, opt_id, opt_colSpan) {
    var element = document.createElement("td");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    if (opt_colSpan) {
      element.colSpan = opt_colSpan;
    }
    this.paragraph.push(element);
    return this;
  },
  h1 : function(opt_className, opt_id) {
    var element = document.createElement("h1");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  h2 : function(opt_className, opt_id) {
    var element = document.createElement("h2");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  h3 : function(opt_className, opt_id) {
    var element = document.createElement("h3");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  },
  h4 : function(opt_className, opt_id) {
    var element = document.createElement("h4");
    if (opt_className) {
      element.className = opt_className;
    }
    if (opt_id) {
      element.id = opt_id;
    }
    this.paragraph.push(element);
    return this;
  }
};

module.exports = HtmlBuilder;

},{}],5:[function(require,module,exports){
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
    element.colspan = opt_colspan;
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

},{}],6:[function(require,module,exports){
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

module.exports.getInverse = function(urlQuery) {
  if (urlQuery && urlQuery.inverse && urlQuery.inverse.length > 0) {
    return decodeURIComponent(urlQuery.inverse);
  }
  return false;
};

},{"./campaign":2}]},{},[1]);
