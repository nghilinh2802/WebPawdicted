// // src/app/services/promotion.service.ts
// import { Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Promotion } from '../model/promotion';

// @Injectable({
//   providedIn: 'root'
// })
// export class PromotionService {
//   private promotionsCollection: any;

//   constructor(private firestore: Firestore) {
//     this.promotionsCollection = collection(this.firestore, 'promotions');
//   }

//   getPromotions(): Observable<Promotion[]> {
//     return collectionData(this.promotionsCollection, { idField: 'id' }).pipe(
//       map(promotions => promotions as Promotion[])
//     );
//   }

//   async addPromotion(promotion: Promotion): Promise<void> {
//     const newDocRef = doc(this.promotionsCollection);
//     return setDoc(newDocRef, promotion);
//   }
// }
import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
    try {
      const newDocRef = doc(this.promotionsCollection);
      // Spread properties to ensure a plain object for setDoc
      await setDoc(newDocRef, { ...promotion });
    } catch (error: any) {
      console.error('Error adding promotion:', error);
      throw error;
    }
  }

  async updatePromotion(promotion: Promotion): Promise<void> {
    try {
      if (!promotion.id) {
        throw new Error('Promotion ID is required for update');
      }
      const docRef = doc(this.promotionsCollection, promotion.id);
      await updateDoc(docRef, { ...promotion }); // Spread to ensure plain object
    } catch (error: any) {
      console.error('Error updating promotion:', error);
      throw error;
    }
  }

  async deletePromotion(promotionId: string): Promise<void> {
    try {
      const docRef = doc(this.promotionsCollection, promotionId);
      await deleteDoc(docRef);
    } catch (error: any) {
      console.error('Error deleting promotion:', error);
      throw error;
    }
  }
}