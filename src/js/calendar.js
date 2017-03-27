var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');

var accCalendar = {};

accCalendar.serviceTitles = [];

/** 月初 **/
accCalendar.getBeginningOfMonth = function(target, num) {
    var date = new Date(target.getTime());
    if (num != null) {
        date.setDate(num);
    } else {
        date.setDate(1);
    }
    return date;
};

/** 月末 **/
accCalendar.getEndOfMonth = function(target) {
    var date = new Date(target.getTime());
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    return date;
};

/** 曜日の位置を取得する **/
accCalendar.getIndexOfDay = function(date) {
    var day = date.getDay();
    if (day == 0) {
        return 7;
    }
    return day;
}

/** カレンダーの生成に必要な情報を取得 **/
accCalendar.getCalendarData = function(target, num) {
    var begin = accCalendar.getBeginningOfMonth(target, num);
    var end = accCalendar.getEndOfMonth(target);
    return {
        "begin": begin,
        "end": end,
        "beginDay": accCalendar.getIndexOfDay(begin),
        "endDay": accCalendar.getIndexOfDay(end)
    };
}

/** 今日の曜日を強調する **/
accCalendar.setTodaysDay = function() {
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

accCalendar.clearHighlightDay = function() {
    var list = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    for (var i = 0; i < list.length; i++) {
        var th = document.getElementById(list[i]);
        th.style.backgroundColor = "";
    }
};

accCalendar.setMonthHeaderText = function() {
    var target = accCalendar.target;
    var h1 = htmler.h1(target.getFullYear() + "年" + (target.getMonth() + 1) + "月", null, "month_header");
    var monthHeader = document.getElementById("month_header");
    if (monthHeader) {
        monthHeader.parentNode.replaceChild(h1, monthHeader);
    } else {
        document.getElementById("month_area").appendChild(h1);
    }
};

accCalendar.appendTr = function(opt_style) {
    var tr = htmler.tr(opt_style);
    document.getElementById("calendar_body").appendChild(tr);
    return tr;
};

accCalendar.appendTd = function(tr, opt_colspan, opt_text, opt_className, opt_id) {
    var td = htmler.td(opt_colspan, opt_className, opt_id);
    if (opt_text) {
      td.innerText = opt_text;
    }
    tr.appendChild(td);
    return td;
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
    accCalendar.makeCalendar(accCalendar.campaigns);
};

accCalendar.prev = function() {
    accCalendar.target.setMonth(accCalendar.target.getMonth() - 1);
    accCalendar.makeCalendar(accCalendar.campaigns);
};

/** カレンダー作成 **/
accCalendar.makeCalendar = function(campaigns) {
    var tr, td, date, week, i, campaign, first, last, result;

    var target = accCalendar.target;
    var today = new Date();

    var tbody = htmler.tbody();
    tbody.id = "calendar_body";
    var oldtbody = document.getElementById("calendar_body");
    oldtbody.parentNode.replaceChild(tbody, oldtbody);

    accCalendar.setMonthHeaderText();

    if (today.getMonth() == target.getMonth() && today.getFullYear() == target.getFullYear()) {
        date = accCalendar.target.getDate();
        accCalendar.setTodaysDay();
        document.getElementById("month_prev").onclick = null;
        document.getElementById("month_next").onclick = accCalendar.next;
    } else {
        date = 1;
        accCalendar.clearHighlightDay();
        document.getElementById("month_prev").onclick = accCalendar.prev;
        document.getElementById("month_next").onclick = accCalendar.next;
    }

    week = accCalendar.getWeek(target);
    var calendarData = accCalendar.getCalendarData(target, date);

    tr = accCalendar.appendTr();

    if (calendarData.beginDay - 1 > 0) {
      accCalendar.appendTd(tr, calendarData.beginDay - 1);
    }

    first = date;
    for (i = calendarData.beginDay; i <= 7; i++) {
        accCalendar.appendTd(tr, null, date);
        date++;
    }
    last = date;

    for (i = 0; i < campaigns.length; i++) {
        campaign = campaigns[i];

        tr = accCalendar.appendTr("borderhidden");

        if (calendarData.beginDay - 1 > 0) {
          accCalendar.appendTd(tr, calendarData.beginDay - 1, null, "campaign");
        }

        accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
    }
    week++;

    while (date <= calendarData.end.getDate()) {
        tr = accCalendar.appendTr();

        first = date;
        for (var i = 1; i <= 7; i++) {
            if (date > calendarData.end.getDate()) {
                break;
            }
            accCalendar.appendTd(tr, null, date);
            date++;
        }
        last = date;

        for (var i = 0; i < campaigns.length; i++) {
            tr = htmler.tr("borderhidden");
            campaign = campaigns[i];
            accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
        }
        week++;
    }
};

accCalendar.getThemeColorClass = function(seed) {
  return constants.Colors[seed % constants.Colors.length];
};

window.onload = function() {
    info.getCampaign(function(campaigns, serviceTitles) {
        accCalendar.campaigns = campaigns;
        accCalendar.serviceTitles = serviceTitles;
        accCalendar.target = new Date();
        accCalendar.target.setMonth(accCalendar.target.getMonth());
        accCalendar.makeCalendar(accCalendar.campaigns);
    });
};
