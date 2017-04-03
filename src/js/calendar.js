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
