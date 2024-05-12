import {Component, OnInit} from '@angular/core';
import {Appointment} from "../../model/appointment";
import {AuthService} from "../../services/auth.service";
import {DataService} from "../../shared/data.service";
import firebase from "firebase/compat";
import App = firebase.app.App;
import { AngularFireAuth } from '@angular/fire/compat/auth';
import 'firebase/compat/auth';
import {Subscription, timestamp} from "rxjs";
import User = firebase.User;
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{

  darkMode: boolean = false;
  appointmentsList : Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  selectedChip: string | null = 'All';
  appointmentObj : Appointment = {
    id : '',
    time: new Date(),
    subject: '',
    city: '',
    email: '',
    day: ''
  };
  id : string = '';
  time: Date | undefined;
  subject: string = '';
  city: string = '';
  email: string = '';
  day: string = '';
  currentUserEmail: string = '';


  constructor(private authService : AuthService, private data: DataService, private afAuth: AngularFireAuth, private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.generateTimeOptions();
    this.matIconRegistry.addSvgIcon(
      'cityIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('src/app/Icons/city_icon.svg'));
    this.filteredAppointments = this.appointmentsList;
    this.filterAppointments(null);
  }


  ngOnInit():void {
    this.getAllAppointments();
    this.getCurrentUser();
    this.filterAppointments(null);
  }

  toggleDarkMode(): void {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  getCurrentUser() {
    this.afAuth.authState.subscribe((user: User | null) => {
      if (user) {
        this.currentUserEmail = user.email || '';
      }
    });
  }

  logout(){
    this.authService.logout();
  }
  getAllAppointments(){

    this.data.getAllAppointments().subscribe(res =>{

      this.appointmentsList = res.map((e: any) => {
        const data  = e.payload.doc.data();
        data.id = e.payload.doc.id;
        return data;
        }).filter(appointment => appointment.email === this.currentUserEmail);
    },err => {
      alert('Error while fetching appointment data');
      }
    )
  }
  filterAppointments(subject: string | null) {
    this.selectedChip = subject;
    if (subject === 'All' || !subject) {
      this.filteredAppointments = this.appointmentsList;
    } else {
      this.filteredAppointments = this.appointmentsList.filter(appointment => appointment.subject === subject);
    }
    this.updateFilteredAppointments();
  }
  resetForm(){
      this.id = '',
      this.time= new Date(),
      this.subject= '',
      this.city='',
      this.email = '',
      this.day = '';
  }

  timestamptToDayDate(timestamp : any): string{
    const milliseconds = timestamp.seconds * 1000;
    const date = new Date(milliseconds);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }


  addAppointment() {
    if (this.city == '' || this.time == undefined || this.subject == '') {
      alert("Töltsd ki az összes beviteli mezőt");
      return;
    }

    this.appointmentObj.id = '';
    this.appointmentObj.time = this.time;
    this.appointmentObj.city = this.city;
    this.appointmentObj.subject = this.subject;
    this.appointmentObj.email = this.currentUserEmail;
    this.appointmentObj.day = this.day;

    console.log('Adding appointment:', this.appointmentObj);

    this.data.addAppointment(this.appointmentObj).subscribe(() => {
      console.log('Appointment added successfully.');
      this.resetForm();
      this.updateFilteredAppointments();
    }, (error: any) => {
      console.error('Error adding appointment:', error);
      alert('Error adding appointment. Please try again.');
    });
  }


  addAppointmentSubscription: Subscription | undefined;

  ngOnDestroy() {
    if (this.addAppointmentSubscription) {
      this.addAppointmentSubscription.unsubscribe();
    }
  }

  updateFilteredAppointments() {
    if (this.selectedChip === 'All' || !this.selectedChip) {
      this.filteredAppointments = this.appointmentsList;
    } else {
      this.filteredAppointments = this.appointmentsList.filter(appointment => appointment.subject === this.selectedChip);
    }
  }


  updateAppointment(){

  }
  deleteAppointment(appointment: Appointment) {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      this.data.deleteAppointment(appointment).subscribe(() => {
        console.log('Appointment deleted successfully.');
        this.appointmentsList = this.appointmentsList.filter(app => app.id !== appointment.id);
        this.updateFilteredAppointments();
      }, (error: any) => {
        console.error('Error deleting appointment:', error);
        alert('Error deleting appointment. Please try again.');
      });
    }
  }
  hours: string[] = [];

  generateTimeOptions() {
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        this.hours.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      }
    }
  }



}
