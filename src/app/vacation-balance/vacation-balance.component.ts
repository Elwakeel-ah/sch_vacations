import { Component } from '@angular/core';
import { Utility } from '../services/utility.service';
import { TVacation } from '../types/vacation-type';
import { HttpRequests } from '../services/http-requests.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vacation-balance',
  templateUrl: './vacation-balance.component.html',
  styleUrls: ['./vacation-balance.component.css'],
})
export class VacationBalanceComponent {
  viewSummary = true;
  annualVacations!: number;
  sickVacations!: number;
  takenAnnualVacations!: number;
  takenAnnualVacationsSubs!: Subscription;
  takenSickVacations!: number;
  takenSickVacationsSubs!: Subscription;
  allVacationRecords!: TVacation[];
  allVacationRecordsSubs!: Subscription;

  constructor(
    private readonly httpRequests: HttpRequests,
    private readonly utility: Utility
  ) {}

  ngOnInit() {
    this.annualVacations = 0;
    this.sickVacations = 0;
    this.takenAnnualVacations = 0;
    this.takenSickVacations = 0;

    this.httpRequests.getAnnualVacationsDays().subscribe({
      next: (value) => (this.annualVacations = +value),
    });

    this.httpRequests.getSickVacationsDays().subscribe({
      next: (value) => (this.sickVacations = +value),
    });

    this.takenAnnualVacationsSubs =
      this.httpRequests.$takenAnnualVacations.subscribe((value) => {
        this.takenAnnualVacations = value;
      });

    this.takenSickVacationsSubs =
      this.httpRequests.$takenSickVacations.subscribe(
        (value) => (this.takenSickVacations = value)
      );

    this.allVacationRecordsSubs =
      this.httpRequests.$allVacationRecords.subscribe(
        (value) => (this.allVacationRecords = value.reverse())
      );

    this.httpRequests.getVacationsRecords();
  }

  ngOnDestroy() {
    this.takenAnnualVacationsSubs.unsubscribe();
    this.takenSickVacationsSubs.unsubscribe();
    this.allVacationRecordsSubs.unsubscribe();
  }

  onViewHandler() {
    this.viewSummary = !this.viewSummary;
  }
}
