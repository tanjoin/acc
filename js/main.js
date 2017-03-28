(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./campaign":1}],5:[function(require,module,exports){
var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');

var acc = {};

/** Campaign をソート */
var sortCampaigns = function(a, b) {
  if (!a.containsInOn(constants.On.ALL) && !b.containsInOn(constants.On.ALL)) {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  }

  if (!a.containsInOn(constants.On.ALL)) {
    return -1;
  }
  if (!b.containsInOn(constants.On.ALL)) {
    return 1;
  }

  var aDate = new Date(Date.parse(a.date.end));
  var bDate = new Date(Date.parse(b.date.end));

  if (isNaN(aDate.getTime()) && isNaN(bDate.getTime())) {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  }

  if (isNaN(aDate.getTime())) {
    return 1;
  }
  if (isNaN(bDate.getTime())) {
    return -1;
  }

  if (aDate.getTime() > bDate.getTime()) {
    return 1;
  }

  if (aDate.getTime() < bDate.getTime()) {
    return -1;
  }
  return 0;
};

var hideCampaign = function() {
  var id = this.campaign;
  var count = 0;
  var urlQuery = info.getUrlQuery();
  if (!id) {
    return true;
  }
  var query = "?";

  var serviceTitle = info.getServiceTitle(urlQuery);
  if (serviceTitle && serviceTitle.length > 0) {
    query += "service_title=" + serviceTitle;
  }
  if (query.length > 1) {
    query += "&";
  }
  query += "hide[" + (count++) + "]=" + id;
  var hideId;
  for (var i = 0; i < urlQuery.length; i++) {
    hideId = urlQuery["hide[" + i + "]"];
    if (!hideId) {
      break;
    }
    query += "&hide[" + (count++) + "]=" + hideId;
  }
  history.pushState(null, null, query);
  showContents();
  return false;
};

var validateHide = function(campaign, urlQuery) {
  for (var i = 0; i < urlQuery.length; i++) {
      if (campaign.id == urlQuery["hide[" + i + "]"]) {
          return false;
      }
  }
  return true;
};

var insertDiv = function(content, className, opt_innerText, opt_appendChild, opt_isEnableNullOrEmpty) {
  var div = htmler.div(className, null, opt_innerText);
  if (opt_appendChild) {
    div.appendChild(opt_appendChild);
  }
  if (opt_isEnableNullOrEmpty && (!opt_innerText || opt_innerText.length === 0)) {
    return div;
  }
  content.appendChild(div);
  return div;
};

acc.bindView = function(row, campaign) {
    var col = htmler.div("col s12 m6 l3");
    row.appendChild(col);

    var card;
    if (campaign.hasUrl()) {
        var cardLink = htmler.a(campaign.urls[0]);
        card = htmler.div("card blue-grey darken-3 z-depth-0");
        cardLink.appendChild(card);
        col.appendChild(cardLink);
    } else {
        card = htmler.div("card blue-grey darken-3 z-depth-0");
        col.appendChild(card);
    }

    if (campaign.hasImage()) {
        acc.insertDiv(card, "img", null, htmler.img(campaign.img));
    }

    var cardContent = acc.insertDiv(card, "card-content white-text");
    acc.insertDiv(cardContent, "blue-text col s10", campaign.id);
    var doneIcon = htmler.i("clear");
    doneIcon.className = doneIcon.className + " hidebutton";
    doneIcon.campaign = campaign.id;
    doneIcon.onclick = hideCampaign;
    acc.insertDiv(cardContent, "col s2", null, doneIcon);
    acc.insertDiv(cardContent, "card-title", campaign.title);

    var cardServicelink = htmler.a("?service_title=" + campaign.serviceTitle);
    cardServicelink.onclick = function() {
      history.pushState(null, null, "?service_title=" + campaign.serviceTitle);
      showServiceTitle(acc.campaigns, campaign.serviceTitle);
      $('#modal').modal("close");
      return false;
    };
    acc.insertDiv(cardServicelink, "chip blue-grey darken-1 amber-text", campaign.serviceTitle);
    cardContent.appendChild(cardServicelink);

    acc.insertDiv(cardContent, "grey-text", campaign.dayText(), null, true);

    var description = htmler.p();
    description.innerText = campaign.description;
    cardContent.appendChild(description);

    if (campaign.hasUrl()) {
      for (var j = 1; j < campaign.urls.length; j++) {
          var div = htmler.div();
          var a = htmler.a(campaign.urls[j]);
          a.innerText = "その" + (j + 1);
          div.appendChild(a);
          cardContent.appendChild(div);
      }
    }
};

var showDetail = function(campaigns, id) {
  id = parseInt(id);
  var filtered = campaigns.filter((campaign) => campaign.id === id);
  if (filtered && filtered.length > 0) {
    var modalContent = htmler.div("modal-content");
    var target = filtered[0];
    if (target.img && target.img.length > 0) {
      modalContent.appendChild(htmler.img(target.img, null, null, "responsive-img"));
    }
    modalContent.appendChild(htmler.h4("[" + target.id + "] " + target.title));
    var chip = htmler.div("chip");
    var a = htmler.a("?service_title=" + target.serviceTitle, target.serviceTitle);
    a.onclick = function() {
      history.pushState(null, null, "?service_title=" + target.serviceTitle);
      showServiceTitle(campaigns, target.serviceTitle);
      $('#modal').modal("close");
      return false;
    };
    chip.appendChild(a);
    modalContent.appendChild(chip);
    modalContent.appendChild(htmler.p(null, null, target.dayText()));
    modalContent.appendChild(htmler.p(null, null, target.description));
    for (var i = 0; i < target.length; i++) {
      var div = htmler.div();
      div.appendChild(htmler.a(target.urls[i], "リンク" + i));
      modalContent.appendChild(div);
    }
    var modal = document.getElementById("modal");
    while (modal.firstChild) {
      modal.removeChild(modal.firstChild);
    }
    modal.appendChild(modalContent);
    $('#modal').modal();
    $('#modal').modal("open");
  }
};

var showServiceTitle = function(campaigns, serviceTitle) {
  if (!serviceTitle) {
    return;
  }
  document.getElementById("logo").innerText = "Acc : " + serviceTitle;
  campaigns = campaigns.filter((data) => data.serviceTitle === serviceTitle);
  campaigns.sort(sortCampaigns);
  showCampaigns(campaigns);
};

var showCampaigns = function(campaigns) {
  var now = new Date();
  var row = htmler.div("row");
  var urlQuery = info.getUrlQuery();
  var contents = document.getElementById("contents");
  while (contents.firstChild) {
    contents.removeChild(contents.firstChild);
  }
  contents.appendChild(row);

  for (var i = 0; i < campaigns.length; i++) {
    var campaign = campaigns[i];
    var isShow = campaign.isShow(now);
    isShow = isShow && validateHide(campaign, urlQuery);
    if (isShow) {
      acc.bindView(row, campaign);
    }
  }
};

var showContents = function() {
  var urlQuery = info.getUrlQuery();
  var id = info.getId(urlQuery);
  document.getElementById("logo").innerText = "Acc";
  if (id) {
    showDetail(acc.campaigns, id);
    return;
  }
  var serviceTitle = info.getServiceTitle(urlQuery);
  if (serviceTitle) {
    showServiceTitle(acc.campaigns, serviceTitle);
    return;
  }
  // 通常表示
  acc.campaigns.sort(sortCampaigns);
  showCampaigns(acc.campaigns);
};

window.onload = function() {
  info.getCampaigns(function(campaigns, serviceTitles) {
    acc.campaigns = campaigns;
    acc.serviceTitles = serviceTitles;
    showContents();
  });
};

window.onpopstate = function(event) {
  if (event.isTrusted) {
    showContents();
  }
};

// Materialize code

$(document).ready(function(){
  $('.materialboxed').materialbox();
});

$(".button-collapse").sideNav();

},{"./campaign":1,"./constants":2,"./htmler":3,"./info":4}]},{},[5]);
