import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css'],
})
export class CreateRequestComponent {
  vacationDays!: number;
  vacationForm!: FormGroup;
  startDate!: Date;
  endDate!: Date;
  dateError = false;
  errorMessage = '';

  ngOnInit() {
    this.vacationDays = 0;

    this.vacationForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.dateError = false;
    this.errorMessage = '';

    // make sure that start and end date are chosen.
    if (!this.startDate || !this.endDate) {
      this.dateError = true;
      this.errorMessage = 'you have to choose start and End Date';
      return;
    }

    console.log('--->');
  }

  onChangeStartDate() {
    this.dateError = false;
    this.errorMessage = '';
    this.startDate = new Date(this.vacationForm.value.startDate);
    if (!this.vacationForm.value.endDate) return;
    this.checkDateEligibility();
    this.calculateVacations();
  }
  onChangeEndDate() {
    this.dateError = false;
    this.errorMessage = '';
    this.endDate = new Date(this.vacationForm.value.endDate);
    if (!this.vacationForm.value.startDate) return;
    this.checkDateEligibility();
    this.calculateVacations();
  }

  calculateVacations() {
    //calculate the total time difference.
    const diffTime = Math.abs(
      this.endDate.getTime() - this.startDate.getTime()
    );

    //calculate the total days.
    const totalDays = Math.ceil(diffTime / (24 * 60 * 60 * 1000)) + 1;

    // calculate the weekends to be excluded.
    const weekends = this.calculateWeekends(this.startDate, this.endDate);

    // calculate the vacations day.
    this.vacationDays = totalDays - weekends;
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

  checkDateEligibility() {
    // check if the start date and end date are chosen incorrectly
    if (this.startDate > this.endDate) {
      this.dateError = true;
      this.errorMessage = 'start and end date are chosen incorrectly';
      return;
    }
  }
}
