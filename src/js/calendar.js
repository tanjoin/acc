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
    new HtmlBuilder(["sun", "mon", "tue", "wed", "thu", "fri", "sat"][today.getDay()])
    .intercept((th) => th.style.backgroundColor = "#eeeeee")
    .build();
};

var clearHighlightDay = function() {
    var list = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    for (var i = 0; i < list.length; i++) {
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
  makeCalendar();
};

accCalendar.prev = function() {
  accCalendar.target.setMonth(accCalendar.target.getMonth() - 1);
  makeCalendar();
};

/** カレンダー作成 **/
var makeCalendar = function() {
  var campaigns = accCalendar.campaigns;
  var target = accCalendar.target;
  var today = new Date();

  var tr, td, date, week, i, campaign, first, last, result;

  new HtmlBuilder("calendar_body").clean();

  setMonthHeaderText();

    if (today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear()) {
        date = target.getDate();
        setTodaysDay();
        document.getElementById("month_prev").onclick = null;
        document.getElementById("month_next").onclick = accCalendar.next;
    } else {
        date = 1;
        clearHighlightDay();
        document.getElementById("month_prev").onclick = accCalendar.prev;
        document.getElementById("month_next").onclick = accCalendar.next;
    }

    week = accCalendar.getWeek(target);
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
          .then(opt_text, (self) => self.intercept((td) => td.innerText = date))
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
            accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
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
              accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
          }
        })
        .build();
        week++;
      }
    })
    .build();
};

accCalendar.getThemeColorClass = function(seed) {
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
