import { Injectable } from '@angular/core';
import { Database, ref, set, get, child, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(private db: Database) {}

  // Ghi dữ liệu vào Firebase Realtime Database
  async writeData(path: string, data: any): Promise<void> {
    const dbRef = ref(this.db, path);
    try {
      await set(dbRef, data);
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing data:', error);
    }
  }

  // Đọc dữ liệu một lần
  async readData(path: string): Promise<any> {
    const dbRef = ref(this.db);
    try {
      const snapshot = await get(child(dbRef, path));
      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        console.log('No data available');
        return null;
      }
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }

  // Lắng nghe thay đổi dữ liệu theo thời gian thực
  listenData(path: string): Observable<any> {
    const dbRef = ref(this.db, path);
    return new Observable((subscriber) => {
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        subscriber.next(data);
      }, (error) => {
        subscriber.error(error);
      });
    });
  }
}