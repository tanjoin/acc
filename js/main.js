(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
module.exports.makeUrl = function(content) {
  if (!content) {
    return "";
  }
  var date = getUTC(new Date());
  var start = null;
  var end = content.date.end;
  if (!content.date.start) {
    start = new Date();
  } else {
    start = new Date(Date.parse(content.date.start));
  }
  if (!content.date.end) {
    end = new Date();
  } else if (content.date.end.length === 11) {
    end = new Date(Date.parse(content.date.end + "23:59"));
  } else {
    end = new Date(Date.parse(content.date.end));
  }
  return "https://www.google.com/calendar/event?action=TEMPLATE" +
    "&text=" + getText(content) +
    "&details=" + getDetails(content) +
    "&dates=" + getUTC(start) + "/" + getUTC(end);
};

var getUTC = function(date) {
  return date.getUTCFullYear() +
    zerofill(date.getUTCMonth()+1) +
    zerofill(date.getUTCDate()) +
    'T' +
    zerofill(date.getUTCHours()) +
    zerofill(date.getUTCMinutes()) +
    zerofill(date.getUTCSeconds()) +
    'Z'
};

var zerofill = function(num) {
  return ('0' + num).slice(-2);
}

var getText = function(content) {
  return encodeURIComponent(
    "【" + content.serviceTitle + "】" + content.title
  );
}

var getDetails = function(content) {
  var details = "";
  for (var i = 0; i < content.urls.length; i++) {
    details += content.urls[i] + "\n";
  }
  details += content.description + "\n";
  details += "https://tanjoin.github.io/acc/?id=" + content.id;
  return encodeURIComponent(details);
}

// var getRecurrence = function(content) {
//   if (content.join(',') === "All") {
//     return "";
//   }
//   var data = ""; // DAILY WEEKLY MONTHLY YEARLY
//   // 毎週N曜日
//   var byDay = content.join(',')
//     .replace('Sun', 'SU')
//     .replace('Mon', 'MO')
//     .replace('Tue', 'TU')
//     .replace('Wed', 'WE')
//     .replace('Thu', 'TH')
//     .replace('Fri', 'FR')
//     .replace('Sat', 'SA');
//   if (byDay && byDay.length > 0) {
//     data += "FREQ=WEEKLY;BYDAY=" + byDay + ";";
//   }
//   // 毎月2,15日
//   var byMonthDay = "FREQ=MONTHLY;BYMONTHDAY=" + content.join(',').replace('th', '');
//   if (byMonthDay) {
//     data += byMonthDay + ";";
//   }
//   var until = "UNTIL=" + getUTC(new Date(Date.parse(content.date.end)));
//   data += until;
//   return data;
// }

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
        queries[decodeURIComponent(splitedData[0])] = decodeURIComponent(splitedData[1]);
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

},{"./campaign":1}],6:[function(require,module,exports){
var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var HtmlBuilder = require('./html-builder');
var GCalendar = require('./g_calendar');

var acc = {
  campaigns: [],
  serviceTitles: []
};

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

  /** date が空の場合、エラーになるので仮の Object を追加して応急処置 **/
  if (!a.date) {
    a.date = {};
  }
  if (!b.date) {
    b.date = {};
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

var bindCardContent = function(cardContent, campaign) {
  var url = "?service_title=" + campaign.serviceTitle;
  var urlOfId = "?id=" + campaign.id;
  new HtmlBuilder(cardContent)
  .a(urlOfId, null, null, () => {
    history.pushState(null, null, urlOfId);
    showDetail(acc.campaigns, campaign.id);
    return false;
  })
  .div("blue-text col s10")
  .text(campaign.id)
  .div("col s2")
  .i("hidebutton material-icons")
  .intercept((icon) => {
    icon.campaign = campaign.id;
    icon.onclick = hideCampaign;
  })
  .text("clear")
  .div("card-title")
  .text(campaign.title)
  .a(url, null, null, () => {
    history.pushState(null, null, url);
    showServiceTitle(acc.campaigns, campaign.serviceTitle);
    $('#modal').modal("close");
    return false;
  })
  .div("chip blue-grey darken-1 amber-text")
  .text(campaign.serviceTitle)
  .then(campaign.hasDayText(), (self) => self.div("grey-text").text(campaign.dayText()))
  .p(campaign.description)
  .build()
  .then(campaign.hasUrl(), (self) => {
    for (var j = 1; j < campaign.urls.length; j++) {
      self.div().a(campaign.urls[j]).text("その" + (j + 1)).build();
    }
  })
  .build();
};

var bindCard = function(card, campaign) {
  new HtmlBuilder(card)
  .then(campaign.hasImage(), (self) => self.div("img").img(campaign.img, "materialboxed"))
  .div("card-content white-text")
  .intercept((cardContent, builder) => bindCardContent(cardContent, campaign))
  .build();
};

var bindView = function(row, campaign) {
  var builder = new HtmlBuilder(row);
  builder.div("col s12 m6 l3");
  if (campaign.urls && campaign.urls.length > 0) {
    builder.a(campaign.urls[0]);
  }
  builder.div("card blue-grey darken-3 z-depth-0")
  builder.intercept((card, builder) => bindCard(card, campaign))
  builder.build();
};

var createModalContent = function(modalContent, campaign) {
  var url = "?service_title=" + campaign.serviceTitle;
  new HtmlBuilder(modalContent)
  .h4()
  .text("[" + campaign.id + "] " + campaign.title)
  .div("chip")
  .a(url, null, null, (e) => {
    history.pushState(null, null, url);
    showServiceTitle(acc.campaigns, campaign.serviceTitle);
    $('#modal').modal("close");
    return false;
  })
  .text(campaign.serviceTitle)
  .p(campaign.dayText())
  .build()
  .p(campaign.description)
  .build();

  for (var i = 0; i < campaign.urls.length; i++) {
    new HtmlBuilder(modalContent)
    .div()
    .a(campaign.urls[i])
    .text("リンク" + (i + 1))
    .build();
  }

  if (campaign.date.start && campaign.date.end) {
    new HtmlBuilder(modalContent)
    .div("col s2")
    .a(GCalendar.makeUrl(campaign))
    .text("Googlecalendarに登録")
    .build();
  }
};

var showDetail = function(campaigns, id) {
  id = parseInt(id);
  var filtered = campaigns.filter((campaign) => campaign.id === id);
  if (filtered && filtered.length > 0) {
    var campaign = filtered[0];
    new HtmlBuilder("modal")
    .clean()
    .div("modal-content")
    .intercept((modalContent) => createModalContent(modalContent, campaign))
    .then(campaign.hasImage(), (self) => self.img(campaign.img, "responsive-img"))
    .build();

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
  var urlQuery = info.getUrlQuery();
  new HtmlBuilder("contents").clean().div("row").intercept((row) => {
    for (var i = 0; i < campaigns.length; i++) {
      var campaign = campaigns[i];
      if (acc.inverse && acc.inverse === 'true') {
        if (!campaign.isShow(now) && campaign.validateHide(urlQuery)) {
          bindView(row, campaign);
        }
      } else {
        if (campaign.isShow(now) && campaign.validateHide(urlQuery)) {
          bindView(row, campaign);
        }
      }
    }
  }).build();
};

var showContents = function() {
  var urlQuery = info.getUrlQuery();
  var id = info.getId(urlQuery);
  acc.inverse = info.getInverse(urlQuery);
  document.getElementById("logo").innerText = "Acc";
  if (id) {
    showDetail(acc.campaigns, id);
  } else {
    $('#modal').modal("close");
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
  info.getCampaigns((campaigns, serviceTitles) => {
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

},{"./campaign":1,"./constants":2,"./g_calendar":3,"./html-builder":4,"./info":5}]},{},[6]);
