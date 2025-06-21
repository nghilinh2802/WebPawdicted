import { Component, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, deleteDoc, doc, updateDoc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Flashsale } from '../../model/flashsale';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-flashsale',
  standalone: false,
  templateUrl: './flashsale.component.html',
  styleUrl: './flashsale.component.css'
})
export class FlashsaleManagementComponent implements OnInit {
  flashsales: Flashsale[] = [];
  filteredFlashsales: Flashsale[] = [];
  searchTerm: string = '';

  showEditPopup = false;
  editingFlashsale: Flashsale | null = null;

  constructor(private firestore: Firestore,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
  this.loadFlashsales();
  this.loadAllProducts(); // ✅ gọi đúng function
  console.log('allProducts:', this.allProducts);

}

    loadFlashsales() {
    const flashRef = collection(this.firestore, 'flashsales');
    collectionData(flashRef, { idField: 'docId' }).subscribe((data: any) => {
      this.flashsales = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    this.filteredFlashsales = this.flashsales.filter(f =>
      f.flashSale_id.toLowerCase().includes(term) ||
      f.flashSale_name.toLowerCase().includes(term)
    );
  }

  openEditPopup(flash: Flashsale) {
    this.editingFlashsale = { ...flash }; // clone to avoid two-way binding problems
    this.showEditPopup = true;
  }

  closeEditPopup() {
    this.showEditPopup = false;
    this.editingFlashsale = null;
  }

  async deleteFlashsale(flash: any) {
    const confirmDelete = confirm(`Delete flashsale: ${flash.flashSale_name}?`);
    if (!confirmDelete) return;
    const docRef = doc(this.firestore, 'flashsales/' + flash.docId);
    await deleteDoc(docRef);
  }
  getDateTimeLocal(timestamp: number): string {
    const date = new Date(timestamp);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  getTimestampFromLocal(dateTimeString: string): number {
    return new Date(dateTimeString).getTime();
  }
  
  editingProductIds: string = '';

  editFlashsale(flashsale: Flashsale) {
  this.editingFlashsale = { ...flashsale };
  this.editingProductIds = flashsale.product_id.join(', ');
}

cancelEdit() {
  this.editingFlashsale = null;
  this.editingProductIds = '';
}

async saveFlashsale() {
  if (!this.editingFlashsale) return;

  try {
    const { flashSale_id, docId, ...updateData } = this.editingFlashsale as any;

    const docRef = doc(this.firestore, `flashsales/${docId}`);
    await updateDoc(docRef, updateData);

    alert('Flashsale updated!');
    this.editingFlashsale = null;
    this.loadFlashsales();
  } catch (e) {
    console.error('Error updating flashsale:', e);
    alert('Failed to update flashsale');
  }
}

productSearch: string = '';
filteredProductSuggestions: any[] = [];
allProducts: any[] = []; // danh sách toàn bộ sản phẩm từ Firestore
// Khi load component
loadAllProducts() {
  this.productService.loadProducts().subscribe(products => {
    this.allProducts = products;
  });
}

removeProduct(pid: string) {
  this.editingFlashsale!.product_id = this.editingFlashsale!.product_id.filter(id => id !== pid);
}
filterProductSuggestions() {
  const keyword = this.productSearch.toLowerCase().trim();
  if (!keyword) {
    this.filteredProductSuggestions = [];
    return;
  }

  this.filteredProductSuggestions = this.allProducts
    .filter(p => 
      (p.product_name?.toLowerCase().includes(keyword) || p.product_id?.toLowerCase().includes(keyword)) &&
      !this.editingFlashsale!.product_id.includes(p.product_id)
    )
    .slice(0, 5); // giới hạn gợi ý
}

addProductToFlashsale(pid: string) {
  if (!this.editingFlashsale!.product_id.includes(pid)) {
    this.editingFlashsale!.product_id.push(pid);
  }
  this.productSearch = '';
  this.filteredProductSuggestions = [];
}


}
