var info = require('./info');

var accMaker = {};

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

window.onload = function() {
    info.getCampaign(function(campaigns, serviceTitles) {
      $('input#content_service_title').autocomplete({
        data: serviceTitles
      });

      var lastId = campaigns[0].id;
      document.getElementById("content_id").value = parseInt(lastId) + 1;

      var urlQuery = info.getUrlQuery();
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
