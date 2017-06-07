import Period from './period';
import Day from './day';

export default class Campaign {

  // MARK: - Parameters

  id: number;
  title: string;
  service: string;
  date: Period;
  on: string[];
  urls: string[];
  image_url: string;
  description: string;

  // MARK: - Campaign methods

  hasUrls() : boolean {
    return this.urls && this.urls.length > 0;
  }

  hasIamge() : boolean {
    return this.image_url && this.image_url.length > 0;
  }

  isShow() : boolean {
    return this.date.isShow() && this.isOnTheDay();
  }

  // 特定の日かどうかをチェックする
  isOnTheDay() : boolean {
    let now = new Date();
    let day = Day.toDay(now);
    if (this.on && this.on.indexOf('All') != -1) {
      return true;
    }
    if (this.on && this.on.indexOf(day) != -1) {
      return true;
    }
    let dateString = now.getDate() + "th";
    if (this.on && this.on.indexOf(dateString) != -1) {
      return true;
    }
    return false;
  }

  // MARK: - Methods involved JSON

  toJSON() : any {
    return Object.assign({}, this, {
      image_url: undefined,
      img: this.image_url,
      date: this.date.toJSON(),
      service_title: this.service,
      service: undefined
    });
  }

  static fromJSON(json: string) : Campaign {
    var jsonData;
    if (typeof json === 'string') {
      jsonData = JSON.parse(json);
    } else {
      jsonData = json;
    }
    return Object.assign(new Campaign(), jsonData, {
      img: undefined,
      image_url: jsonData.img,
      date: Period.fromJSON(jsonData),
      service: jsonData.service_title,
      service_title: undefined
    });
  }
}
