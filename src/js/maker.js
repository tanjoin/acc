var info = require('./info');

var acc = {
  campaigns: []
};

// $('.datepicker').dblclick(function() {
//   var input = $('.datepicker').pickadate({
//     format: 'yyyy/mm/dd',
//     close: 'OK',
//     selectMonths: true, // Creates a dropdown to control month
//     selectYears: 15 // Creates a dropdown of 15 years to control year
//   });
// });

$('.datepicker').on('change', function() {
  var string = eraseYoubi($(this).val());
  var isDateOnly = true;
  if (string.split(' ').length == 2) {
    isDateOnly = false;
  }
  var date = new Date(japanToSlash(string));
  if (!isNaN(date)) {
    $(this).val(formatDate(date, isDateOnly));
  }
});

var formatDate = function(date, isDateOnly) {
  var format = isDateOnly ? 'YYYY/MM/DD' : 'YYYY/MM/DD hh:mm';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  return format;
}

var eraseYoubi = function(string) {
  string = string.replace('(', ' ');
  string = string.replace(')', ' ');
  string = string.replace('（', ' ');
  string = string.replace('）', ' ');
  string = string.replace('月', ' ');
  string = string.replace('火', ' ');
  string = string.replace('水', ' ');
  string = string.replace('木', ' ');
  string = string.replace('金', ' ');
  string = string.replace('土', ' ');
  string = string.replace('日', ' ');
  return string.replace(/ +/g, ' ');
}

var japanToSlash = function(string) {
  string = string.replace('年', '/');
  string = string.replace('月', '/');
  string = string.replace('日', '');
  string = string.replace('時', ':');
  string = string.replace('分', '');
  return string;
}

$('#content_url').change(function() {
  console.log($(this).val());
  const target = $(this).val();
  if (!target) {
    return;
  }
  if (isSameUrl(target)) {
    alert('すでに同じURLが存在します');
  }
});

const isSameUrl = function(target) {
  var c = acc.campaigns.filter((c) => {
    if (c.urls && c.urls.length > 0) {
      return c.urls.includes(target);
    }
    return false;
  });
  if (c.length > 0) {
    return true;
  }
  return false;
}

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
  $('#result').html(JSON.stringify(data, null, 2).replace(/\r?\n/g, '<br>    ').replace(/ /g, '&nbsp;').replace(/$/, ','));
});

window.onload = function() {
  info.getCampaigns(function(campaigns, serviceTitles) {
    acc.campaigns = campaigns;
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
      if (isSameUrl(urlQuery.url)) {
        alert('すでに同じURLが存在します');
      }
      document.getElementById("content_url").value = decodeURIComponent(urlQuery.url);
    }
    if (urlQuery.description && urlQuery.description.length > 0) {
      $('#content_description').val(decodeURIComponent(urlQuery.description));
      $('#content_description').trigger('autoresize');
    }
    if (urlQuery.service_title && urlQuery.service_title.length > 0) {
      document.getElementById("content_service_title").value = decodeURIComponent(urlQuery.service_title);
    }
  });
};

new ClipboardJS('.clipboard');

$(".button-collapse").sideNav();
