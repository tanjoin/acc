var accCalendar = {};

accCalendar.serviceTitles = [];

accCalendar.colors = [
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
  "blue-grey",
];

/** @enum {Object} */
accCalendar.On = {
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

/** @constructor */
accCalendar.Campaign = function(opt_jsonData) {
    /**
     * JSON 文字列を parse したもの.
     * @type {Object|undefined}
     * @private
     */
    if (opt_jsonData == null) {
        return;
    }
    this.id = opt_jsonData.id;
    this.serviceTitle = opt_jsonData.service_title;
    this.title = opt_jsonData.title;
    this.urls = opt_jsonData.urls;
    this.date = opt_jsonData.date;
    this.on = opt_jsonData.on;
};

/** @private */
accCalendar.Campaign.prototype.containsInOn = function(on) {
    return this.on != null && this.on.indexOf(on) != -1;
};

/** @private */
accCalendar.Campaign.prototype.validateOn_ = function(now) {
    if (this.on == null) {
        return false;
    }
    if (this.containsInOn(accCalendar.On.ALL) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.SUN) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.MON) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.TUE) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.WED) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.THU) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.FRI) ||
        this.validateOnForDay_(now, accCalendar.On.DAY.SAT) ||
        this.validateOnForDate_(now, accCalendar.On.DATE.D_05) ||
        this.validateOnForDate_(now, accCalendar.On.DATE.D_10) ||
        this.validateOnForDate_(now, accCalendar.On.DATE.D_15) ||
        this.validateOnForDate_(now, accCalendar.On.DATE.D_20) ||
        this.validateOnForDate_(now, accCalendar.On.DATE.D_25) ||
        this.validateOnForDate_(now, accCalendar.On.DATE.D_30)) {
        return true;
    }
    return false;
};

/** @private */
accCalendar.Campaign.prototype.validateOnForDay_ = function(now, onDay) {
    return now.getDay() == onDay.day && this.containsInOn(onDay.text);
};

/** @private */
accCalendar.Campaign.prototype.validateOnForDate_ = function(now, onDate) {
    return now.getDate() == onDate.date && this.containsInOn(onDate.text);
};

/** キャンペーン情報を取得する. */
accCalendar.getCampaign = function(callback) {
    var request = new XMLHttpRequest();
    request.open("GET", "https://tanjo.in/acc/campaign.json", true);
    request.onload = callback;
    request.send(null);
};

/** JSON データを Campaign に変換. */
accCalendar.convertData = function(responseText) {
    var data = JSON.parse(responseText);
    var campaigns = [];
    accCalendar.serviceTitles = [];
    for (var i = 0; i < data.campaigns.length; i++) {
        var campaign = new accCalendar.Campaign(data.campaigns[i]);
        campaigns.push(campaign);
        accCalendar.serviceTitles.push(campaign.serviceTitle);
    }
    return campaigns;
};

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
    var h1 = document.createElement("h1");
    h1.id = "month_header";
    h1.innerText = target.getFullYear() + "年" + (target.getMonth() + 1) + "月";
    var monthHeader = document.getElementById("month_header");
    if (monthHeader != null) {
        monthHeader.parentNode.replaceChild(h1, monthHeader);
    } else {
        document.getElementById("month_area").appendChild(h1);
    }
};

accCalendar.appendTr = function(opt_style) {
    var tr = accCalendar.createTr(opt_style);
    document.getElementById("calendar_body").appendChild(tr);
    return tr;
}

accCalendar.createTr = function(opt_style) {
    var tr = document.createElement("tr");
    if (opt_style != null) {
        tr.setAttribute("style", opt_style);
    }
    return tr;
}

accCalendar.appendTd = function(tr, opt_colspan, opt_text, opt_class, opt_id) {
    var td = document.createElement("td");
    if (opt_colspan != null) {
        td.setAttribute("colspan", opt_colspan);
    }
    if (opt_text != null) {
        td.innerText = opt_text;
    }
    if (opt_class != null) {
        td.setAttribute("class", opt_class);
    }
    if (opt_id != null) {
        td.setAttribute("id", opt_id);
    }
    tr.appendChild(td);
    return td;
}

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
    var campaignEnd = new Date(Date.parse(campaign.date.end));
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
                td = document.createElement("td");
                td.setAttribute("class", "campaign");
                td.colSpan = 1;
            }
            isEmpty = true;
        } else {
            if (isEmpty || td == null) {
                if (td != null) {
                    tr.appendChild(td);
                }
                td = document.createElement("td");
                var title = "【" + campaign.serviceTitle + "】" + campaign.title;
                if (campaign.urls != null && campaign.urls.length > 0) {
                  var a = document.createElement("a");
                  a.href = campaign.urls[0];
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

    var tbody = document.createElement("tbody");
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

        tr = accCalendar.appendTr("border-style:hidden;");
        
        if (calendarData.beginDay - 1 > 0) {
          accCalendar.appendTd(tr, calendarData.beginDay - 1, null, "campaign");
        }
      
        accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
    }
    week++;

    var endDate = new Date(calendarData.end.getDate());
    endDate.setDate(endDate.getDate() + 1);
    while (date < endDate) {
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
            tr = accCalendar.createTr("border-style:hidden;");
            campaign = campaigns[i];
            accCalendar.createCampaignBar(tr, campaign, calendarData, first, last, week + "-");
        }
        week++;
    }
};

accCalendar.getThemeColorClass = function(seed) {
  return accCalendar.colors[seed % accCalendar.colors.length];
};

window.onload = function() {
    accCalendar.getCampaign(function() {
        accCalendar.campaigns = accCalendar.convertData(this.responseText);
        accCalendar.target = new Date();
        accCalendar.target.setMonth(accCalendar.target.getMonth());
        accCalendar.makeCalendar(accCalendar.campaigns);
    });
};
