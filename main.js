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
      this.validateOnForDate_(now, acc.on.DATE.D_30) ||) {
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

