/** @constructor */
var HtmlBuilder2 = function(element) {
  if (typeof element === "string") {
    this.element = document.getElementById(element);
  } else if (typeof element === "object") {
    this.element = element;
  }
  this.paragraph = [];
};

HtmlBuilder2.prototype = {
  appendTr: function(opt_style) {
    this.createTr(opt_style);
    this.element.appendChild(this.tr);
    return this.tr;
  },
  createTr: function(opt_style) {
    this.tr = document.createElement("tr");
    if (opt_style != null) {
      this.tr.setAttribute("style", opt_style);
    }
    return this.tr;
  },
  appendTdInTr: function(opt_colspan, opt_text, opt_class, opt_id) {
    this.td = document.createElement('td');
    if (opt_colspan != null) {
        this.td.setAttribute("colspan", opt_colspan);
    }
    if (opt_text != null) {
        this.td.innerText = opt_text;
    }
    if (opt_class != null) {
        this.td.setAttribute("class", opt_class);
    }
    if (opt_id != null) {
        this.td.setAttribute("id", opt_id);
    }
    this.tr.appendChild(this.td);
    return this.td;
  },
  createCampaignBarInTr: function(campaign, calendarData, first, last, idPrefix, serviceTitles) {
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
            this.tr.appendChild(td);
          }
          td = document.createElement("td");
          td.setAttribute("class", "campaign");
          td.colSpan = 1;
        }
        isEmpty = true;
      } else {
        if (isEmpty || td == null) {
          if (td != null) {
            this.tr.appendChild(td);
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
          td.setAttribute("class", "campaign " + this.getThemeColorClass(serviceTitles.indexOf(campaign.serviceTitle)) + " lighten-4");
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
      this.tr.appendChild(td);
    }
    this.element.appendChild(this.tr);
    return this;
  },
  getThemeColorClass: function(seed) {
    return this.colors[seed % this.colors.length];
  },
  colors: [
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
    ]
};

module.exports = HtmlBuilder2;
