import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-check-firebase',
  standalone: true,
  templateUrl: './check-firebase.component.html',
  styleUrls: ['./check-firebase.component.css'],
  imports: [CommonModule, FormsModule],
})
export class CheckFirebaseComponent implements OnInit {

  customersData: any[] = [];
  selectedCustomer: any;
  newCustomer = {
    customer_name: '',
    customer_email: '',
    phone_number: '',
    role: 'Customer',
    address: '',
    avatar_img: '',
    date_joined: new Date().toISOString(),
    dob: '',
    gender: 'Male',
    customer_username: ''
  };

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.fetchCustomersData();
  }

  fetchCustomersData() {
    this.firebaseService.getCustomersData().subscribe({
      next: (data) => {
        this.customersData = data;
        console.log('Fetched customers data:', this.customersData);
      },
      error: (error) => {
        console.error('Error fetching customers data:', error);
      }
    });
  }

  selectCustomer(customer: any) {
    this.selectedCustomer = customer;
    this.newCustomer = { ...customer };
  }

  addCustomer() {
    const newCustomerData = { ...this.newCustomer };
    this.firebaseService.addCustomer(newCustomerData).then(() => {
      console.log('Customer added successfully');
      this.fetchCustomersData();
    }).catch((error) => {
      console.error('Error adding customer:', error);
    });
  }

  updateCustomer() {
    if (!this.selectedCustomer) {
      console.error('No customer selected');
      return;
    }

    const updatedData = {
      customer_name: this.newCustomer.customer_name,
      phone_number: this.newCustomer.phone_number
    };

    this.firebaseService.updateCustomer(this.selectedCustomer.customer_username, updatedData).then(() => {
      console.log('Customer updated successfully');
      this.fetchCustomersData();
      this.selectedCustomer = null;
    }).catch((error) => {
      console.error('Error updating customer:', error);
    });
  }
}