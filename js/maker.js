(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var accMaker = {};
accMaker.serviceTitles = {};

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15 // Creates a dropdown of 15 years to control year
});

$('input[type="checkbox"]').change(function() {
  if ($(this).is($('input#on_all'))) {
    if ($(this).is(':checked')) {
      $('input[type="checkbox"]').each(function(){
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
  if (val != null && val.length > 0) {
    data.id = parseInt(val);
  }
  val = $('#content_service_title').val();
  if (val != null && val.length > 0) {
    data.service_title = val;
  }
  val = $('#content_title').val();
  if (val != null && val.length > 0) {
    data.title = val;
  }
  val = $('#content_description').val();
  if (val != null && val.length > 0) {
    data.description = val;
  }
  val = $('#content_url').val();
  if (val != null && val.length > 0) {
    if (data.urls == null) {
        data.urls = [];
    }
    data.urls.push(val);
  }
  val = $('#content_img').val();
  if (val != null && val.length > 0) {
    data.img = val;
  }
  val = $('#content_start_date').val();
  if (val != null && val.length > 0) {
    if (data.date == null) {
      data.date = {};
    }
    data.date.start = val;

    val = $('#content_start_time').val();
    if (val != null && val.length > 0) {
      data.date.start += " " + val;
    }
  }
  val = $('#content_end_date').val();
  if (val != null && val.length > 0) {
    if (data.date == null) {
      data.date = {};
    }
    data.date.end = val;

    val = $('#content_end_time').val();
    if (val != null && val.length > 0) {
      data.date.end += " " + val;
    }
  }

  $('input[type="checkbox"]').each(function() {
    if ($(this).is(':checked')) {
      if (data.on == null) {
        data.on = [];
      }
      data.on.push($(this).val());
    }
  });

  $('#result').addClass('blue-grey lighten-5 clipboard');
  $('#result').css('padding', '50px');
  $('#result').html(JSON.stringify(data, null, 4).replace(/\r?\n/g, '<br>').replace(/ /g, '&nbsp;'));
});

/** @constructor */
accMaker.CampaignId = function(opt_jsonData) {
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
};

 /** JSON データを Campaign に変換. */
accMaker.convertData = function(responseText) {
    var data = JSON.parse(responseText);
    var campaigns = [];
    for (var i = 0; i < data.campaigns.length; i++) {
        var campaign = new accMaker.CampaignId(data.campaigns[i]);
        campaigns.push(campaign);
        accMaker.serviceTitles[campaign.serviceTitle] = null;
    }
    $('input#content_service_title').autocomplete({
      data: accMaker.serviceTitles
    });
    return campaigns;
};

/** Get URL Query Parameters. */
accMaker.getUrlQuery = function() {
    var url = window.location.search;
    var hash = url.slice(1).split("&");
    var queries = [];
    for (var i = 0; i < hash.length; i++) {
        var splitedData = hash[i].split("=");
        queries.push(splitedData[0]);
        queries[splitedData[0]] = splitedData[1];
    }
    return queries;
};

window.onload = function() {
    accMaker.getCampaign(function() {
      var campaigns = accMaker.convertData(this.responseText);
      var lastId = campaigns[0].id;
      document.getElementById("content_id").value = parseInt(lastId) + 1;

      var urlQuery = accMaker.getUrlQuery();
      if (urlQuery != null && urlQuery.title != null && urlQuery.title.length > 0) {
        document.getElementById("content_title").value = decodeURIComponent(urlQuery.title);
      }
      if (urlQuery != null && urlQuery.url != null && urlQuery.url.length > 0) {
        document.getElementById("content_url").value = decodeURIComponent(urlQuery.url);
      }
    });
};

new Clipboard('.clipboard');

$(".button-collapse").sideNav();

},{}]},{},[1]);
