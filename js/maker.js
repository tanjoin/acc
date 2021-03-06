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

},{"./campaign":1}],4:[function(require,module,exports){
var info = require('./info');

var acc = {
  campaigns: []
};

// $('.datepicker').dblclick(function() {
//   var input = $('.datepicker').pickadate({
//     format: 'yyyy/mm/dd',
//     close: 'OK',
//     selectMonths: true, // Creates a dropdown to control month
//     selectYears: 15 // Creates a dropdown of 15 years to control year
//   });
// });

$('.datepicker').on('change', function() {
  var string = eraseYoubi($(this).val());
  var isDateOnly = true;
  if (string.split(' ').length == 2) {
    isDateOnly = false;
  }
  var date = new Date(japanToSlash(string));
  if (!isNaN(date)) {
    $(this).val(formatDate(date, isDateOnly));
  }
});

var formatDate = function(date, isDateOnly) {
  var format = isDateOnly ? 'YYYY/MM/DD' : 'YYYY/MM/DD hh:mm';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  return format;
}

var eraseYoubi = function(string) {
  string = string.replace('(', ' ');
  string = string.replace(')', ' ');
  string = string.replace('（', ' ');
  string = string.replace('）', ' ');
  string = string.replace('月', ' ');
  string = string.replace('火', ' ');
  string = string.replace('水', ' ');
  string = string.replace('木', ' ');
  string = string.replace('金', ' ');
  string = string.replace('土', ' ');
  string = string.replace('日', ' ');
  return string.replace(/ +/g, ' ');
}

var japanToSlash = function(string) {
  string = string.replace('年', '/');
  string = string.replace('月', '/');
  string = string.replace('日', '');
  string = string.replace('時', ':');
  string = string.replace('分', '');
  return string;
}

$('#content_url').change(function() {
  console.log($(this).val());
  const target = $(this).val();
  if (!target) {
    return;
  }
  if (isSameUrl(target)) {
    alert('すでに同じURLが存在します');
  }
});

const isSameUrl = function(target) {
  var c = acc.campaigns.filter((c) => {
    if (c.urls && c.urls.length > 0) {
      return c.urls.includes(target);
    }
    return false;
  });
  if (c.length > 0) {
    return true;
  }
  return false;
}

$('input[type="checkbox"]').change(function() {
  if ($(this).is($('input#on_all'))) {
    if ($(this).is(':checked')) {
      $('input[type="checkbox"]').each(function() {
        $(this).prop("checked", false);
      });
      $(this).prop("checked", true);
    }
  } else {
    $('input#on_all').prop("checked", false);
  }
});

$('#create_json').click(function() {
  var data = {};
  var val = $('#content_id').val();
  if (val && val.length > 0) {
    data.id = parseInt(val);
  }
  val = $('#content_service_title').val();
  if (val && val.length > 0) {
    data.service_title = val;
  }
  val = $('#content_title').val();
  if (val && val.length > 0) {
    data.title = val;
  }
  val = $('#content_description').val();
  if (val && val.length > 0) {
    data.description = val;
  }
  val = $('#content_url').val();
  if (val && val.length > 0) {
    if (!data.urls) {
        data.urls = [];
    }
    data.urls.push(val);
  }
  val = $('#content_img').val();
  if (val && val.length > 0) {
    data.img = val;
  }
  val = $('#content_start_date').val();
  if (val && val.length > 0) {
    if (!data.date) {
      data.date = {};
    }
    data.date.start = val;

    val = $('#content_start_time').val();
    if (val && val.length > 0) {
      data.date.start += " " + val;
    }
  }
  val = $('#content_end_date').val();
  if (val && val.length > 0) {
    if (!data.date) {
      data.date = {};
    }
    data.date.end = val;

    val = $('#content_end_time').val();
    if (val && val.length > 0) {
      data.date.end += " " + val;
    }
  }

  $('input[type="checkbox"]').each(function() {
    if ($(this).is(':checked')) {
      if (!data.on) {
        data.on = [];
      }
      data.on.push($(this).val());
    }
  });

  $('#result').addClass('blue-grey lighten-5 clipboard');
  $('#result').css('padding', '50px');
  $('#result').html(JSON.stringify(data, null, 2).replace(/\r?\n/g, '<br>    ').replace(/ /g, '&nbsp;').replace(/$/, ','));
});

window.onload = function() {
  info.getCampaigns(function(campaigns, serviceTitles) {
    acc.campaigns = campaigns;
    var serviceTitlesData = {};
    for (var i = 0; i < serviceTitles.length; i++) {
      serviceTitlesData[serviceTitles[i]] = null;
    }
    $('input#content_service_title').autocomplete({
      data: serviceTitlesData
    });

    var lastId = campaigns[0].id;
    document.getElementById("content_id").value = parseInt(lastId) + 1;

    var urlQuery = info.getUrlQuery();
    if (!urlQuery) {
      return;
    }
    if (urlQuery.title && urlQuery.title.length > 0) {
      document.getElementById("content_title").value = decodeURIComponent(urlQuery.title);
    }
    if (urlQuery.url && urlQuery.url.length > 0) {
      if (isSameUrl(urlQuery.url)) {
        alert('すでに同じURLが存在します');
      }
      document.getElementById("content_url").value = decodeURIComponent(urlQuery.url);
    }
    if (urlQuery.description && urlQuery.description.length > 0) {
      $('#content_description').val(decodeURIComponent(urlQuery.description));
      $('#content_description').trigger('autoresize');
    }
    if (urlQuery.service_title && urlQuery.service_title.length > 0) {
      document.getElementById("content_service_title").value = decodeURIComponent(urlQuery.service_title);
    }
  });
};

new ClipboardJS('.clipboard');

$(".button-collapse").sideNav();

},{"./info":3}]},{},[4]);
