import * as moment from 'moment';

export default class Generator {

  onload(window: Window) {
    this.applyAutoSetId();
    this.applyAutoResize();
    this.applyCreateJson();
    this.applyCheckBoxSettings();
    this.applyAutoDate(window);
  }

  private applyAutoSetId() {
    // TODO: 最新のコンテンツのIDを取得する
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

  private applyAutoDate(window: Window) {
    var start = (<HTMLInputElement>document.getElementById('content_start'));
    var end = (<HTMLInputElement>document.getElementById('content_end'));
    start.addEventListener('paste', function(event) {
      (<any>event).preventDefault();
      var text = Generator.getClipboardText(window);
      var data = Generator.getSplitDateTextData(text, this.id);
      if (typeof data['start'] !== 'undefined') {
        start.value = data['start'];
      }
      if (typeof data['end'] !== 'undefined') {
        end.value = data['end'];
      }
    });
    end.addEventListener('paste', function(event) {
      (<any>event).preventDefault();
      var text = Generator.getClipboardText(window);
      var data = Generator.getSplitDateTextData(text, this.id);
      if (typeof data['start'] !== 'undefined') {
        start.value = data['start'];
      }
      if (typeof data['end'] !== 'undefined') {
        end.value = data['end'];
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
          if (this.id === 'checkbox-on__all') {
            Array.from(checkboxes)
              .filter((checkbox, index, array) => checkbox.id !== 'checkbox-on__all')
              .forEach((checkbox, index, array) => (<HTMLInputElement>checkbox).checked = false);
            Array.from(labels)
              .filter((label, index, array) => (<any>label).getAttribute('for') !== 'checkbox-on__all')
              .forEach((label, index, array) => (<any>label).MaterialCheckbox.uncheck());
          } else {
            (<any>document.getElementById('checkbox-on__all')).checked = false;
            (<any>document.querySelector('label[for=checkbox-on__all]')).MaterialCheckbox.uncheck();
          }
        }
      });
    }
  }

  private generateJson(event) {
    document.getElementById('result_json').style.visibility = 'visible';
    // TODO: JSON作成
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
}

window.onload = function() {
  new Generator().onload(window);
};
