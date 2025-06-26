import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Promotion } from '../model/promotion';
import { CollectionReference } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {
  private promotionsCollection: CollectionReference<Promotion>;

  constructor(private firestore: Firestore) {
    this.promotionsCollection = collection(this.firestore, 'promotions') as CollectionReference<Promotion>;
  }

  getPromotions(): Observable<Promotion[]> {
    return collectionData(this.promotionsCollection, { idField: 'id' }) as Observable<Promotion[]>;
  }

  async addPromotion(promotion: Promotion): Promise<void> {
    const { id, ...data } = promotion; // Exclude id from the data
    const newDoc = doc(this.promotionsCollection);
    await setDoc(newDoc, data); // Use data directly, time is already a Timestamp
  }

  async updatePromotion(promotion: Promotion): Promise<void> {
    if (!promotion.id) throw new Error('Promotion must have an ID to update');
    const { id, ...data } = promotion; // Exclude id from the data
    const ref = doc(this.promotionsCollection, id);
    await updateDoc(ref, data); // Use data directly, time is already a Timestamp
  }

  async deletePromotion(id: string): Promise<void> {
    const ref = doc(this.promotionsCollection, id);
    await deleteDoc(ref);
  }
}