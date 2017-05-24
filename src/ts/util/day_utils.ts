import Day from "../model/day";

module DayUtils {
  export function getDay(date: Date) : Day {
    if (date) {
      switch (date.getDay()) {
        case 0:
          return Day.Sunday;
        case 1:
          return Day.Monday;
        case 2:
          return Day.Tuesday;
        case 3:
          return Day.Wednesday;
        case 4:
          return Day.Thursday;
        case 5:
          return Day.Friday;
        case 6:
          return Day.Saturday;
      }
    }
    return null;
  }

  export function getDayIndex(day: Day) : number {
    if (day) {
      switch (day) {
        case Day.Sunday:
          return 0;
        case Day.Monday:
          return 1;
        case Day.Tuesday:
          return 2;
        case Day.Wednesday:
          return 3;
        case Day.Thursday:
          return 4;
        case Day.Friday:
          return 5;
        case Day.Saturday:
          return 6;
      }
    }
    return null;
  }
}

export default DayUtils
