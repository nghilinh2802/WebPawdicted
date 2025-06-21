import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FlashsaleService {
  constructor(private firestore: Firestore) {}

  async createFlashsale(flashsale: any): Promise<void> {
    const flashsaleRef = collection(this.firestore, 'flashsales');
    await addDoc(flashsaleRef, flashsale);
  }
}
