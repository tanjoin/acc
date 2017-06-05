export default class UrlUtils {
  static getUrlQuery(window: Window) : {[key : string] : any} {
    let url = window.location.search;
    let hash = url.slice(1).split('&');
    var queries: {[key : string] : string} = {};
    for (var i = 0; i < hash.length; i++) {
      let splitedData = hash[i].split('=');
      queries[splitedData[0]] = splitedData[1];
    }
    return queries;
  }
}
