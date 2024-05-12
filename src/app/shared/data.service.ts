import { Injectable } from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from "@angular/fire/compat/firestore";
import { Appointment } from "../model/appointment";
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs: AngularFirestore) { }

  addAppointment(appointment: Appointment): Observable<void> {
    appointment.id = this.afs.createId();
    return new Observable<void>(observer => {
      this.afs.collection('/Appointments').add(appointment)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  getAllAppointments(): Observable<DocumentChangeAction<Appointment>[]> {
    return this.afs.collection('/Appointments').snapshotChanges() as Observable<DocumentChangeAction<Appointment>[]>;
  }


  deleteAppointment(appointment: Appointment): Observable<void> {
    return new Observable<void>(observer => {
      this.afs.doc('Appointments/' + appointment.id).delete()
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

  updateAppointment(appointment: Appointment): Observable<void> {
    return this.deleteAppointment(appointment).pipe(
      switchMap(() => this.addAppointment(appointment))
    );
  }
}
