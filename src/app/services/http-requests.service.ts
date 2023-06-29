import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Subscription,
  catchError,
  map,
  take,
  tap,
  throwError,
} from 'rxjs';
import { TVacation } from '../types/vacation-type';
import { Utility } from './utility.service';

@Injectable({ providedIn: 'root' })
export class HttpRequests {
  vacationType = 'annual';
  $httpError = new BehaviorSubject<boolean>(false);
  $httpErrorMessage = new BehaviorSubject<string>('');
  takenAnnualVacations = 0;
  $takenAnnualVacations = new BehaviorSubject<number>(0);
  takenSickVacations = 0;
  $takenSickVacations = new BehaviorSubject<number>(0);
  allVacationRecords!: TVacation[];
  $allVacationRecords = new BehaviorSubject<TVacation[]>([]);

  constructor(
    private readonly http: HttpClient,
    private readonly utility: Utility
  ) {}

  getAnnualVacationsDays() {
    return this.http
      .get<{ status: boolean; messages: string[]; data: number[] }>(
        'http://localhost:3500/cts/annual'
      )
      .pipe(
        take(1),
        map((response) => {
          return response?.data[0];
        }),
        catchError((error) => {
          return throwError(() => {
            this.$httpError.next(true);
            this.$httpErrorMessage.next(error?.error?.messages[0]);
          });
        })
      );
  }

  getSickVacationsDays() {
    return this.http
      .get<{ status: boolean; messages: string[]; data: number[] }>(
        'http://localhost:3500/cts/sick'
      )
      .pipe(
        take(1),
        map((response) => {
          return response?.data[0];
        }),
        catchError((error) => {
          return throwError(() => {
            this.$httpError.next(true);
            this.$httpErrorMessage.next(error?.error?.messages[0]);
          });
        })
      );
  }

  getVacationsRecords() {
    return this.http
      .get<{ status: boolean; messages: string[]; data: TVacation[] }>(
        'http://localhost:3500/vacations'
      )
      .pipe(
        take(1),
        catchError((error) => {
          return throwError(() => {
            this.$httpError.next(true);
            this.$httpErrorMessage.next(error?.error?.messages[0]);
          });
        })
      )
      .subscribe({
        next: (value: any) => {
          this.allVacationRecords = value.data;
          this.takenAnnualVacations = 0;
          this.takenSickVacations = 0;

          for (let i = 0; i < this.allVacationRecords.length; i++) {
            const currentElement = this.allVacationRecords[i];
            const startDate = new Date(currentElement.startDate);
            const endDate = new Date(currentElement.endDate);
            this.allVacationRecords[i].startDate = this.allVacationRecords[
              i
            ].startDate
              .toString()
              .split('T')[0];
            this.allVacationRecords[i].endDate = this.allVacationRecords[
              i
            ].endDate
              .toString()
              .split('T')[0];

            if (currentElement.vacationType == 'annual') {
              this.takenAnnualVacations += this.utility.calculateVacations(
                startDate,
                endDate
              );
            }
            if (currentElement.vacationType == 'sick') {
              this.takenSickVacations += this.utility.calculateVacations(
                startDate,
                endDate
              );
            }
          }
          this.$takenAnnualVacations.next(this.takenAnnualVacations);
          this.$takenSickVacations.next(this.takenSickVacations);
          this.$allVacationRecords.next(this.allVacationRecords);
        },
      });
  }

  createVacationRequest(startDate: Date, endDate: Date, vacationType: string) {
    return this.http
      .post('http://localhost:3500/vacations', {
        vacationType,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      })
      .pipe(
        take(1),
        tap(() => this.getVacationsRecords()),
        catchError((error) => {
          return throwError(() => {
            this.$httpError.next(true);
            this.$httpErrorMessage.next(error?.error?.messages[0]);
          });
        })
      );
  }
}
