class Period {
  start: string;
  end: string;
  getStart() : Date {
    if (this.start) {
      return null;
    }
    return new Date(Date.parse(this.start));
  }

  getEnd() : Date {
    if (this.end) {
      return null;
    }
    return new Date(Date.parse(this.end));
  }

  isDisplay(now: Date) {
    if (this.getStart() && this.getStart().getTime() > now.getTime()) {
      return false;
    }
    if (this.getEnd() && this.getEnd().getTime() < now.getTime()) {
      return false;
    }
    return true;
  }
}
export default Period;
