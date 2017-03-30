var Campaign = require('./campaign');
var info = require('./info');
var constants = require('./constants');
var htmler = require('./htmler');

var acc = {};

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

var validateHide = function(campaign, urlQuery) {
  for (var i = 0; i < urlQuery.length; i++) {
      if (campaign.id == urlQuery["hide[" + i + "]"]) {
          return false;
      }
  }
  return true;
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
      var div = htmler.div("img");
      div.appendChild(htmler.img(campaign.img));
      card.appendChild(div);
    }

    var cardContent = htmler.div("card-content white-text");
    cardContent.appendChild(htmler.div("blue-text col s10", null, campaign.id));
    card.appendChild(cardContent);

    var doneIcon = htmler.i("clear");
    doneIcon.className = doneIcon.className + " hidebutton";
    doneIcon.campaign = campaign.id;
    doneIcon.onclick = hideCampaign;
    var div2 = htmler.div("col s2");
    div2.appendChild(doneIcon);
    cardContent.appendChild(div2);
    var div3 = htmler.div("card-title", null, campaign.title);
    cardContent.appendChild(div3);

    var cardServicelink = htmler.a("?service_title=" + campaign.serviceTitle);
    cardServicelink.onclick = function() {
      history.pushState(null, null, "?service_title=" + campaign.serviceTitle);
      showServiceTitle(acc.campaigns, campaign.serviceTitle);
      $('#modal').modal("close");
      return false;
    };
    cardServicelink.appendChild(htmler.div("chip blue-grey darken-1 amber-text", null, campaign.serviceTitle));
    cardContent.appendChild(cardServicelink);

    var div4 = htmler.div("grey-text", null, campaign.dayText());
    if (div4.innerText && div4.innerText.length > 0) {
      cardContent.appendChild(div4);
    }
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
  id = parseInt(id);
  var filtered = campaigns.filter((campaign) => campaign.id === id);
  if (filtered && filtered.length > 0) {
    var modalContent = htmler.div("modal-content");
    var target = filtered[0];
    if (target.img && target.img.length > 0) {
      modalContent.appendChild(htmler.img(target.img, null, null, "responsive-img"));
    }
    modalContent.appendChild(htmler.h4("[" + target.id + "] " + target.title));
    var chip = htmler.div("chip");
    var a = htmler.a("?service_title=" + target.serviceTitle, target.serviceTitle);
    a.onclick = function() {
      history.pushState(null, null, "?service_title=" + target.serviceTitle);
      showServiceTitle(campaigns, target.serviceTitle);
      $('#modal').modal("close");
      return false;
    };
    chip.appendChild(a);
    modalContent.appendChild(chip);
    modalContent.appendChild(htmler.p(null, null, target.dayText()));
    modalContent.appendChild(htmler.p(null, null, target.description));
    for (var i = 0; i < target.length; i++) {
      var div = htmler.div();
      div.appendChild(htmler.a(target.urls[i], "リンク" + i));
      modalContent.appendChild(div);
    }
    var modal = document.getElementById("modal");
    while (modal.firstChild) {
      modal.removeChild(modal.firstChild);
    }
    modal.appendChild(modalContent);
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
  var row = htmler.div("row");
  var urlQuery = info.getUrlQuery();
  var contents = document.getElementById("contents");
  while (contents.firstChild) {
    contents.removeChild(contents.firstChild);
  }
  contents.appendChild(row);

  for (var i = 0; i < campaigns.length; i++) {
    var campaign = campaigns[i];
    var isShow = campaign.isShow(now);
    isShow = isShow && validateHide(campaign, urlQuery);
    if (isShow) {
      acc.bindView(row, campaign);
    }
  }
};

var showContents = function() {
  var urlQuery = info.getUrlQuery();
  var id = info.getId(urlQuery);
  document.getElementById("logo").innerText = "Acc";
  if (id) {
    showDetail(acc.campaigns, id);
    return;
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
  info.getCampaigns(function(campaigns, serviceTitles) {
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
