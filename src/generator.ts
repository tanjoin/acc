import * as moment from 'moment';
import Campaign from './model/campaign';
import MainRequest from './api/main_request';
import UrlUtils from './util/url_utils';
import Period from './model/period';

export default class Generator {

  // MARK: - Parameters

  private _campaigns: Campaign[];
  private _services: string[];
  private _urls: string[];

  // MARK: - Main methods

  private applyQuery(window: Window) {
    var queries = UrlUtils.getUrlQuery(window);
  }

  private applyAutoSetId(campaigns: Campaign[]) {
    // TODO: 最新のコンテンツのIDを取得する
    if (!campaigns || campaigns.length == 0) {
      return;
    }
    var ids = campaigns.map((campaign) => campaign.id);
    if (ids.length == 0) {
      return;
    }
    ids.sort(function(a: number, b: number) {
      if (b > a) {
        return 1;
      } else if (a > b) {
        return -1;
      } else {
        return 0;
      }
    });
    var contentId = (<HTMLInputElement>document.getElementById('content_id'));
    contentId.value = "" + (ids[0] + 1);
    (<any>contentId.parentNode).MaterialTextfield.checkDirty();
  }

  private static getClipboardText(window: Window) : string {
    var text = '';
    if ((<any>window).clipboardData && (<any>window).clipboardData.getData) {
      text = (<any>window).clipboardData.getData('Text');
    } else if ((<any>event).clipboardData && (<any>event).clipboardData.getData) {
      text = (<any>event).clipboardData.getData('text/plain');
    }
    return text;
  }

  // TODO: 時間表記がないものは 23:59:59 扱いにする
  private static getSplitDateTextData(text: string, id: string) : any {
    var data = {};
    if (text.split('〜').length === 1) {
      if (id === 'content_start') {
        data['start'] = moment(text.split('〜')[0], "YYYYMMDD HH:mm").format("YYYY/MM/DD HH:mm");
      } else {
        data['end'] = moment(text.split('〜')[0], "YYYYMMDD HH:mm").format("YYYY/MM/DD HH:mm");
      }
    } else if (text.split('〜').length === 2) {
      data['start'] = text.split('〜')[0] === "" ? "" : moment(text.split('〜')[0], "YYYYMMDD HH:mm").format("YYYY/MM/DD HH:mm");
      data['end'] = text.split('〜')[1] === "" ? "" : moment(text.split('〜')[1], "YYYYMMDD HH:mm").format("YYYY/MM/DD HH:mm");
    }
    return data;
  }

  private applyValidateUrls(urls) {
    var url = (<HTMLInputElement>document.getElementById('content_url'));
    url.addEventListener('change', function(event) {
      var path = url.value;
      if (urls.indexOf(path) === -1) {
        (<any>url.parentNode).className = url.className.replace(" is-invalid", "");
        return;
      }
      (<any>url.parentNode).className += " is-invalid";
    });
  }

  private applyAutoDate(window: Window) {
    var start = (<HTMLInputElement>document.getElementById('content_start'));
    var end = (<HTMLInputElement>document.getElementById('content_end'));
    start.addEventListener('paste', function(event) {
      (<any>event).preventDefault();
      var text = Generator.getClipboardText(window);
      var data = Generator.getSplitDateTextData(text, this.id);
      if (typeof data['start'] !== 'undefined') {
        start.value = data['start'];
        (<any>start.parentNode).MaterialTextfield.checkDirty();
      }
      if (typeof data['end'] !== 'undefined') {
        end.value = data['end'];
        (<any>end.parentNode).MaterialTextfield.checkDirty();
      }
    });
    end.addEventListener('paste', function(event) {
      (<any>event).preventDefault();
      var text = Generator.getClipboardText(window);
      var data = Generator.getSplitDateTextData(text, this.id);
      if (typeof data['start'] !== 'undefined') {
        start.value = data['start'];
        (<any>start.parentNode).MaterialTextfield.checkDirty();
      }
      if (typeof data['end'] !== 'undefined') {
        end.value = data['end'];
        (<any>end.parentNode).MaterialTextfield.checkDirty();
      }
    });
  }

  private applyCheckBoxSettings() {
    var labels = document.querySelectorAll('label.mdl-checkbox');
    var checkboxes = document.querySelectorAll('input.mdl-checkbox__input');
    for (var i = 0; i < checkboxes.length; i++) {
      var checkbox = checkboxes[i];
      checkbox.addEventListener('change', function(event) {
        if (this.checked) {
          if (this.id === 'checkbox-on__All') {
            Array.from(checkboxes)
              .filter((checkbox, index, array) => checkbox.id !== 'checkbox-on__All')
              .forEach((checkbox, index, array) => {
                  (<HTMLInputElement>checkbox).checked = false;
                  (<any>checkbox.parentNode).MaterialCheckbox.uncheck();
              });
          } else {
            var all = (<any>document.getElementById('checkbox-on__All'));
            all.checked = false;
            all.parentNode.MaterialCheckbox.uncheck();
          }
        }
      });
    }
  }

  private generateJson(event) {
    document.getElementById('result_json').style.visibility = 'visible';
    // TODO: JSON作成
    var campaign = new Campaign();
    campaign.id = parseInt((<HTMLInputElement>document.getElementById('content_id')).value);
    campaign.title = (<HTMLInputElement>document.getElementById('content_title')).value;
    campaign.description = (<HTMLInputElement>document.getElementById('content_description')).value;
    campaign.service = (<HTMLInputElement>document.getElementById('content_service')).value;
    campaign.date = new Period();
    campaign.date.start = (<HTMLInputElement>document.getElementById('content_start')).value;
    campaign.date.end = (<HTMLInputElement>document.getElementById('content_end')).value;
    var url = (<HTMLInputElement>document.getElementById('content_url')).value;
    if (url && url.length > 0) {
      campaign.urls = [url];
    }
    campaign.image_url = (<HTMLInputElement>document.getElementById('content_img')).value;
    var checkboxes = document.querySelectorAll(':checked');
    var on = Array.from(checkboxes).map((checkbox) => checkbox.id.replace("checkbox-on__", ""));
    campaign.on = on;

    console.log(campaign);

    document.getElementById('result_json').innerHTML =
        JSON.stringify(campaign.toJSON(), null, 4).replace(/\r?\n/g, '<br>').replace(/ /g, '&nbsp;');
  }

  private applyCreateJson() {
    var createBtn = document.getElementById('create_btn');
    createBtn.addEventListener('click', this.generateJson);
  }

  private applyAutoResize() {
    var textarea = document.getElementById('content_description');
    textarea.addEventListener('focus', function(event) {
      (<HTMLElement>event.target).style.height = 'auto';
      var height = this.scrollHeight + 'px';
      (<HTMLElement>event.target).style.height = height;
    });
    textarea.addEventListener('blur', function(event) {
      (<HTMLElement>event.target).style.height = 'auto';
      var height = this.scrollHeight + 'px';
      (<HTMLElement>event.target).style.height = height;
    });
    textarea.addEventListener('input', function(event) {
      (<HTMLElement>event.target).style.height = 'auto';
      var height = this.scrollHeight + 'px';
      (<HTMLElement>event.target).style.height = height;
    });
  }

  // MARK: - Event methods

  onload(window: Window) {
    var request = new MainRequest();
    request.getCampaigns((campaigns, services, urls) => {
      this._campaigns = campaigns;
      this._services = services;
      this._urls = urls;
      this.applyAutoSetId(this._campaigns);
      this.applyValidateUrls(this._urls);
    });
    this.applyQuery(window);
    this.applyAutoResize();
    this.applyCreateJson();
    this.applyCheckBoxSettings();
    this.applyAutoDate(window);
  }
}

// ------------------------

window.onload = function() {
  new Generator().onload(window);
};
