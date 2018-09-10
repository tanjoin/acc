var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var HtmlBuilder = require('./html-builder');
var GCalendar = require('./g_calendar');

var acc = {
  campaigns: [],
  serviceTitles: []
};

/** Campaign をソート */
var sortCampaigns = function(a, b) {
  if (!a.containsInOn(constants.On.ALL) && !b.containsInOn(constants.On.ALL)) {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  }

  if (!a.containsInOn(constants.On.ALL)) {
    return -1;
  }
  if (!b.containsInOn(constants.On.ALL)) {
    return 1;
  }

  /** date が空の場合、エラーになるので仮の Object を追加して応急処置 **/
  if (!a.date) {
    a.date = {};
  }
  if (!b.date) {
    b.date = {};
  }

  var aDate = new Date(Date.parse(a.date.end));
  var bDate = new Date(Date.parse(b.date.end));

  if (isNaN(aDate.getTime()) && isNaN(bDate.getTime())) {
    if (a.id > b.id) {
      return -1;
    }
    if (a.id < b.id) {
      return 1;
    }
    return 0;
  }

  if (isNaN(aDate.getTime())) {
    return 1;
  }
  if (isNaN(bDate.getTime())) {
    return -1;
  }

  if (aDate.getTime() > bDate.getTime()) {
    return 1;
  }

  if (aDate.getTime() < bDate.getTime()) {
    return -1;
  }

  return 0;
};

var hideCampaign = function() {
  var id = this.campaign;
  var count = 0;
  var urlQuery = info.getUrlQuery();
  if (!id) {
    return true;
  }
  var query = "?";

  var serviceTitle = info.getServiceTitle(urlQuery);
  if (serviceTitle && serviceTitle.length > 0) {
    query += "service_title=" + serviceTitle;
  }
  if (query.length > 1) {
    query += "&";
  }
  query += "hide[" + (count++) + "]=" + id;
  var hideId;
  for (var i = 0; i < urlQuery.length; i++) {
    hideId = urlQuery["hide[" + i + "]"];
    if (!hideId) {
      break;
    }
    query += "&hide[" + (count++) + "]=" + hideId;
  }
  history.pushState(null, null, query);
  showContents();
  return false;
};

var bindCardContent = function(cardContent, campaign) {
  var url = "?service_title=" + campaign.serviceTitle;
  var urlOfId = "?id=" + campaign.id;
  new HtmlBuilder(cardContent)
  .a(urlOfId, null, null, () => {
    history.pushState(null, null, urlOfId);
    showDetail(acc.campaigns, campaign.id);
    return false;
  })
  .div("blue-text col s10")
  .text(campaign.id)
  .div("col s2")
  .i("hidebutton material-icons")
  .intercept((icon) => {
    icon.campaign = campaign.id;
    icon.onclick = hideCampaign;
  })
  .text("clear")
  .div("card-title")
  .text(campaign.title)
  .a(url, null, null, () => {
    history.pushState(null, null, url);
    showServiceTitle(acc.campaigns, campaign.serviceTitle);
    $('#modal').modal("close");
    return false;
  })
  .div("chip blue-grey darken-1 amber-text")
  .text(campaign.serviceTitle)
  .then(campaign.hasDayText(), (self) => self.div("grey-text").text(campaign.dayText()))
  .p(campaign.description)
  .build()
  .then(campaign.hasUrl(), (self) => {
    for (var j = 1; j < campaign.urls.length; j++) {
      self.div().a(campaign.urls[j]).text("その" + (j + 1)).build();
    }
  })
  .build();
};

var bindCard = function(card, campaign) {
  new HtmlBuilder(card)
  .then(campaign.hasImage(), (self) => self.div("img").img(campaign.img, "materialboxed"))
  .div("card-content white-text")
  .intercept((cardContent, builder) => bindCardContent(cardContent, campaign))
  .build();
};

var bindView = function(row, campaign) {
  var builder = new HtmlBuilder(row);
  builder.div("col s12 m6 l3");
  if (campaign.urls && campaign.urls.length > 0) {
    builder.a(campaign.urls[0]);
  }
  builder.div("card blue-grey darken-3 z-depth-0")
  builder.intercept((card, builder) => bindCard(card, campaign))
  builder.build();
};

var createModalContent = function(modalContent, campaign) {
  var url = "?service_title=" + campaign.serviceTitle;
  new HtmlBuilder(modalContent)
  .h4()
  .text("[" + campaign.id + "] " + campaign.title)
  .div("chip")
  .a(url, null, null, (e) => {
    history.pushState(null, null, url);
    showServiceTitle(acc.campaigns, campaign.serviceTitle);
    $('#modal').modal("close");
    return false;
  })
  .text(campaign.serviceTitle)
  .p(campaign.dayText())
  .build()
  .p(campaign.description)
  .build();

  for (var i = 0; i < campaign.urls.length; i++) {
    new HtmlBuilder(modalContent)
    .div()
    .a(campaign.urls[i])
    .text("リンク" + (i + 1))
    .build();
  }

  if (campaign.date.start && campaign.date.end) {
    new HtmlBuilder(modalContent)
    .div("col s2")
    .a(GCalendar.makeUrl(campaign))
    .text("Googlecalendarに登録")
    .build();
  }
};

var showDetail = function(campaigns, id) {
  id = parseInt(id);
  var filtered = campaigns.filter((campaign) => campaign.id === id);
  if (filtered && filtered.length > 0) {
    var campaign = filtered[0];
    new HtmlBuilder("modal")
    .clean()
    .div("modal-content")
    .intercept((modalContent) => createModalContent(modalContent, campaign))
    .then(campaign.hasImage(), (self) => self.img(campaign.img, "responsive-img"))
    .build();

    $('#modal').modal();
    $('#modal').modal("open");
  }
};

var showServiceTitle = function(campaigns, serviceTitle) {
  if (!serviceTitle) {
    return;
  }
  document.getElementById("logo").innerText = "Acc : " + serviceTitle;
  campaigns = campaigns.filter((data) => data.serviceTitle === serviceTitle);
  campaigns.sort(sortCampaigns);
  showCampaigns(campaigns);
};

var showCampaigns = function(campaigns) {
  var now = new Date();
  var urlQuery = info.getUrlQuery();
  new HtmlBuilder("contents").clean().div("row").intercept((row) => {
    for (var i = 0; i < campaigns.length; i++) {
      var campaign = campaigns[i];
      if (acc.inverse && acc.inverse === 'true') {
        if (!campaign.isShow(now) && campaign.validateHide(urlQuery)) {
          bindView(row, campaign);
        }
      } else {
        if (campaign.isShow(now) && campaign.validateHide(urlQuery)) {
          bindView(row, campaign);
        }
      }
    }
  }).build();
};

var showContents = function() {
  var urlQuery = info.getUrlQuery();
  var id = info.getId(urlQuery);
  acc.inverse = info.getInverse(urlQuery);
  document.getElementById("logo").innerText = "Acc";
  if (id) {
    showDetail(acc.campaigns, id);
  } else {
    $('#modal').modal("close");
  }
  var serviceTitle = info.getServiceTitle(urlQuery);
  if (serviceTitle) {
    showServiceTitle(acc.campaigns, serviceTitle);
    return;
  }
  // 通常表示
  acc.campaigns.sort(sortCampaigns);
  showCampaigns(acc.campaigns);
};

window.onload = function() {
  info.getCampaigns((campaigns, serviceTitles) => {
    acc.campaigns = campaigns;
    acc.serviceTitles = serviceTitles;
    showContents();
  });
};

window.onpopstate = function(event) {
  if (event.isTrusted) {
    showContents();
  }
};

// Materialize code

$(document).ready(function(){
  $('.materialboxed').materialbox();
});

$(".button-collapse").sideNav();
