import Campaign from '../model/campaign';

export class MainRequest {
  getCampaigns(callback: (campaigns: Campaign[], services: string[], urls: string[]) => void) {
    var request = new XMLHttpRequest();
    request.open('GET', MainRequest.GET_DATA_URL, true);
    request.addEventListener('load', function() {
      var data = JSON.parse(this.responseText);
      var campaigns = data.campaigns.map((data) => Campaign.fromJSON(data));
      var services = campaigns.map((c) => c.service)
        .filter((x, i, self) => self.indexOf(x) === i);
      var urls = campaigns.map((c) => c.urls)
        .filter((x, i, self) => x != null)
        .reduce((prev, current, i, array) => prev.concat(current))
        .filter((x, i, self) => self.indexOf(x) === i);
      if (callback) {
        callback(campaigns, services, urls);
      }
    });
    request.send(null);
  }
}

export namespace MainRequest {
  export const GET_DATA_URL = "https://tanjo.in/acc/campaign.json";
}

export default MainRequest;
