// import { Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   constructor(private firestore: Firestore) {}

//   // Get all products
//   getProducts(): Observable<any[]> {
//     const productsCollection = collection(this.firestore, 'products');
//     return collectionData(productsCollection, { idField: 'product_id' }).pipe(
//       map(products => products.map(product => ({
//         ...product,
//         variant_id: product['variant_id'] || [],
//         date_listed: product['date_listed']?.toDate() || new Date()
//       })))
//     );
//   }

//   // Get variants by product ID
//   getVariants(productId: string): Observable<any[]> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
//       map(variants => variants.filter(variant => variant['product_id'] === productId).map(variant => ({
//         ...variant,
//         date_listed: variant['date_listed']?.toDate() || new Date()
//       })))
//     );
//   }

//   // Add product
//   async addProduct(productData: any): Promise<void> {
//     const productsCollection = collection(this.firestore, 'products');
//     const newDocRef = doc(productsCollection);
//     return setDoc(newDocRef, {
//       ...productData,
//       product_id: newDocRef.id,
//       date_listed: new Date()
//     });
//   }

//   // Add variant
//   async addVariant(variantData: any): Promise<void> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     const newDocRef = doc(variantsCollection);
//     return setDoc(newDocRef, {
//       ...variantData,
//       variant_id: newDocRef.id,
//       date_listed: new Date()
//     });
//   }

//   // Update product
//   async updateProduct(productId: string, updatedData: any): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     return updateDoc(productDoc, updatedData);
//   }

//   // Update variant
//   async updateVariant(variantId: string, updatedData: any): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return updateDoc(variantDoc, updatedData);
//   }

//   // Delete product
//   async deleteProduct(productId: string): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     const variants = await this.getVariants(productId).toPromise();
//     if (variants) {
//       for (const variant of variants) {
//         await this.deleteVariant(variant['variant_id']);
//       }
//     }
//     return deleteDoc(productDoc);
//   }

//   // Delete variant
//   async deleteVariant(variantId: string): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return deleteDoc(variantDoc);
//   }
// }

// import { Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   constructor(private firestore: Firestore) {}

//   // Get all products
//   getProducts(): Observable<any[]> {
//     const productsCollection = collection(this.firestore, 'products');
//     return collectionData(productsCollection, { idField: 'product_id' }).pipe(
//       map(products => products.map(product => ({
//         ...product,
//         variant_id: product['variant_id'] || [],
//         date_listed: product['date_listed']?.toDate() || new Date(),
//         also_buy: product['also_buy'] || null,
//         also_view: product['also_view'] || null,
//         similar_item: product['similar_item'] || null,
//         average_rating: product['average_rating'] || null,
//         rating_number: product['rating_number'] || null,
//         rank: product['rank'] || null,
//         sold_quantity: product['sold_quantity'] || null
//       })))
//     );
//   }

//   // Get variants by product ID
//   getVariants(productId: string): Observable<any[]> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
//       map(variants => variants.filter(variant => variant['product_id'] === productId).map(variant => ({
//         ...variant,
//         variant_date_listed: variant['variant_date_listed']?.toDate() || new Date(),
//         variant_rating: variant['variant_rating'] || null,
//         variant_rating_number: variant['variant_rating_number'] || null,
//         variant_sold_quantity: variant['variant_sold_quantity'] || null
//       })))
//     );
//   }

//   // Add product with custom product_id as document ID
//   async addProduct(productData: any): Promise<string> {
//     const productsCollection = collection(this.firestore, 'products');
//     const docRef = doc(productsCollection, productData.product_id);
//     await setDoc(docRef, {
//       ...productData,
//       date_listed: new Date(),
//       also_buy: productData['also_buy'] || null,
//       also_view: productData['also_view'] || null,
//       similar_item: productData['similar_item'] || null,
//       average_rating: productData['average_rating'] || null,
//       rating_number: productData['rating_number'] || null,
//       rank: productData['rank'] || null,
//       sold_quantity: productData['sold_quantity'] || null
//     });
//     return productData.product_id;
//   }

//   // Add variant with custom variant_id as document ID
//   async addVariant(variantData: any): Promise<string> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     const docRef = doc(variantsCollection, variantData.variant_id);
//     await setDoc(docRef, {
//       ...variantData,
//       variant_date_listed: new Date(),
//       variant_rating: variantData['variant_rating'] || null,
//       variant_rating_number: variantData['variant_rating_number'] || null,
//       variant_sold_quantity: variantData['variant_sold_quantity'] || null
//     });
//     return variantData.variant_id;
//   }

//   // Update product
//   async updateProduct(productId: string, updatedData: any): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     return updateDoc(productDoc, {
//       ...updatedData,
//       also_buy: updatedData['also_buy'] || null,
//       also_view: updatedData['also_view'] || null,
//       similar_item: updatedData['similar_item'] || null,
//       average_rating: updatedData['average_rating'] || null,
//       rating_number: updatedData['rating_number'] || null,
//       rank: updatedData['rank'] || null,
//       sold_quantity: updatedData['sold_quantity'] || null
//     });
//   }

//   // Update variant
//   async updateVariant(variantId: string, updatedData: any): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return updateDoc(variantDoc, {
//       ...updatedData,
//       variant_rating: updatedData['variant_rating'] || null,
//       variant_rating_number: updatedData['variant_rating_number'] || null,
//       variant_sold_quantity: updatedData['variant_sold_quantity'] || null
//     });
//   }

//   // Delete product and its variants
//   async deleteProduct(productId: string): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     const variants = await this.getVariants(productId).toPromise();
//     if (variants) {
//       for (const variant of variants) {
//         await this.deleteVariant(variant['variant_id']);
//       }
//     }
//     return deleteDoc(productDoc);
//   }

//   // Delete variant
//   async deleteVariant(variantId: string): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return deleteDoc(variantDoc);
//   }
// }



// import { Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   constructor(private firestore: Firestore) {}

//   // Get all products
//   getProducts(): Observable<any[]> {
//     const productsCollection = collection(this.firestore, 'products');
//     return collectionData(productsCollection, { idField: 'product_id' }).pipe(
//       map(products => products.map(product => ({
//         ...product,
//         variant_id: product['variant_id'] || [],
//         date_listed: product['date_listed']?.toDate() || new Date(),
//         also_buy: product['also_buy'] || null,
//         also_view: product['also_view'] || null,
//         similar_item: product['similar_item'] || null,
//         average_rating: product['average_rating'] || null,
//         rating_number: product['rating_number'] || null,
//         rank: product['rank'] || null,
//         sold_quantity: product['sold_quantity'] || null
//       })))
//     );
//   }

//   // Get variants by product ID
//   getVariants(productId: string): Observable<any[]> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
//       map(variants => variants.filter(variant => variant['product_id'] === productId).map(variant => ({
//         ...variant,
//         variant_date_listed: variant['variant_date_listed']?.toDate() || new Date(),
//         variant_rating: variant['variant_rating'] || null,
//         variant_rating_number: variant['variant_rating_number'] || null,
//         variant_sold_quantity: variant['variant_sold_quantity'] || null
//       })))
//     );
//   }

//   // Add product with custom product_id as document ID
//   async addProduct(productData: any): Promise<string> {
//     const productsCollection = collection(this.firestore, 'products');
//     const docRef = doc(productsCollection, productData.product_id);
//     await setDoc(docRef, {
//       ...productData,
//       date_listed: new Date(),
//       also_buy: productData['also_buy'] || null,
//       also_view: productData['also_view'] || null,
//       similar_item: productData['similar_item'] || null,
//       average_rating: productData['average_rating'] || null,
//       rating_number: productData['rating_number'] || null,
//       rank: productData['rank'] || null,
//       sold_quantity: productData['sold_quantity'] || null
//     });
//     return productData.product_id;
//   }

//   // Add variant with custom variant_id as document ID
//   async addVariant(variantData: any): Promise<string> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     const docRef = doc(variantsCollection, variantData.variant_id);
//     await setDoc(docRef, {
//       ...variantData,
//       variant_date_listed: new Date(),
//       variant_rating: variantData['variant_rating'] || null,
//       variant_rating_number: variantData['variant_rating_number'] || null,
//       variant_sold_quantity: variantData['variant_sold_quantity'] || null
//     });
//     return variantData.variant_id;
//   }

//   // Update product
//   async updateProduct(productId: string, updatedData: any): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     return updateDoc(productDoc, {
//       ...updatedData,
//       also_buy: updatedData['also_buy'] || null,
//       also_view: updatedData['also_view'] || null,
//       similar_item: updatedData['similar_item'] || null,
//       average_rating: updatedData['average_rating'] || null,
//       rating_number: updatedData['rating_number'] || null,
//       rank: updatedData['rank'] || null,
//       sold_quantity: updatedData['sold_quantity'] || null
//     });
//   }

//   // Update variant
//   async updateVariant(variantId: string, updatedData: any): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return updateDoc(variantDoc, {
//       ...updatedData,
//       variant_rating: updatedData['variant_rating'] || null,
//       variant_rating_number: updatedData['variant_rating_number'] || null,
//       variant_sold_quantity: updatedData['variant_sold_quantity'] || null
//     });
//   }

//   // Delete product and its variants
//   async deleteProduct(productId: string): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     const variants = await this.getVariants(productId).pipe(take(1)).toPromise();
//     if (variants && variants.length > 0) {
//       for (const variant of variants) {
//         await this.deleteVariant(variant.variant_id);
//       }
//     }
//     return deleteDoc(productDoc);
//   }

//   // Delete variant
//   async deleteVariant(variantId: string): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return deleteDoc(variantDoc);
//   }
// }


// import { Injectable } from '@angular/core';
// import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
// import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {
//   constructor(private firestore: Firestore) {}

//   // Get all products
//   getProducts(): Observable<any[]> {
//     const productsCollection = collection(this.firestore, 'products');
//     return collectionData(productsCollection, { idField: 'product_id' }).pipe(
//       map(products => products.map(product => ({
//         ...product,
//         variant_id: product['variant_id'] || [],
//         date_listed: product['date_listed']?.toDate() || new Date(),
//         also_buy: product['also_buy'] || null,
//         also_view: product['also_view'] || null,
//         similar_item: product['similar_item'] || null,
//         average_rating: product['average_rating'] || null,
//         rating_number: product['rating_number'] || null,
//         rank: product['rank'] || null,
//         sold_quantity: product['sold_quantity'] || null
//       })))
//     );
//   }

//   // Get variants by product ID
//   getVariants(productId: string): Observable<any[]> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
//       map(variants => variants.filter(variant => variant['product_id'] === productId).map(variant => ({
//         ...variant,
//         variant_date_listed: variant['variant_date_listed']?.toDate() || new Date(),
//         variant_rating: variant['variant_rating'] || null,
//         variant_rating_number: variant['variant_rating_number'] || null,
//         variant_sold_quantity: variant['variant_sold_quantity'] || null
//       })))
//     );
//   }

//   // Add product with custom product_id as document ID
//   async addProduct(productData: any): Promise<string> {
//     const productsCollection = collection(this.firestore, 'products');
//     const docRef = doc(productsCollection, productData.product_id);
//     await setDoc(docRef, {
//       ...productData,
//       date_listed: new Date(),
//       also_buy: productData['also_buy'] || null,
//       also_view: productData['also_view'] || null,
//       similar_item: productData['similar_item'] || null,
//       average_rating: productData['average_rating'] || null,
//       rating_number: productData['rating_number'] || null,
//       rank: productData['rank'] || null,
//       sold_quantity: productData['sold_quantity'] || null
//     });
//     return productData.product_id;
//   }

//   // Add variant with custom variant_id as document ID
//   async addVariant(variantData: any): Promise<string> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     const docRef = doc(variantsCollection, variantData.variant_id);
//     await setDoc(docRef, {
//       ...variantData,
//       variant_date_listed: new Date(),
//       variant_rating: variantData['variant_rating'] || null,
//       variant_rating_number: variantData['variant_rating_number'] || null,
//       variant_sold_quantity: variantData['variant_sold_quantity'] || null
//     });
//     return variantData.variant_id;
//   }

//   // Update product
//   async updateProduct(productId: string, updatedData: any): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     return updateDoc(productDoc, {
//       ...updatedData,
//       also_buy: updatedData['also_buy'] || null,
//       also_view: updatedData['also_view'] || null,
//       similar_item: updatedData['similar_item'] || null,
//       average_rating: updatedData['average_rating'] || null,
//       rating_number: updatedData['rating_number'] || null,
//       rank: updatedData['rank'] || null,
//       sold_quantity: updatedData['sold_quantity'] || null
//     });
//   }

//   // Update variant
//   async updateVariant(variantId: string, updatedData: any): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     return updateDoc(variantDoc, {
//       ...updatedData,
//       variant_rating: updatedData['variant_rating'] || null,
//       variant_rating_number: updatedData['variant_rating_number'] || null,
//       variant_sold_quantity: updatedData['variant_sold_quantity'] || null
//     });
//   }

//   // Delete product and its variants
//   async deleteProduct(productId: string): Promise<void> {
//     const productDoc = doc(this.firestore, `products/${productId}`);
//     const variants = await this.getVariants(productId).pipe(take(1)).toPromise();
//     if (variants && variants.length > 0) {
//       for (const variant of variants) {
//         await this.deleteVariant(variant.variant_id);
//       }
//     }
//     return deleteDoc(productDoc);
//   }

//   // Delete variant and update product
//   async deleteVariant(variantId: string): Promise<void> {
//     const variantDoc = doc(this.firestore, `variants/${variantId}`);
//     // Lấy thông tin variant để biết product_id
//     const variantsSnapshot = await this.getVariantsById(variantId).pipe(take(1)).toPromise();
//     if (variantsSnapshot && variantsSnapshot.length > 0) {
//       const variant = variantsSnapshot[0];
//       const productId = variant.product_id;
//       await deleteDoc(variantDoc);

//       // Cập nhật mảng variant_id trong tài liệu sản phẩm
//       const productDoc = doc(this.firestore, `products/${productId}`);
//       const productSnapshot = await this.getProducts().pipe(take(1)).toPromise();
//       const product = productSnapshot && productSnapshot.find(p => p.product_id === productId);
//       if (product) {
//         const updatedVariantIds = product.variant_id.filter((id: string) => id !== variantId);
//         await updateDoc(productDoc, { variant_id: updatedVariantIds });
//       }
//     } else {
//       await deleteDoc(variantDoc); // Xóa ngay nếu không tìm thấy variant
//     }
//   }

//   // Helper method to get variant by ID
//   private getVariantsById(variantId: string): Observable<any[]> {
//     const variantsCollection = collection(this.firestore, 'variants');
//     return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
//       map(variants => variants.filter(v => v.variant_id === variantId))
//     );
//   }
// }

import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

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
        date_listed: product['date_listed']?.toDate() || new Date(),
        also_buy: product['also_buy'] || null,
        also_view: product['also_view'] || null,
        similar_item: product['similar_item'] || null,
        average_rating: product['average_rating'] || null,
        rating_number: product['rating_number'] || null,
        rank: product['rank'] || null,
        sold_quantity: product['sold_quantity'] || null
      })))
    );
  }

  // Get variants by product ID
  getVariants(productId: string): Observable<any[]> {
    const variantsCollection = collection(this.firestore, 'variants');
    return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
      map(variants => variants.filter(variant => variant['product_id'] === productId).map(variant => ({
        ...variant,
        variant_date_listed: variant['variant_date_listed']?.toDate() || new Date(),
        variant_rating: variant['variant_rating'] || null,
        variant_rating_number: variant['variant_rating_number'] || null,
        variant_sold_quantity: variant['variant_sold_quantity'] || null
      })))
    );
  }

  // Add product with custom product_id as document ID
  async addProduct(productData: any): Promise<string> {
    const productsCollection = collection(this.firestore, 'products');
    const docRef = doc(productsCollection, productData.product_id);
    await setDoc(docRef, {
      ...productData,
      date_listed: new Date(),
      also_buy: productData['also_buy'] || null,
      also_view: productData['also_view'] || null,
      similar_item: productData['similar_item'] || null,
      average_rating: productData['average_rating'] || null,
      rating_number: productData['rating_number'] || null,
      rank: productData['rank'] || null,
      sold_quantity: productData['sold_quantity'] || null
    });
    return productData.product_id;
  }

  // Add variant with custom variant_id as document ID
  async addVariant(variantData: any): Promise<string> {
    const variantsCollection = collection(this.firestore, 'variants');
    const docRef = doc(variantsCollection, variantData.variant_id);
    await setDoc(docRef, {
      ...variantData,
      variant_date_listed: new Date(),
      variant_rating: variantData['variant_rating'] || null,
      variant_rating_number: variantData['variant_rating_number'] || null,
      variant_sold_quantity: variantData['variant_sold_quantity'] || null
    });
    return variantData.variant_id;
  }

  // Update product
  async updateProduct(productId: string, updatedData: any): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    return updateDoc(productDoc, {
      ...updatedData,
      also_buy: updatedData['also_buy'] || null,
      also_view: updatedData['also_view'] || null,
      similar_item: updatedData['similar_item'] || null,
      average_rating: updatedData['average_rating'] || null,
      rating_number: updatedData['rating_number'] || null,
      rank: updatedData['rank'] || null,
      sold_quantity: updatedData['sold_quantity'] || null
    });
  }

  // Update variant
  async updateVariant(variantId: string, updatedData: any): Promise<void> {
    const variantDoc = doc(this.firestore, `variants/${variantId}`);
    return updateDoc(variantDoc, {
      ...updatedData,
      variant_rating: updatedData['variant_rating'] || null,
      variant_rating_number: updatedData['variant_rating_number'] || null,
      variant_sold_quantity: updatedData['variant_sold_quantity'] || null
    });
  }

  // Delete product and its variants
  async deleteProduct(productId: string): Promise<void> {
    const productDoc = doc(this.firestore, `products/${productId}`);
    const variants = await this.getVariants(productId).pipe(take(1)).toPromise();
    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await this.deleteVariant(variant.variant_id);
      }
    }
    return deleteDoc(productDoc);
  }

  // Delete variant and update product quantity and price
  async deleteVariant(variantId: string): Promise<void> {
    const variantDoc = doc(this.firestore, `variants/${variantId}`);
    // Lấy thông tin variant để biết product_id
    const variantsSnapshot = await this.getVariantsById(variantId).pipe(take(1)).toPromise();
    if (variantsSnapshot && variantsSnapshot.length > 0) {
      const variant = variantsSnapshot[0];
      const productId = variant.product_id;
      await deleteDoc(variantDoc);

      // Cập nhật mảng variant_id, quantity, và price trong tài liệu sản phẩm
      const remainingVariants = await this.getVariants(productId).pipe(take(1)).toPromise();
      const productDoc = doc(this.firestore, `products/${productId}`);
      const updatedVariantIds = remainingVariants ? remainingVariants.map(v => v.variant_id) : [];
      const totalQuantity = remainingVariants ? remainingVariants.reduce((sum, v) => sum + (v.variant_quantity || 0), 0) : 0;
      const newPrice = remainingVariants && remainingVariants.length > 0 ? remainingVariants[0].variant_price : 0;

      await updateDoc(productDoc, {
        variant_id: updatedVariantIds,
        quantity: totalQuantity,
        price: newPrice
      });
    } else {
      await deleteDoc(variantDoc); // Xóa ngay nếu không tìm thấy variant
    }
  }

  // Helper method to get variant by ID
  private getVariantsById(variantId: string): Observable<any[]> {
    const variantsCollection = collection(this.firestore, 'variants');
    return collectionData(variantsCollection, { idField: 'variant_id' }).pipe(
      map(variants => variants.filter(v => v.variant_id === variantId))
    );
  }
}