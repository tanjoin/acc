import Period from "./period";
import Day from "./day";
import Stage from "./stage";

export default class Campaign {
  id: number;
  title: string;
  service: string;
  description: string;
  images: string[];
  urls: string[];
  entryPeriod: Period; // エントリー期間
  eventPeriod: Period; // 開催期間
  lotteryPeriod: Period; // 当落期間
  particularDays: Day[]; // 特定日
  particularDates: number[]; // 特定曜日

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

  isShow() : boolean {
    var now = new Date();
    if (this.entryPeriod && this.entryPeriod.isDisplay(now)) {
      return true;
    }
    if (this.eventPeriod && this.eventPeriod.isDisplay(now)) {
      return true;
    }
    if (this.lotteryPeriod && this.lotteryPeriod.isDisplay(now)) {
      return true;
    }
    return false;
  }

  getStages() : Stage[] {
    var now = new Date();
    var stages : Stage[] = [];
    if (this.entryPeriod && this.entryPeriod.isDisplay(now)) {
      stages.push(Stage.ENTRY);
    }
    if (this.eventPeriod && this.eventPeriod.isDisplay(now)) {
      stages.push(Stage.EVENT);
    }
    if (this.lotteryPeriod && this.lotteryPeriod.isDisplay(now)) {
      stages.push(Stage.LOTTERY);
    }
    if (stages.length === 0) {
      stages.push(Stage.UNKNOWN);
    }
    return stages;
  }
}
