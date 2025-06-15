import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule], // Thêm CommonModule vào imports
  template: `
    <div>
      <h2>Firebase Realtime Database Example</h2>
      <button (click)="saveData()">Save Data</button>
      <button (click)="loadData()">Load Data</button>
      <p>Data: {{ data | json }}</p>
    </div>
  `,
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  data: any;

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    this.dbService.listenData('test/data').subscribe((data) => {
      this.data = data;
      console.log('Data updated:', data);
    });
  }

  async saveData() {
    const sampleData = { name: 'Test User', timestamp: new Date().toISOString() };
    await this.dbService.writeData('test/data', sampleData);
  }

  async loadData() {
    this.data = await this.dbService.readData('test/data');
  }
}