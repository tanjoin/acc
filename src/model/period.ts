import * as moment from 'moment';

export default class Period {
  start: string;
  end: string;

  // MARK: - Getter & Setter

  getStartText() : string {
    return this.getStartMoment().format("YYYY/MM/DD HH:mm:ss");
  }

  getStartMoment() : moment.Moment {
    return moment(this.start, "YYYYMMDD HH:mm:ss");
  }

  getEndText() : string {
    return this.getEndMoment().format("YYYY/MM/DD HH:mm:ss");
  }

  getEndMoment() : moment.Moment {
    return moment(this.end, "YYYYMMDD HH:mm:ss");
  }

  getPeriodText() : string {
    return this.getStartText() + "〜" + this.getEndText();
  }

  // MARK: - Period methods

  compare(period: Period) : number {
    return this.getEndMoment().diff(period.getEndMoment(), "minute");
  }

  isShow() : boolean {
    let startResult = moment().diff(this.getStartMoment(), "minute");
    if (startResult && startResult < 0) {
      return false;
    }
    let endResult = moment().diff(this.getEndMoment(), "minute");
    if (endResult && endResult > 0) {
      return false;
    }
    return true;
  }

  // MARK: - Methods involved JSON

  toJSON() : any {
    return Object.assign({}, this);
  }

  static fromJSON(json: any) : Period {
    var jsonData;
    if (typeof json === 'string') {
      jsonData = JSON.parse(json);
    } else {
      jsonData = json;
    }
    return Object.assign(new Period(), jsonData);
  }
}
