var info = require('./info');

$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15 // Creates a dropdown of 15 years to control year
});

$('input[type="checkbox"]').change(function() {
  if ($(this).is($('input#on_all'))) {
    if ($(this).is(':checked')) {
      $('input[type="checkbox"]').each(function() {
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
  if (val && val.length > 0) {
    data.id = parseInt(val);
  }
  val = $('#content_service_title').val();
  if (val && val.length > 0) {
    data.service_title = val;
  }
  val = $('#content_title').val();
  if (val && val.length > 0) {
    data.title = val;
  }
  val = $('#content_description').val();
  if (val && val.length > 0) {
    data.description = val;
  }
  val = $('#content_url').val();
  if (val && val.length > 0) {
    if (!data.urls) {
        data.urls = [];
    }
    data.urls.push(val);
  }
  val = $('#content_img').val();
  if (val && val.length > 0) {
    data.img = val;
  }
  val = $('#content_start_date').val();
  if (val && val.length > 0) {
    if (!data.date) {
      data.date = {};
    }
    data.date.start = val;

    val = $('#content_start_time').val();
    if (val && val.length > 0) {
      data.date.start += " " + val;
    }
  }
  val = $('#content_end_date').val();
  if (val && val.length > 0) {
    if (!data.date) {
      data.date = {};
    }
    data.date.end = val;

    val = $('#content_end_time').val();
    if (val && val.length > 0) {
      data.date.end += " " + val;
    }
  }

  $('input[type="checkbox"]').each(function() {
    if ($(this).is(':checked')) {
      if (!data.on) {
        data.on = [];
      }
      data.on.push($(this).val());
    }
  });

  $('#result').addClass('blue-grey lighten-5 clipboard');
  $('#result').css('padding', '50px');
  $('#result').html(JSON.stringify(data, null, 4).replace(/\r?\n/g, '<br>').replace(/ /g, '&nbsp;'));
});

window.onload = function() {
  info.getCampaigns(function(campaigns, serviceTitles) {
    console.log(serviceTitles);
    var serviceTitlesData = {};
    for (var i = 0; i < serviceTitles.length; i++) {
      serviceTitlesData[serviceTitles[i]] = null;
    }
    $('input#content_service_title').autocomplete({
      data: serviceTitlesData
    });

    var lastId = campaigns[0].id;
    document.getElementById("content_id").value = parseInt(lastId) + 1;

    var urlQuery = info.getUrlQuery();
    if (!urlQuery) {
      return;
    }
    if (urlQuery.title && urlQuery.title.length > 0) {
      document.getElementById("content_title").value = decodeURIComponent(urlQuery.title);
    }
    if (urlQuery.url && urlQuery.url.length > 0) {
      document.getElementById("content_url").value = decodeURIComponent(urlQuery.url);
    }
    if (urlQuery.description && urlQuery.description.length > 0) {
      document.getElementById("content_description").value = decodeURIComponent(urlQuery.description);
    }
    if (urlQuery.service_title && urlQuery.service_title.length > 0) {
      document.getElementById("content_service_title").value = decodeURIComponent(urlQuery.service_title);
    }
  });
};

new Clipboard('.clipboard');

$(".button-collapse").sideNav();
