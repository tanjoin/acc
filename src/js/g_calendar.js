module.exports.makeUrl = function(content) {
  if (!content) {
    return "";
  }
  var date = getUTC(new Date());
  return "https://www.google.com/calendar/event?action=TEMPLATE" +
    "&text=" + getText(content) +
    "&details=" + getDetails(content) +
    "&dates=" + getUTC(new Date(Date.parse(content.date.start))) + "/" + getUTC(new Date(Date.parse(content.date.end)));
};

var getUTC = function(date) {
  return date.getUTCFullYear() +
    zerofill(date.getUTCMonth()+1) +
    zerofill(date.getUTCDate()) +
    'T' +
    zerofill(date.getUTCHours()) +
    zerofill(date.getUTCMinutes()) +
    zerofill(date.getUTCSeconds()) +
    'Z'
};

var zerofill = function(num) {
  return ('0' + num).slice(-2);
}

var getText = function(content) {
  return encodeURIComponent(
    "【" + content.serviceTitle + "】" + content.title
  );
}

var getDetails = function(content) {
  var details = "";
  for (var i = 0; i < content.urls.length; i++) {
    details += content.urls[i] + "\n";
  }
  details += content.description + "\n";
  details += "https://tanjoin.github.io/acc/?id=" + content.id;
  return encodeURIComponent(details);
}

// var getRecurrence = function(content) {
//   if (content.join(',') === "All") {
//     return "";
//   }
//   var data = ""; // DAILY WEEKLY MONTHLY YEARLY
//   // 毎週N曜日
//   var byDay = content.join(',')
//     .replace('Sun', 'SU')
//     .replace('Mon', 'MO')
//     .replace('Tue', 'TU')
//     .replace('Wed', 'WE')
//     .replace('Thu', 'TH')
//     .replace('Fri', 'FR')
//     .replace('Sat', 'SA');
//   if (byDay && byDay.length > 0) {
//     data += "FREQ=WEEKLY;BYDAY=" + byDay + ";";
//   }
//   // 毎月2,15日
//   var byMonthDay = "FREQ=MONTHLY;BYMONTHDAY=" + content.join(',').replace('th', '');
//   if (byMonthDay) {
//     data += byMonthDay + ";";
//   }
//   var until = "UNTIL=" + getUTC(new Date(Date.parse(content.date.end)));
//   data += until;
//   return data;
// }
