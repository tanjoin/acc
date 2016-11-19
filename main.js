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
  if (opt_data == null) {
    return;
  }
  this.jsonData_ = opt_data;
  this.id = opt_data.id;
  this.title = opt_data.title;
  this.serviceTitle = opt_data.service_title;
  this.date = opt_data.date;
  this.on = opt_data.on;
  this.img = opt_data.img;
  this.description = opt_data.description;
  this.urls = opt_data.urls;
};

