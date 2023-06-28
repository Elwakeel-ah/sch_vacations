import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Utility } from '../services/utility.service';
import { HttpRequests } from '../services/http-requests.service';

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

  constructor(
    private readonly utility: Utility,
    private readonly httpRequests: HttpRequests
  ) {}

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
      this.errorMessage = 'You have to choose start and end Date';
      return;
    }

    this.httpRequests
      .createVacationRequest(
        this.startDate,
        this.endDate,
        this.httpRequests.vacationType
      )
      .subscribe({
        next: (value) => {},
      });
  }

  onChangeStartDate() {
    this.dateError = false;
    this.errorMessage = '';
    this.vacationDays = 0;
    this.startDate = new Date(this.vacationForm.value.startDate);
    if (!this.vacationForm.value.endDate) return;
    this.checkDateEligibility();
    this.vacationDays = this.utility.calculateVacations(
      this.startDate,
      this.endDate
    );
  }
  onChangeEndDate() {
    this.dateError = false;
    this.errorMessage = '';
    this.vacationDays = 0;
    this.endDate = new Date(this.vacationForm.value.endDate);
    if (!this.vacationForm.value.startDate) return;
    this.checkDateEligibility();
    this.vacationDays = this.utility.calculateVacations(
      this.startDate,
      this.endDate
    );
  }

  checkDateEligibility() {
    // check if the start date and end date are chosen incorrectly
    if (this.startDate > this.endDate) {
      this.dateError = true;
      this.errorMessage = 'Start and end date are chosen incorrectly';
      return;
    }
  }
}
