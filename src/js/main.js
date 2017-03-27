var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');

var acc = {};

/** @enum {string} */
acc.ViewType = {
    ALL: "all",
    SERVICE_TITLE: "service_title",
    CATEGORY: "category"
};

/** ViewType を選別 */
acc.getViewType = function(urlQuery) {
    if (urlQuery.service_title != null) {
        return acc.ViewType.SERVICE_TITLE;
    }
    if (urlQuery.category != null) {
        return acc.ViewTYpe.CATEGORY;
    }
    return acc.ViewType.ALL;
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

/** service_title が一致するかどうか */
acc.validateServiceTitle = function(campaign, serviceTitle) {
    if (campaign != null && campaign.serviceTitle == serviceTitle) {
        return true;
    }
    return false;
};

acc.hideCampaign = function() {
  var id = this.campaignId;
  var count = 0;
  var urlQuery = info.getUrlQuery();
  if (id == null) {
    return true;
  }
  var url = window.location.origin + window.location.pathname + "?";

  var serviceTitle = info.getServiceTitle(urlQuery);
  if (serviceTitle != null && serviceTitle.length > 0) {
    url = url + "service_title=" + serviceTitle + "&";
  }
  url = url + "hide[" + count + "]=" + id;
  count = count + 1;
  for (var i = 0; i < urlQuery.length; i++) {
      var hideId = urlQuery["hide[" + i + "]"];
      if (null == hideId) {
        break;
      }
      url = url + "&hide[" + count + "]=" + hideId;
      count = count + 1;
  }
  document.location = url;
  return false;
};

acc.validateHide = function(campaign, urlQuery) {
    for (var i = 0; i < urlQuery.length; i++) {
        if (campaign.id == urlQuery["hide[" + i + "]"]) {
            return false;
        }
    }
    return true;
}

acc.insertDiv = function(content, className, opt_innerText, opt_appendChild, opt_isEnableNullOrEmpty) {
    var div = htmler.div(className);
    if (opt_innerText != null) {
        div.innerText = opt_innerText;
    }
    if (opt_appendChild != null) {
        div.appendChild(opt_appendChild);
    }
    if (opt_isEnableNullOrEmpty == null || opt_isEnableNullOrEmpty == false) {
        content.appendChild(div);
    } else {
        if (opt_innerText != null && opt_innerText.length > 0) {
            content.appendChild(div);
        }
    }
    return div;
};

acc.bindView = function(row, campaign) {
    var col = htmler.div("col s12 m6 l3");
    row.appendChild(col);

    var card;
    if (campaign.hasUrl()) {
        var cardLink = htmler.a(campaign.urls[0]);
        card = htmler.div("card blue-grey darken-3 z-depth-0");
        cardLink.appendChild(card);
        col.appendChild(cardLink);
    } else {
        card = htmler.div("card blue-grey darken-3 z-depth-0");
        col.appendChild(card);
    }

    if (campaign.hasImage()) {
        acc.insertDiv(card, "img", null, htmler.img(campaign.img));
    }

    var cardContent = acc.insertDiv(card, "card-content white-text");
    acc.insertDiv(cardContent, "blue-text col s10", campaign.id);
    var doneIcon = htmler.i("clear");
    doneIcon.className = doneIcon.className + " hidebutton";
    doneIcon.campaignId = campaign.id;
    doneIcon.onclick = acc.hideCampaign;
    acc.insertDiv(cardContent, "col s2", null, doneIcon);
    acc.insertDiv(cardContent, "card-title", campaign.title);

    var cardServicelink = htmler.a("/acc/?service_title=" + campaign.serviceTitle);
    acc.insertDiv(cardServicelink, "chip blue-grey darken-1 amber-text", campaign.serviceTitle);
    cardContent.appendChild(cardServicelink);

    acc.insertDiv(cardContent, "grey-text", campaign.dayText(), null, true);

    var description = htmler.p();
    description.innerText = campaign.description;
    cardContent.appendChild(description);

    if (campaign.hasUrl()) {
      for (var j = 1; j < campaign.urls.length; j++) {
          var div = htmler.div();
          var a = htmler.a(campaign.urls[j]);
          a.innerText = "その" + (j + 1);
          div.appendChild(a);
          cardContent.appendChild(div);
      }
    }
};

var showDetail = function(campaigns, id) {
  // TODO: ID
};

window.onload = function() {
  var urlQuery = info.getUrlQuery();

  var viewType = acc.getViewType(urlQuery);

  info.getCampaign(function(campaigns, serviceTitles) {
    var now = new Date();
    var id = info.getId(urlQuery);
    if (id) {
      showDetail(campaigns, id);
      return;
    }
    var serviceTitle = info.getServiceTitle(urlQuery);
    if (serviceTitle) {
      campaigns = campaigns
          .filter((data) => data.serviceTitle === serviceTitle);
    }
    campaigns.sort(sortCampaigns);

    var row = htmler.div("row");
    document.getElementById("contents").appendChild(row);

    // TODO: check
    for (var i = 0; i < campaigns.length; i++) {
      var campaign = campaigns[i];
      var isShow = campaign.isShow(now);
      isShow = isShow && acc.validateHide(campaign, urlQuery);
      if (viewType == acc.ViewType.SERVICE_TITLE) {
        isShow = isShow && acc.validateServiceTitle(serviceTitle);
      }
      if (isShow) {
        acc.bindView(row, campaign);
      }
    }
  });
};

// Materialize code

$(document).ready(function(){
    $('.materialboxed').materialbox();
});

$(".button-collapse").sideNav();
