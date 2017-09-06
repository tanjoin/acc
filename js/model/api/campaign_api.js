import Campaign from '../campaign';

export default class CampaignApi {
  static get GET_DATA_URL() {
    return "https://tanjo.in/acc/campaign.json";
  }

  // callback - (campaigns: Campaign[]) => void)
  getCampaigns(callback) {
    var request = new XMLHttpRequest();
    request.open('GET', MainRequest.GET_DATA_URL, true);
    request.addEventListener('load', function() {
      var data = JSON.parse(this.responseText);
      var campaigns = data.campaigns.map((data) => Campaign.fromJSON(data));
      if (callback) {
        callback(campaigns);
      }
    });
    request.send(null);
  }
}
