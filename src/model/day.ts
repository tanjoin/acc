type Day = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
namespace Day {
  export const Mon: Day = 'Mon'
  export const Tue: Day = 'Tue'
  export const Wed: Day = 'Wed'
  export const Thu: Day = 'Thu'
  export const Fri: Day = 'Fri'
  export const Sat: Day = 'Sat'
  export const Sun: Day = 'Sun'
  export function toDay(date: Date) : Day {
    let day = date.getDay();
    switch(day) {
      case 0:
        return Day.Sun;
      case 1:
        return Day.Mon;
      case 2:
        return Day.Tue;
      case 3:
        return Day.Wed;
      case 4:
        return Day.Thu;
      case 5:
        return Day.Fri;
      case 6:
        return Day.Sat;
    }
  }
  export function fromDay(day: Day) : number {
    switch(day) {
      case Day.Sun:
        return 0;
      case Day.Mon:
        return 1;
      case Day.Tue:
        return 2;
      case Day.Wed:
        return 3;
      case Day.Thu:
        return 4;
      case Day.Fri:
        return 5;
      case Day.Sat:
        return 6;
    }
  }
}
export default Day;
