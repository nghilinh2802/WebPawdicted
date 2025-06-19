import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private firestore: Firestore) {}

  // Get all products
  getProducts(): Observable<any[]> {
    const productsCollection = collection(this.firestore, 'products');
    return collectionData(productsCollection, { idField: 'product_id' }).pipe(
      map(products => products.map(product => ({
        ...product,
        variant_id: product['variant_id'] || [],
        date_listed: product['date_listed']?.toDate() || new Date()
      })))
    );
  }

  // Get variants by product ID
  getVariants(productId: string): Observable<any[]> {
    const variantsCollection = collection(this.firestore, 'variants');
    return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
      map(variants => variants.filter(variant => variant['product_id'] === productId).map(variant => ({
        ...variant,
        date_listed: variant['date_listed']?.toDate() || new Date()
      })))
    );
  }

  // Add product
  async addProduct(productData: any): Promise<void> {
    const productsCollection = collection(this.firestore, 'products');
    const newDocRef = doc(productsCollection);
    return setDoc(newDocRef, {
      ...productData,
      product_id: newDocRef.id,
      date_listed: new Date()
    });
  }

  // Add variant
  async addVariant(variantData: any): Promise<void> {
    const variantsCollection = collection(this.firestore, 'variants');
    const newDocRef = doc(variantsCollection);
    return setDoc(newDocRef, {
      ...variantData,
      variant_id: newDocRef.id,
      date_listed: new Date()
    });
  }

  // Update product
  async updateProduct(productId: string, updatedData: any): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    return updateDoc(productDoc, updatedData);
  }

  // Update variant
  async updateVariant(variantId: string, updatedData: any): Promise<void> {
    const variantDoc = doc(this.firestore, `variants/${variantId}`);
    return updateDoc(variantDoc, updatedData);
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    const variants = await this.getVariants(productId).toPromise();
    if (variants) {
      for (const variant of variants) {
        await this.deleteVariant(variant['variant_id']);
      }
    }
    return deleteDoc(productDoc);
  }

  // Delete variant
  async deleteVariant(variantId: string): Promise<void> {
    const variantDoc = doc(this.firestore, `variants/${variantId}`);
    return deleteDoc(variantDoc);
  }
}