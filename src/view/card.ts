import Campaign from '../model/campaign';

export default class Card {

  private view: HTMLDivElement;

  render() : HTMLDivElement {
    this.view = this.renderContainer();
    this.view.appendChild(this.renderTitle());
    this.view.appendChild(this.renderSupportingText());
    this.view.appendChild(this.renderMenu());
    return this.view;
  }

  private renderContainer() : HTMLDivElement {
    var div = document.createElement('div');
    div.className = 'mdl-card mdl-shadow--2dp acc-card mdl-cell mdl-cell--4-col';
    div.id = "" + this.campaign.id;
    return div;
  }

  private renderTitle() : HTMLDivElement {
    var div = document.createElement('div');
    div.className = 'mdl-card__title';
    var h2 = document.createElement('h2');
    h2.className = 'mdl-card__title-text';
    h2.innerText = this.campaign.title;
    div.appendChild(h2);
    return div;
  }

  private renderSupportingText() : HTMLDivElement {
    var div = document.createElement('div');
    div.className = 'mdl-card__supporting-text';
    div.appendChild(this.renderButton('https://tanjo.in/acc/?service=' + this.campaign.service));
    div.appendChild(this.renderPeriodText());
    div.appendChild(this.renderDescription());
    for (var i = 0; i < this.campaign.urls.length; i++) {
      div.appendChild(this.renderWebsite(i));
    }
    return div;
  }

  private renderWebsite(index: number) : HTMLDivElement {
    var div = document.createElement('div');
    var a = document.createElement('a');
    a.href = this.campaign.urls[index];
    a.title = this.campaign.urls[index];
    a.innerText = "Webサイト";
    a.id = 'link-' + this.campaign.id + '-' + index;
    div.appendChild(a);
    return div;
  }

  private renderDescription() : HTMLParagraphElement {
    var p = document.createElement('p');
    p.innerText = this.campaign.description;
    return p;
  }

  private renderPeriodText() : HTMLParagraphElement {
    var p = document.createElement('p');
    p.innerText = this.campaign.date.getPeriodText();
    return p;
  }

  private renderButton(url: string) : HTMLAnchorElement {
    var a = document.createElement('a');
    a.className = 'mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect';
    a.innerText = this.campaign.service;
    a.href = url;
    return a;
  }

  private renderMenu() : HTMLDivElement {
    var div = document.createElement('div');
    div.className = 'mdl-card__menu';
    var button = document.createElement('button');
    button.className = 'mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect';
    button.addEventListener('click', function() {
      const args = [...arguments], [parentView] = args;
      parentView.style.display = 'none';
    }.bind(this, this.view), false);
    var i = document.createElement('i');
    i.className = 'material-icons';
    i.innerText = 'close';
    button.appendChild(i);
    div.appendChild(button);
    return div;
  }

  constructor(private campaign: Campaign) {

  }
}
