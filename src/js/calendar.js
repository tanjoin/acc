var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');
var HtmlBuilder = require('./html-builder');
var HtmlBuilder2 = require('./html-builder2');

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
  var id;
  var today = new Date();
  switch (today.getDay()) {
      case 0:
          id = "sun";
          break;
      case 1:
          id = "mon";
          break;
      case 2:
          id = "tue";
          break;
      case 3:
          id = "wed";
          break;
      case 4:
          id = "thu";
          break;
      case 5:
          id = "fri";
          break;
      case 6:
          id = "sat";
          break;
  }
  var th = document.getElementById(id);
  th.style.backgroundColor = "#eeeeee";
};

var clearHighlightDay = function() {
  for (var i = 0; i < constants.DAYOFTHEWEEK.length; i++) {
    var th = document.getElementById(constants.DAYOFTHEWEEK[i]);
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
  var serviceTitles = accCalendar.serviceTitles;

  new HtmlBuilder("calendar_body").clean();

  setMonthHeaderText();

  if (today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear()) {
    date = target.getDate();
    setTodaysDay();
    document.getElementById("month_prev").onclick = null;
    document.getElementById("month_next").onclick = nextMonth;
  } else {
    date = 1;
    clearHighlightDay();
    document.getElementById("month_prev").onclick = prevMonth;
    document.getElementById("month_next").onclick = nextMonth;
  }

  var week = getWeek(target);
  var calendarData = getCalendarData(target, date);

  var builder = new HtmlBuilder2("calendar_body");
  builder.appendTr();
  if (calendarData.beginDay - 1 > 0) {
    builder.appendTdInTr(calendarData.beginDay - 1);
  }
  var first = date;
  for (var i = calendarData.beginDay; i <= 7; i++) {
    builder.appendTdInTr(null, date);
    date++;
  }
  var last = date;
  for (var i = 0; i < campaigns.length; i++) {
    var campaign = campaigns[i];
    builder.appendTr("border-style:hidden;");
    if (calendarData.beginDay - 1 > 0) {
      builder.appendTdInTr(calendarData.beginDay - 1, null, "campaign");
    }
    builder.createCampaignBarInTr(campaign, calendarData, first, last, week + "-", serviceTitles);
  }
  week++;
  while(date <= calendarData.end.getDate()) {
    builder.appendTr();
    first = date;
    for (var i = 1; i <= 7; i++) {
      if (date > calendarData.end.getDate()) {
        break;
      }
      builder.appendTdInTr(null, date);
      date++;
    }
    last = date;
    for (var i = 0; i < campaigns.length; i++) {
      builder.createTr("border-style:hidden;");
      campaign = campaigns[i];
      builder.createCampaignBarInTr(campaign, calendarData, first, last, week + "-", serviceTitles);
    }
    week++;
  }
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
