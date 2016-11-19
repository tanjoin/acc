var acc = {};

/** @const */
acc.URL_QUERY_EQUAL = "=";

/** @const */
acc.URL_QUERY_AND = "&";

/** @const */
acc.API_METHOD_GET = "get";

/** @const */
acc.API_PATH_GET_CAMPAIGN = "campaign.json";

/** @const */
acc.ELEMENT_ID_CONTENTS = "contents";

/** @const */
acc.ELEMENT_DIV = "div";

/** @const */
acc.ELEMENT_A = "a";

/** @const */
acc.ELEMENT_P = "p";

/** @const */
acc.ELEMENT_IMG = "img";

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
    SUN: { day: 0, text: "Sun" },
    MON: { day: 1, text: "Mon" },
    TUE: { day: 2, text: "Tue" },
    WED: { day: 3, text: "Wed" },
    THU: { day: 4, text: "Thu" },
    FRI: { day: 5, text: "Fri" },
    SAT: { day: 6, text: "Sat" }
  },
  DATE: {
    D_05: { date: 5,  text: "5th"  },
    D_10: { date: 10, text: "10th" },
    D_15: { date: 15, text: "15th" },
    D_20: { date: 20, text: "20th" },
    D_25: { date: 25, text: "25th" },
    D_30: { date: 30, text: "30th" }
  }
};

/** @constructor */
acc.Campaign = function(opt_jsonData) {
  /**
   * JSON 文字列を parse したもの.
   * @type {Object|undefined}
   * @private
   */
  if (opt_jsonData == null) {
    return;
  }
  this.jsonData_ = opt_jsonData;
  this.id = opt_jsonData.id;
  this.title = opt_jsonData.title;
  this.serviceTitle = opt_jsonData.service_title;
  this.date = opt_jsonData.date;
  this.on = opt_jsonData.on;
  this.img = opt_jsonData.img;
  this.description = opt_jsonData.description;
  this.urls = opt_jsonData.urls;
};

acc.Campaign.prototype.hasUrl = function() {
  return this.urls != null && this.urls.length > 0;
};

acc.Campaign.prototype.hasImage = function() {
  return this.img != null && this.img.length > 0;
};

acc.Campaign.prototype.isShow = function(now) {
  return this.validateDate_(now) && this.validateOn_(now);
};

/** @private */
acc.Campaign.prototype.containsInOn_ = function(on) {
  return this.on != null && this.on.indexOf(on) != -1;
};

/** @private */
acc.Campaign.prototype.validateOn_ = function(now) {
  if (this.on == null) {
    return false;
  }
  if (this.containsInOn_(acc.On.ALL) ||
      this.validateOnForDay_(now, acc.On.DAY.SUN) ||
      this.validateOnForDay_(now, acc.On.DAY.MON) ||
      this.validateOnForDay_(now, acc.On.DAY.TUE) ||
      this.validateOnForDay_(now, acc.On.DAY.WED) ||
      this.validateOnForDay_(now, acc.On.DAY.THU) ||
      this.validateOnForDay_(now, acc.On.DAY.FRI) ||
      this.validateOnForDay_(now, acc.On.DAY.SAT) ||
      this.validateOnForDate_(now, acc.on.DATE.D_5)  ||
      this.validateOnForDate_(now, acc.on.DATE.D_10) ||
      this.validateOnForDate_(now, acc.on.DATE.D_15) ||
      this.validateOnForDate_(now, acc.on.DATE.D_20) ||
      this.validateOnForDate_(now, acc.on.DATE.D_25) ||
      this.validateOnForDate_(now, acc.on.DATE.D_30)) {
    return true;
  }
  return false;
};

/** @private */
acc.Campaign.prototype.validateOnForDay_ = function(now, onDay) {
  return now.getDay() == onDay.day && this.containsInOn_(onDay.text);
};

/** @private */
acc.Campaign.prototype.validateOnForDate_ = function(now, onDate) {
  return now.getDate() == onDate.date && this.containsInOn_(onDate.text);
};

/** @private 日付チェック */
acc.Campaign.prototype.validateDate_ = function(now) {
  if (now == null) {
    now = new Date();
  }
  var start = new Date(Date.parse(this.date.start));
  var end = new Date(Date.parse(this.date.end));
  if (start != null && start.getTime() > now.getTime()) {
    return false;
  }
  if (end != null && now.getTime() > end.getTime()) {
    return false;
  }
  return true;
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
  
/** キャンペーン情報を取得する. */
acc.getCampaign = function(callback) {
  var request = new XMLHttpRequest();
  request.open(acc.API_METHOD_GET, acc.API_PATH_GET_CAMPAIGN, true);
  request.onload(callback);
  request.send(null);
};
  
/** JSON データを Campaign に変換. */
acc.convertData = function(responseText) {
  var data = JSON.parse(responseText);
  var campaigns = [];
  for (var i = 0; i < data.campaigns.length; i++) {
    var campaign = new acc.Campaign(data.campaigns[i]);
    campaigns.push(campaign);
  }
  return campaigns;
};
  
/** URL Query から service_title を取得する */
acc.getServiceTitle = function(urlQuery) {
  if (urlQuery != null && query.service_title.length > 0) {
    return decodeURI(query.service_title);
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

acc.createImg = function(opt_src) {
  var img = document.createElement(acc.ELEMENT_IMG);
  if (opt_src != null) {
    img.src = opt_src;
  }
  return img;
};

/** <div id="contents"> に要素を追加 */
acc.insertInContents = function(element) {
  document.getElementById(acc.ELEMENT_ID_CONTENTS).appendChild(element);
};
  
acc.onload = function(urlQuery) {
  var viewType = acc.getViewType(urlQuery);
  var serviceTitle = acc.getServiceTitle(urlQuery);
  
  acc.getCampaign(function() {
    var campaigns = acc.convertData(this.responseText);
    var row = acc.createDiv("row");
    acc.insertInContents(row);
    var now = new Date();

    for (var i = 0; i < campaigns.length; i++) {
      var campaign = campaigns[i];
      var isShow = campaign.isShow(now);
      if (viewType == acc.ViewType.SERVICE_TITLE) {
        isShow = isShow && acc.validateServiceTitle(serviceTitle);
      }
      if (isShow) {
        // TODO: 何かやる
        var col = acc.createDiv("col s12 m6 l3");
        row.appendChild(col);

        var card;
        if (campaign.hasUrl()) {
          var cardLink = acc.createA(campaign.urls[0]);
          card = acc.createDiv("card blue-grey darken-3 waves-effect waves-block waves-light");
          cardLink.appendChild(card);
          col.appendChild(cardLink);
        } else {
          card = acc.createDiv("card blue-grey darken-3");
          col.appendChild(card);
        }

        if (campaign.hasImage()) {
          var cardImage = acc.createDiv("img");
          var img = acc.createImg(campaign.img);
          cardImage.appendChild(img);
          card.appendChild(cardImage);
        }

        var cardContent = acc.createDiv("card-content white-text");
        card.appendChild(cardContent);

        var cardId = acc.createDiv("blue-text");
        cardId.innerText = campaign.id;
        cardContent.appendChild(cardId);

        var cardTitle = acc.createDiv("card-title");
        cardTitle.innerText = campaign.title;
        cardContent.appendChild(cardTitle);

        var cardService = acc.createDiv("amber-text");
        cardService.innerText = campaign.serviceTitle;
        var cardServicelink = acc.createA("/acc/?service_title=" + campaign.service_title);
        cardServicelink.appendChild(cardService);
        cardContent.appendChild(cardServicelink);

        var cardDay = acc.createDiv("grey-text");
        cardDay.innerText = campaign.date.start || '';
        cardDay.innerText += "～";
        cardDay.innerText += campaign.date.end || '';
        if (cardDay.innerText != null && cardDay.innerText.length > 0 && cardDay.innerText != "～") {
          cardContent.appendChild(cardDay);
        }

        var description = acc.createP();
        description.innerText = campaign.description;
        cardContent.appendChild(description);

        var cardAction = acc.createDiv("card-action");
        var isAddCardAction = false;
        for (var j = 1; j < campaign.urls.length; j++) {
          var a = acc.createA(campaign.urls[j]);
          a.innerText = "その" + (j + 1);
          cardAction.appendChild(a);
          isAddCardAction = true;
        }
        if (isAddCardAction) {
          cardContent.appendChild(cardAction);
        }
      }
    }
  });
};
  
window.onload = function() {
  var urlQuery = acc.getUrlQuery();
  acc.onload(urlQuery);
};
