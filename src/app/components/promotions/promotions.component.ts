// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Promotion } from '../../model/promotion';
// import { PromotionService } from '../../services/promotion.service';
// import { inject } from '@angular/core';

// @Component({
//   selector: 'app-promotions',
//   standalone: false,
//   templateUrl: './promotions.component.html',
//   styleUrls: ['./promotions.component.css'],
// })
// export class PromotionsComponent implements OnInit {
//   isAddModalOpen = false;
//   isEditModalOpen = false; // Added for edit modal control
//   filteredPromotions: Promotion[] = []; // Added for filtered promotion list
//   promotions: Promotion[] = [];
//   newPromotion: Promotion = {
//     title: '',
//     description: '',
//     time: new Date().toISOString(),
//     imageUrl: ''
//   };
//   editedPromotion: Promotion = { title: '', description: '', time: '', imageUrl: '' }; // Added for editing

//   private promotionService: PromotionService;

//   constructor() {
//     this.promotionService = inject(PromotionService);
//   }

//   ngOnInit(): void {
//     this.loadPromotions();
//   }

//   validatePromotion(promotion: Promotion): boolean {
//     console.log('Validating promotion:', promotion);
//     const isTitleValid = !!promotion.title && promotion.title.trim().length > 0;
//     const isDescriptionValid = !!promotion.description && promotion.description.trim().length > 0;
//     const isTimeValid = !!promotion.time && this.isValidDate(promotion.time);
//     const isImageUrlValid = !!promotion.imageUrl && promotion.imageUrl.trim().length > 0;
//     console.log('Validation results:', { isTitleValid, isDescriptionValid, isTimeValid, isImageUrlValid });
//     return isTitleValid && isDescriptionValid && isTimeValid && isImageUrlValid;
//   }

//   private isValidDate(dateStr: string): boolean {
//     const date = new Date(dateStr);
//     return date instanceof Date && !isNaN(date.getTime());
//   }

//   calculateStatus(time: string): 'scheduled' | 'sent' {
//     const promotionTime = new Date(time).getTime();
//     const currentTime = new Date().getTime();
//     return promotionTime > currentTime ? 'scheduled' : 'sent';
//   }

//   loadPromotions(): void {
//     this.promotionService.getPromotions().subscribe({
//       next: (data: Promotion[]) => {
//         this.promotions = data.map(p => {
//           let timeStr: string;
//           if (p.time === null || p.time === undefined) {
//             console.warn('Null or undefined time for promotion:', p);
//             timeStr = new Date().toISOString();
//           } else if (typeof p.time === 'string') {
//             timeStr = this.isValidDate(p.time) ? p.time : new Date().toISOString();
//             if (!this.isValidDate(p.time)) console.warn('Invalid string time format, using fallback:', p.time);
//           } else if (p.time && typeof p.time.toDate === 'function') {
//             timeStr = p.time.toDate().toISOString();
//           } else {
//             console.error('Unrecognized time format for promotion:', p.time);
//             timeStr = new Date().toISOString();
//           }
//           return {
//             ...p,
//             time: timeStr,
//             status: p.status || this.calculateStatus(timeStr)
//           };
//         });
//         this.filterPromotions({ target: { value: 'all' } } as any); // Initial filter
//       },
//       error: (error: any) => console.error('Lỗi khi tải danh sách khuyến mãi:', error)
//     });
//   }

//   openAddModal(): void {
//     this.newPromotion = { title: '', description: '', time: new Date().toISOString(), imageUrl: '' };
//     this.isAddModalOpen = true;
//     console.log('Modal opened, initial newPromotion:', this.newPromotion);
//   }

//   closeAddModal(): void {
//     this.isAddModalOpen = false;
//   }

//   closeEditModal(): void { // Added to close edit modal
//     this.isEditModalOpen = false;
//   }

//   async addPromotion(): Promise<void> {
//     console.log('Dữ liệu nhập:', this.newPromotion);
//     if (this.validatePromotion(this.newPromotion)) {
//       const promotionWithStatus: Promotion = {
//         ...this.newPromotion,
//         status: this.calculateStatus(this.newPromotion.time)
//       };
//       try {
//         await this.promotionService.addPromotion(promotionWithStatus);
//         this.loadPromotions(); // Reload to reflect new promotion
//         this.closeAddModal(); // Automatically close modal after save
//         console.log('Khuyến mãi đã lưu, imageUrl:', promotionWithStatus.imageUrl);
//       } catch (error: any) {
//         console.error('Lỗi khi thêm khuyến mãi:', error);
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin.');
//     }
//   }

//   filterPromotions(event: Event): void {
//     const status = (event.target as HTMLSelectElement).value;
//     if (status === 'all') {
//       this.filteredPromotions = [...this.promotions];
//     } else {
//       this.filteredPromotions = this.promotions.filter(p => p.status === status);
//     }
//   }

//   editPromotion(index: number): void {
//     this.editedPromotion = { ...this.promotions[index] };
//     this.isEditModalOpen = true;
//   }

//   async updatePromotion(): Promise<void> {
//     if (this.validatePromotion(this.editedPromotion)) {
//       const promotionWithStatus: Promotion = {
//         ...this.editedPromotion,
//         status: this.calculateStatus(this.editedPromotion.time)
//       };
//       try {
//         await this.promotionService.updatePromotion(promotionWithStatus); // Assume this method exists
//         this.loadPromotions();
//         this.closeEditModal();
//       } catch (error: any) {
//         console.error('Lỗi khi cập nhật khuyến mãi:', error);
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin.');
//     }
//   }

//   async deletePromotion(index: number): void {
//     if (confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
//       try {
//         await this.promotionService.deletePromotion(this.promotions[index].id!); // Assume id exists
//         this.loadPromotions();
//       } catch (error: any) {
//         console.error('Lỗi khi xóa khuyến mãi:', error);
//       }
//     }
//   }

//   logChange(field: string, value: any): void {
//     console.log(`Field ${field} changed to:`, value);
//   }
// }

// import { Component, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Promotion } from '../../model/promotion';
// import { PromotionService } from '../../services/promotion.service';

// @Component({
//   selector: 'app-promotions',
//   standalone: false,
//   templateUrl: './promotions.component.html',
//   styleUrls: ['./promotions.component.css'],
// })
// export class PromotionsComponent implements OnInit {
//   isAddModalOpen = false;
//   isEditModalOpen = false;
//   filteredPromotions: Promotion[] = [];
//   promotions: Promotion[] = [];
//   newPromotion: Promotion = {
//     title: '',
//     description: '',
//     time: new Date().toISOString(),
//     imageUrl: ''
//   };
//   editedPromotion: Promotion = { title: '', description: '', time: '', imageUrl: '' };

//   private promotionService: PromotionService;

//   constructor() {
//     this.promotionService = inject(PromotionService);
//   }

//   ngOnInit(): void {
//     this.loadPromotions();
//   }

//   validatePromotion(promotion: Promotion): boolean {
//     console.log('Validating promotion:', promotion);
//     const isTitleValid = !!promotion.title && promotion.title.trim().length > 0;
//     const isDescriptionValid = !!promotion.description && promotion.description.trim().length > 0;
//     const isTimeValid = !!promotion.time && this.isValidDate(promotion.time);
//     const isImageUrlValid = !!promotion.imageUrl && promotion.imageUrl.trim().length > 0;
//     console.log('Validation results:', { isTitleValid, isDescriptionValid, isTimeValid, isImageUrlValid });
//     return isTitleValid && isDescriptionValid && isTimeValid && isImageUrlValid;
//   }

//   private isValidDate(dateStr: string): boolean {
//     const date = new Date(dateStr);
//     return date instanceof Date && !isNaN(date.getTime());
//   }

//   calculateStatus(time: string): 'scheduled' | 'sent' {
//     const promotionTime = new Date(time).getTime();
//     const currentTime = new Date().getTime();
//     return promotionTime > currentTime ? 'scheduled' : 'sent';
//   }

//   loadPromotions(): void {
//     this.promotionService.getPromotions().subscribe({
//       next: (data: Promotion[]) => {
//         this.promotions = data.map(p => {
//           let timeStr: string;
//           if (p.time === null || p.time === undefined) {
//             console.warn('Null or undefined time for promotion:', p);
//             timeStr = new Date().toISOString();
//           } else if (typeof p.time === 'string') {
//             timeStr = this.isValidDate(p.time) ? p.time : new Date().toISOString();
//             if (!this.isValidDate(p.time)) console.warn('Invalid string time format, using fallback:', p.time);
//           } else {
//             console.error('Unrecognized time format for promotion:', p.time);
//             timeStr = new Date().toISOString();
//           }
//           return {
//             ...p,
//             time: timeStr,
//             status: p.status || this.calculateStatus(timeStr)
//           };
//         });
//         this.filterPromotions({ target: { value: 'all' } } as any);
//       },
//       error: (error: any) => console.error('Lỗi khi tải danh sách khuyến mãi:', error)
//     });
//   }

//   openAddModal(): void {
//     this.newPromotion = { title: '', description: '', time: new Date().toISOString(), imageUrl: '' };
//     this.isAddModalOpen = true;
//     console.log('Modal opened, initial newPromotion:', this.newPromotion);
//   }

//   closeAddModal(): void {
//     this.isAddModalOpen = false;
//   }

//   closeEditModal(): void {
//     this.isEditModalOpen = false;
//   }

//   async addPromotion(): Promise<void> {
//     console.log('Dữ liệu nhập:', this.newPromotion);
//     if (this.validatePromotion(this.newPromotion)) {
//       const promotionWithStatus: Promotion = {
//         ...this.newPromotion,
//         status: this.calculateStatus(this.newPromotion.time)
//       };
//       try {
//         await this.promotionService.addPromotion(promotionWithStatus);
//         this.loadPromotions();
//         this.closeAddModal();
//         console.log('Khuyến mãi đã lưu, imageUrl:', promotionWithStatus.imageUrl);
//       } catch (error: any) {
//         console.error('Lỗi khi thêm khuyến mãi:', error);
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin.');
//     }
//   }

//   filterPromotions(event: Event): void {
//     const status = (event.target as HTMLSelectElement).value;
//     if (status === 'all') {
//       this.filteredPromotions = [...this.promotions];
//     } else {
//       this.filteredPromotions = this.promotions.filter(p => p.status === status);
//     }
//   }

//   editPromotion(index: number): void {
//     this.editedPromotion = { ...this.promotions[index] };
//     this.isEditModalOpen = true;
//   }

//   async updatePromotion(): Promise<void> {
//     if (this.validatePromotion(this.editedPromotion)) {
//       const promotionWithStatus: Promotion = {
//         ...this.editedPromotion,
//         status: this.calculateStatus(this.editedPromotion.time)
//       };
//       try {
//         await this.promotionService.updatePromotion(promotionWithStatus);
//         this.loadPromotions();
//         this.closeEditModal();
//       } catch (error: any) {
//         console.error('Lỗi khi cập nhật khuyến mãi:', error);
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin.');
//     }
//   }

//   async deletePromotion(index: number): Promise<void> {
//     if (confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
//       try {
//         await this.promotionService.deletePromotion(this.promotions[index].id!);
//         this.loadPromotions();
//       } catch (error: any) {
//         console.error('Lỗi khi xóa khuyến mãi:', error);
//       }
//     }
//   }

//   logChange(field: string, value: any): void {
//     console.log(`Field ${field} changed to:`, value);
//   }
// }

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Promotion } from '../../model/promotion';
import { PromotionService } from '../../services/promotion.service';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
})
export class PromotionsComponent implements OnInit {
  isAddModalOpen = false;
  isEditModalOpen = false;
  filteredPromotions: Promotion[] = [];
  promotions: Promotion[] = [];
  newPromotion: Promotion = {
    title: '',
    description: '',
    time: new Date().toISOString(),
    imageUrl: ''
  };
  editedPromotion: Promotion = { title: '', description: '', time: '', imageUrl: '' };

  private promotionService: PromotionService;

  constructor() {
    this.promotionService = inject(PromotionService);
  }

  ngOnInit(): void {
    this.loadPromotions();
  }

  validatePromotion(promotion: Promotion): boolean {
    console.log('Validating promotion:', promotion);
    const isTitleValid = !!promotion.title && promotion.title.trim().length > 0;
    const isDescriptionValid = !!promotion.description && promotion.description.trim().length > 0;
    const isTimeValid = !!promotion.time && this.isValidDate(promotion.time);
    const isImageUrlValid = !!promotion.imageUrl && promotion.imageUrl.trim().length > 0;
    console.log('Validation results:', { isTitleValid, isDescriptionValid, isTimeValid, isImageUrlValid });
    return isTitleValid && isDescriptionValid && isTimeValid && isImageUrlValid;
  }

  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  }

  calculateStatus(time: string): 'scheduled' | 'sent' {
    const promotionTime = new Date(time).getTime();
    const currentTime = new Date().getTime();
    return promotionTime > currentTime ? 'scheduled' : 'sent';
  }

  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe({
      next: (data: Promotion[]) => {
        this.promotions = data.map(p => {
          let timeStr: string;
          if (p.time === null || p.time === undefined) {
            console.warn('Null or undefined time for promotion:', p);
            timeStr = new Date().toISOString();
          } else if (typeof p.time === 'string') {
            timeStr = this.isValidDate(p.time) ? p.time : new Date().toISOString();
            if (!this.isValidDate(p.time)) console.warn('Invalid string time format, using fallback:', p.time);
          } else {
            console.error('Unrecognized time format for promotion:', p.time);
            timeStr = new Date().toISOString();
          }
          return {
            ...p,
            time: timeStr,
            status: p.status || this.calculateStatus(timeStr)
          };
        });
        this.filterPromotions({ target: { value: 'all' } } as any);
      },
      error: (error: any) => console.error('Lỗi khi tải danh sách khuyến mãi:', error)
    });
  }

  openAddModal(): void {
    this.newPromotion = { title: '', description: '', time: new Date().toISOString(), imageUrl: '' };
    this.isAddModalOpen = true;
    console.log('Modal opened, initial newPromotion:', this.newPromotion);
  }

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  async addPromotion(): Promise<void> {
    console.log('Dữ liệu nhập:', this.newPromotion);
    if (this.validatePromotion(this.newPromotion)) {
      const promotionWithStatus: Promotion = {
        ...this.newPromotion,
        time: new Date(this.newPromotion.time).toISOString(),
        status: this.calculateStatus(this.newPromotion.time)
      };
      try {
        await this.promotionService.addPromotion(promotionWithStatus);
        this.loadPromotions();
        this.closeAddModal();
        console.log('Khuyến mãi đã lưu, imageUrl:', promotionWithStatus.imageUrl);
      } catch (error: any) {
        console.error('Lỗi khi thêm khuyến mãi:', error);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  filterPromotions(event: Event): void {
    const status = (event.target as HTMLSelectElement).value;
    if (status === 'all') {
      this.filteredPromotions = [...this.promotions];
    } else {
      this.filteredPromotions = this.promotions.filter(p => p.status === status);
    }
  }

  editPromotion(index: number): void {
    this.editedPromotion = { ...this.promotions[index] };
    this.isEditModalOpen = true;
  }

  async updatePromotion(): Promise<void> {
    if (this.validatePromotion(this.editedPromotion)) {
      const promotionWithStatus: Promotion = {
        ...this.editedPromotion,
        status: this.calculateStatus(this.editedPromotion.time)
      };
      try {
        await this.promotionService.updatePromotion(promotionWithStatus);
        this.loadPromotions();
        this.closeEditModal();
      } catch (error: any) {
        console.error('Lỗi khi cập nhật khuyến mãi:', error);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin.');
    }
  }

  async deletePromotion(index: number): Promise<void> {
    if (confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
      try {
        await this.promotionService.deletePromotion(this.promotions[index].id!);
        this.loadPromotions();
      } catch (error: any) {
        console.error('Lỗi khi xóa khuyến mãi:', error);
      }
    }
  }

  logChange(field: string, value: any): void {
    console.log(`Field ${field} changed to:`, value);
  }
}