import Period from "./period";
import Day from "./day";

export default class Campaign {
  id: number;
  title: string;
  service: string;
  description: string;
  images: string[];
  urls: string[];
  entryPeriod: Period;
  eventPeriod: Period;
  lotteryPeriod: Period;
  particularDays: Day[];
  particularDates: number[];

  constructor();
  constructor(json: string);
  constructor(obj?: any) {
    if (!obj) {
      return;
    }
    var jsonObj = JSON.parse(obj);
    if (!jsonObj) {
      return;
    }
    this.id = jsonObj["id"];
    this.title = jsonObj["title"];
    this.service = jsonObj["service"];
    this.description = jsonObj["description"];
    this.images = jsonObj["images"];
    this.urls = jsonObj["urls"];
    this.entryPeriod = jsonObj["entry_period"];
    this.eventPeriod = jsonObj["event_period"];
    this.lotteryPeriod = jsonObj["lottery_period"];
    this.particularDays = jsonObj["particular_days"];
    this.particularDates = jsonObj["particular_dates"];
  }
}
