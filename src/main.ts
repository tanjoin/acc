import Campaign from './model/campaign';
import MainRequest from './api/main_request';
import UrlUtils from './util/url_utils';
import CardView from './view/card';

export default class Main {

  // MARK: - Parameters

  private _campaigns: Campaign[];
  private _services: string[];
  private _urls: string[];
  private _isInverse: boolean;
  private _id: number;
  private _targetService: string;

  // MARK: - Main methods

  showContents(window: Window) {
    let urlQuery = UrlUtils.getUrlQuery(window);
    if (urlQuery) {
      this._id = urlQuery.id ? parseInt(decodeURIComponent(urlQuery.id)) : null;
      this._isInverse = urlQuery.inverse ? ('true' === decodeURIComponent(urlQuery.inverse)) : false;
      this._targetService = urlQuery.service ? decodeURIComponent(urlQuery.service) : null;
    }
    this.resetTitle(window.document);
    if (this.hasId()) {

    } else {

    }
    if (this.hasService()) {

    } else {

    }
    this._campaigns.sort(function(a: Campaign, b: Campaign) {
      if (!a.isShow()) {
        return -1;
      }
      if (!b.isShow()) {
        return 1;
      }
      return a.date.compare(b.date);
    });
    this.showCampaigns();
    this.setHideProgressBar();
  }

  private showCampaigns() {
    var contents = document.getElementById('contents');
    var grid = document.createElement('div');
    grid.className = 'mdl-grid';
    contents.appendChild(grid);
    for (var i = 0; i < this._campaigns.length; i++) {
      var cardView = new CardView(this._campaigns[i]);
      grid.appendChild(cardView.render());
    }
  }

  private resetTitle(document: Document) {
    document.getElementById('status').innerText = "";
  }

  private hasId() : boolean {
    return this._id && this._id > 0;
  }

  private hasService() : boolean {
    return this._targetService && this._targetService.length > 0;
  }

  // MARK: - Event methods

  onload(window) {
    var request = new MainRequest();
    request.getCampaigns((campaigns, services, urls) => {
      this._campaigns = campaigns;
      this._services = services;
      this._urls = urls;
      this.showContents(window);
    });
  }

  private setHideProgressBar() {
    document.getElementById('progress_bar').style.display = 'none';
  }
}

// ------------------------

window.onload = function() {
  new Main().onload(window);
}
