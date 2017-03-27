(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    this.serviceTitle = opt_jsonData.serviceTitle;
    this.date = opt_jsonData.date;
    this.on = opt_jsonData.on;
    this.urls = opt_jsonData.urls;
    this.img = opt_jsonData.img;
    this.description = opt_jsonData.description;
  }
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
acc.Campaign.prototype.validateOn_ = function(now) {
    if (!this.on) {
        return false;
    }
    if (this.containsInOn(acc.On.ALL)) {
      return true;
    }
    var key;
    for (key in acc.On.DAY) {
      if (this.validateOnForDay_(now, acc.On.DAY[key])) {
        return true;
      }
    }
    for (key in acc.On.DATE) {
      if (this.validateOnForDate_(now, acc.On.DATE[key])) {
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

module.exports.Campaign = Campaign;

},{}],2:[function(require,module,exports){
var Campaign = require('./campaign');

var ACC_URL = "https://tanjo.in/acc/campaign.json";

/** キャンペーン情報を取得する. */
module.exports.getCampaigns = function(callback) {
  var request = new XMLHttpRequest();
  request.open('GET', ACC_URL, true);
  request.onload = function() {
    var data = JSON.parse(this.responseText);
    var campaigns = data.campaigns.map((data) => new Campaign(data));
    var serviceTitles = campaigns
        .map((c) => c.serviceTitle)
        .filter((x, i, self) => self.indexOf(x) === i);
    callback(campaigns, serviceTitles);
  };
  request.send(null);
};

},{"./campaign":1}],3:[function(require,module,exports){
var Campaign = require('./campaign');
var info = require('./info');

var acc = {};

/** @const */
acc.URL_QUERY_EQUAL = "=";

/** @const */
acc.URL_QUERY_AND = "&";

/** @const */
acc.API_METHOD_GET = "get";

/** @const */
acc.API_PATH_GET_CAMPAIGN = "https://tanjo.in/acc/campaign.json";

/** @const */
acc.ELEMENT_ID_CONTENTS = "contents";

/** @const */
acc.ELEMENT_DIV = "div";

/** @const */
acc.ELEMENT_A = "a";

/** @const */
acc.ELEMENT_P = "p";

/** @const */
acc.ELEMENT_I = "i";

/** @const */
acc.ELEMENT_IMG = "img";

/** @const */
acc.CLASS_NAME_MATERIAL_ICONS = "material-icons";

/** @enum {string} */
acc.ViewType = {
    ALL: "all",
    SERVICE_TITLE: "service_title",
    CATEGORY: "category"
};

/** @enum {Object} */
acc.On = {
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

/** Get URL Query Parameters. */
acc.getUrlQuery = function() {
    var url = window.location.search;
    var hash = url.slice(1).split(acc.URL_QUERY_AND);
    var queries = [];
    for (var i = 0; i < hash.length; i++) {
        var splitedData = hash[i].split(acc.URL_QUERY_EQUAL);
        queries.push(splitedData[0]);
        queries[splitedData[0]] = splitedData[1];
    }
    return queries;
};

/** JSON データを Campaign に変換. */
acc.convertData = function(responseText) {
    var data = JSON.parse(responseText);
    var campaigns = [];
    for (var i = 0; i < data.campaigns.length; i++) {
        var campaign = new Campaign(data.campaigns[i]);
        campaigns.push(campaign);
    }
    return campaigns;
};

/** URL Query から service_title を取得する */
acc.getServiceTitle = function(urlQuery) {
    if (urlQuery != null && urlQuery.service_title != null && urlQuery.service_title.length > 0) {
        return decodeURI(urlQuery.service_title);
    }
    return null;
};

/** ViewType を選別 */
acc.getViewType = function(urlQuery) {
    if (urlQuery.service_title != null) {
        return acc.ViewType.SERVICE_TITLE;
    }
    if (urlQuery.category != null) {
        return acc.ViewTYpe.CATEGORY;
    }
    return acc.ViewType.ALL;
};

/** Campaign をフィルタリング. */
acc.filterCampaigns = function(campaigns, serviceTitle) {
    var result = [];
    for (var j = 0; j < campaigns.length; j++) {
        var campaign = campaigns[j];
        if (campaign.serviceTitle == serviceTitle) {
            result.push(campaign);
        }
    }
    return result;
};

/** Campaign をソート */
acc.sortCampaigns = function(campaigns) {
  campaigns.sort(function(a, b) {
    if (!a.containsInOn(acc.On.ALL) && !b.containsInOn(acc.On.ALL)) {
      if (a.id > b.id) {
        return -1;
      }
      if (a.id < b.id) {
        return 1;
      }
      return 0;
    }

    if (!a.containsInOn(acc.On.ALL)) {
      return -1;
    }
    if (!b.containsInOn(acc.On.ALL)) {
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
  });
  return campaigns;
};

/** service_title が一致するかどうか */
acc.validateServiceTitle = function(campaign, serviceTitle) {
    if (campaign != null && campaign.serviceTitle == serviceTitle) {
        return true;
    }
    return false;
};

/** <div> 作成 */
acc.createDiv = function(opt_className) {
    var div = document.createElement(acc.ELEMENT_DIV);
    if (opt_className != null) {
        div.className = opt_className;
    }
    return div;
};

/** <a> 作成 */
acc.createA = function(opt_href) {
    var a = document.createElement(acc.ELEMENT_A);
    if (opt_href != null) {
        a.href = opt_href;
    }
    return a;
};

/** <p> 作成 */
acc.createP = function(opt_className) {
    var p = document.createElement(acc.ELEMENT_P);
    if (opt_className != null) {
        p.className = opt_className;
    }
    return p;
};

/** <img> 作成 */
acc.createImg = function(opt_src) {
    var img = document.createElement(acc.ELEMENT_IMG);
    img.setAttribute("width", "100%");
    img.setAttribute("height", "100%");
    img.className = "materialboxed";
    if (opt_src != null) {
        img.src = opt_src;
    }
    return img;
};

/** <i> 作成 */
acc.createIcon  = function(opt_type) {
    var icon = document.createElement(acc.ELEMENT_I);
    icon.className = acc.CLASS_NAME_MATERIAL_ICONS;
    icon.innerText = opt_type;
    return icon;
};

/** <div id="contents"> に要素を追加 */
acc.insertInContents = function(element) {
    document.getElementById(acc.ELEMENT_ID_CONTENTS).appendChild(element);
};

acc.hideCampaign = function() {
  var id = this.campaignId;
  var count = 0;
  var urlQuery = acc.getUrlQuery();
  if (id == null) {
    return true;
  }
  var url = window.location.origin + window.location.pathname + "?";

  var serviceTitle = acc.getServiceTitle(urlQuery);
  if (serviceTitle != null && serviceTitle.length > 0) {
    url = url + "service_title=" + serviceTitle + "&";
  }
  url = url + "hide[" + count + "]=" + id;
  count = count + 1;
  for (var i = 0; i < urlQuery.length; i++) {
      var hideId = urlQuery["hide[" + i + "]"];
      if (null == hideId) {
        break;
      }
      url = url + "&hide[" + count + "]=" + hideId;
      count = count + 1;
  }
  document.location = url;
  return false;
};

acc.onload = function(urlQuery) {
    var viewType = acc.getViewType(urlQuery);
    var serviceTitle = acc.getServiceTitle(urlQuery);

    info.getCampaign(function(campaigns, serviceTitles) {
        var now = new Date();

        if (viewType == acc.ViewType.SERVICE_TITLE) {
            campaigns = acc.filterCampaigns(campaigns, serviceTitle);
        }

        campaigns = acc.sortCampaigns(campaigns);

        var row = acc.createDiv("row");
        acc.insertInContents(row);

        for (var i = 0; i < campaigns.length; i++) {
            var campaign = campaigns[i];
            var isShow = campaign.isShow(now);
            isShow = isShow && acc.validateHide(campaign, urlQuery);
            if (viewType == acc.ViewType.SERVICE_TITLE) {
                isShow = isShow && acc.validateServiceTitle(serviceTitle);
            }
            if (isShow) {
                acc.bindView(row, campaign);
            }
        }
    });
};

acc.validateHide = function(campaign, urlQuery) {
    for (var i = 0; i < urlQuery.length; i++) {
        if (campaign.id == urlQuery["hide[" + i + "]"]) {
            return false;
        }
    }
    return true;
}

acc.insertDiv = function(content, className, opt_innerText, opt_appendChild, opt_isEnableNullOrEmpty) {
    var div = acc.createDiv(className);
    if (opt_innerText != null) {
        div.innerText = opt_innerText;
    }
    if (opt_appendChild != null) {
        div.appendChild(opt_appendChild);
    }
    if (opt_isEnableNullOrEmpty == null || opt_isEnableNullOrEmpty == false) {
        content.appendChild(div);
    } else {
        if (opt_innerText != null && opt_innerText.length > 0) {
            content.appendChild(div);
        }
    }
    return div;
};

acc.bindView = function(row, campaign) {
    var col = acc.createDiv("col s12 m6 l3");
    row.appendChild(col);

    var card;
    if (campaign.hasUrl()) {
        var cardLink = acc.createA(campaign.urls[0]);
        card = acc.createDiv("card blue-grey darken-3 z-depth-0");
        cardLink.appendChild(card);
        col.appendChild(cardLink);
    } else {
        card = acc.createDiv("card blue-grey darken-3 z-depth-0");
        col.appendChild(card);
    }

    if (campaign.hasImage()) {
        acc.insertDiv(card, "img", null, acc.createImg(campaign.img));
    }

    var cardContent = acc.insertDiv(card, "card-content white-text");
    acc.insertDiv(cardContent, "blue-text col s10", campaign.id);
    var doneIcon = acc.createIcon("clear");
    doneIcon.className = doneIcon.className + " hidebutton";
    doneIcon.campaignId = campaign.id;
    doneIcon.onclick = acc.hideCampaign;
    acc.insertDiv(cardContent, "col s2", null, doneIcon);
    acc.insertDiv(cardContent, "card-title", campaign.title);

    var cardServicelink = acc.createA("/acc/?service_title=" + campaign.serviceTitle);
    acc.insertDiv(cardServicelink, "chip blue-grey darken-1 amber-text", campaign.serviceTitle);
    cardContent.appendChild(cardServicelink);

    var dayText;
    var startText = campaign.date.start || '';
    var endText = campaign.date.end || '';
    if (startText.length != 0 || endText.length != 0) {
      dayText = startText + "～" + endText;
    }
    acc.insertDiv(cardContent, "grey-text", dayText, null, true);

    var description = acc.createP();
    description.innerText = campaign.description;
    cardContent.appendChild(description);

    if (campaign.hasUrl()) {
      for (var j = 1; j < campaign.urls.length; j++) {
          var div = acc.createDiv();
          var a = acc.createA(campaign.urls[j]);
          a.innerText = "その" + (j + 1);
          div.appendChild(a);
          cardContent.appendChild(div);
      }
    }
};

window.onload = function() {
    var urlQuery = acc.getUrlQuery();
    acc.onload(urlQuery);
};

// Materialize code

$(document).ready(function(){
    $('.materialboxed').materialbox();
});

$(".button-collapse").sideNav();

},{"./campaign":1,"./info":2}]},{},[3]);
