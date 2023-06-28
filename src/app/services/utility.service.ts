import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Utility {
  calculateVacations(startDate: Date, endDate: Date) {
    //calculate the total time difference.
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());

    //calculate the total days.
    const totalDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000)) + 1;

    // calculate the weekends to be excluded.
    const weekends = this.calculateWeekends(startDate, endDate);

    // calculate the vacations day.
    const vacationDays = totalDays - weekends;
    return vacationDays;
  }

  calculateWeekends(start: Date, end: Date) {
    let weekends = 0;
    let current = start;
    while (current <= end) {
      const dayOfWeek = current.getDay();
      //check if the day is a weekend Friday or saturday.
      if (dayOfWeek == 5 || dayOfWeek == 6) weekends++;
      current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
    }
    return weekends;
  }
}
