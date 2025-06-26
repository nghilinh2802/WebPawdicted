import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Promotion } from '../../model/promotion';
import { PromotionService } from '../../services/promotion.service';
import { interval, Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-promotions',
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.css'],
  standalone: false,
})
export class PromotionsComponent implements OnInit, OnDestroy {
  isAddModalOpen = false;
  isEditModalOpen = false;
  promotions: Promotion[] = [];
  filteredPromotions: Promotion[] = [];
  newPromotionTimeStr = '';
  editedPromotionTimeStr = '';

  newPromotion: Promotion = {
    title: '',
    description: '',
    time: Timestamp.fromDate(new Date()),
    imageUrl: ''
  };
  editedPromotion: Promotion = { title: '', description: '', time: Timestamp.fromDate(new Date()), imageUrl: '' };

  private promotionService = inject(PromotionService);
  private autoStatusUpdateSub!: Subscription;

  ngOnInit(): void {
    this.loadPromotions();

    this.autoStatusUpdateSub = interval(60000).subscribe(() => {
      this.promotions.forEach(p => this.updatePromotionStatusIfNeeded(p));
    });
  }

  ngOnDestroy(): void {
    if (this.autoStatusUpdateSub) {
      this.autoStatusUpdateSub.unsubscribe();
    }
  }

  calculateStatus(time: Timestamp): 'scheduled' | 'sent' {
    const promotionTime = time.toDate().getTime();
    const now = Date.now();
    return promotionTime > now ? 'scheduled' : 'sent';
  }

  validatePromotion(promotion: Promotion): boolean {
    return (
      !!promotion.title?.trim() &&
      !!promotion.description?.trim() &&
      !!promotion.imageUrl?.trim() &&
      promotion.time instanceof Timestamp
    );
  }

  async updatePromotionStatusIfNeeded(promotion: Promotion): Promise<void> {
    const realStatus = this.calculateStatus(promotion.time);
    if (promotion.status !== realStatus) {
      try {
        await this.promotionService.updatePromotion({
          ...promotion,
          status: realStatus
        });
        promotion.status = realStatus;
      } catch (error) {
        console.error(`Lỗi cập nhật trạng thái cho "${promotion.title}"`, error);
      }
    }
  }

  loadPromotions(): void {
    this.promotionService.getPromotions().subscribe({
      next: (data: Promotion[]) => {
        this.promotions = data.filter(p => p.time instanceof Timestamp);
        this.promotions.forEach(p => this.updatePromotionStatusIfNeeded(p));
        this.filterPromotions({ target: { value: 'all' } } as any);
      },
      error: (err) => console.error('Lỗi khi tải khuyến mãi:', err)
    });
  }

  filterPromotions(event: Event): void {
    const filter = (event.target as HTMLSelectElement).value;
    this.filteredPromotions =
      filter === 'all'
        ? [...this.promotions]
        : this.promotions.filter(p => this.calculateStatus(p.time) === filter);
  }

  openAddModal(): void {
  this.newPromotion = {
    title: '',
    description: '',
    time: Timestamp.fromDate(new Date()),
    imageUrl: ''
  };
  this.newPromotionTimeStr = this.formatDateInput(this.newPromotion.time.toDate());
  this.isAddModalOpen = true;
}

  closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  async addPromotion(): Promise<void> {
    const timeDate = new Date(this.newPromotionTimeStr);
    if (isNaN(timeDate.getTime())) {
      alert('Invalid date and time. Please select a valid date and time.');
      return;
    }
    const promotionToAdd: Promotion = {
      ...this.newPromotion,
      time: Timestamp.fromDate(timeDate),
      status: this.calculateStatus(Timestamp.fromDate(timeDate))
    };
    if (this.validatePromotion(promotionToAdd)) {
      try {
        await this.promotionService.addPromotion(promotionToAdd);
        this.loadPromotions();
        this.closeAddModal();
      } catch (err) {
        console.error('Lỗi thêm khuyến mãi:', err, 'with promotion:', promotionToAdd);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin hợp lệ.');
    }
  }

  editPromotion(index: number): void {
    this.editedPromotion = { ...this.filteredPromotions[index] };
    this.editedPromotionTimeStr = this.formatDateInput(this.editedPromotion.time.toDate());
    this.isEditModalOpen = true;
  }

  formatDateInput(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  async updatePromotion(): Promise<void> {
    const timeDate = new Date(this.editedPromotionTimeStr);
    if (isNaN(timeDate.getTime())) {
      alert('Invalid date and time. Please select a valid date and time.');
      return;
    }
    const updated: Promotion = {
      ...this.editedPromotion,
      time: Timestamp.fromDate(timeDate),
      status: this.calculateStatus(Timestamp.fromDate(timeDate))
    };
    if (this.validatePromotion(updated)) {
      try {
        await this.promotionService.updatePromotion(updated);
        this.loadPromotions();
        this.closeEditModal();
      } catch (err) {
        console.error('Lỗi cập nhật khuyến mãi:', err, 'with promotion:', updated);
      }
    } else {
      alert('Vui lòng nhập đầy đủ thông tin hợp lệ.');
    }
  }

  async deletePromotion(index: number): Promise<void> {
    const promotion = this.filteredPromotions[index];
    if (confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
      try {
        await this.promotionService.deletePromotion(promotion.id!);
        this.loadPromotions();
      } catch (err) {
        console.error('Lỗi xóa khuyến mãi:', err);
      }
    }
  }
}



// import { Component, OnInit, OnDestroy, inject } from '@angular/core';
// import { Promotion } from '../../model/promotion';
// import { PromotionService } from '../../services/promotion.service';
// import { interval, Subscription } from 'rxjs';

// @Component({
//   selector: 'app-promotions',
//   templateUrl: './promotions.component.html',
//   styleUrls: ['./promotions.component.css'],
//   standalone: false,
// })
// export class PromotionsComponent implements OnInit, OnDestroy {
//   isAddModalOpen = false;
//   isEditModalOpen = false;
//   promotions: Promotion[] = [];
//   filteredPromotions: Promotion[] = [];

//   newPromotion: Promotion = {
//     title: '',
//     description: '',
//     time: new Date().toISOString(),
//     imageUrl: ''
//   };
//   editedPromotion: Promotion = { title: '', description: '', time: '', imageUrl: '' };

//   private promotionService = inject(PromotionService);
//   private autoStatusUpdateSub!: Subscription;

//   ngOnInit(): void {
//     this.loadPromotions();

//     // Cập nhật trạng thái mỗi 60 giây
//     this.autoStatusUpdateSub = interval(60000).subscribe(() => {
//       this.promotions.forEach(p => this.updatePromotionStatusIfNeeded(p));
//     });
//   }

//   ngOnDestroy(): void {
//     if (this.autoStatusUpdateSub) {
//       this.autoStatusUpdateSub.unsubscribe();
//     }
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

//   validatePromotion(promotion: Promotion): boolean {
//     return (
//       !!promotion.title?.trim() &&
//       !!promotion.description?.trim() &&
//       !!promotion.imageUrl?.trim() &&
//       this.isValidDate(promotion.time)
//     );
//   }

//   async updatePromotionStatusIfNeeded(promotion: Promotion): Promise<void> {
//     const realStatus = this.calculateStatus(promotion.time);
//     if (promotion.status !== realStatus) {
//       try {
//         await this.promotionService.updatePromotion({
//           ...promotion,
//           status: realStatus
//         });
//         promotion.status = realStatus; // cập nhật local
//       } catch (error) {
//         console.error(`Lỗi cập nhật trạng thái cho "${promotion.title}"`, error);
//       }
//     }
//   }

//   loadPromotions(): void {
//     this.promotionService.getPromotions().subscribe({
//       next: (data: Promotion[]) => {
//         this.promotions = data.map(p => ({
//           ...p,
//           time: this.isValidDate(p.time) ? p.time : new Date().toISOString()
//         }));
//         this.promotions.forEach(p => this.updatePromotionStatusIfNeeded(p));
//         this.filterPromotions({ target: { value: 'all' } } as any);
//       },
//       error: (err) => console.error('Lỗi khi tải khuyến mãi:', err)
//     });
//   }

//   filterPromotions(event: Event): void {
//     const filter = (event.target as HTMLSelectElement).value;
//     this.filteredPromotions =
//       filter === 'all'
//         ? [...this.promotions]
//         : this.promotions.filter(p => this.calculateStatus(p.time) === filter);
//   }

//   openAddModal(): void {
//     this.newPromotion = { title: '', description: '', time: new Date().toISOString(), imageUrl: '' };
//     this.isAddModalOpen = true;
//   }

//   closeAddModal(): void {
//     this.isAddModalOpen = false;
//   }

//   closeEditModal(): void {
//     this.isEditModalOpen = false;
//   }

//   async addPromotion(): Promise<void> {
//     if (this.validatePromotion(this.newPromotion)) {
//       const promotionToAdd = {
//         ...this.newPromotion,
//         time: new Date(this.newPromotion.time).toISOString(),
//         status: this.calculateStatus(this.newPromotion.time)
//       };
//       try {
//         await this.promotionService.addPromotion(promotionToAdd);
//         this.loadPromotions();
//         this.closeAddModal();
//       } catch (err) {
//         console.error('Lỗi thêm khuyến mãi:', err);
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin hợp lệ.');
//     }
//   }

//   editPromotion(index: number): void {
//     this.editedPromotion = { ...this.filteredPromotions[index] };
//     this.isEditModalOpen = true;
//   }

//   async updatePromotion(): Promise<void> {
//     if (this.validatePromotion(this.editedPromotion)) {
//       const updated = {
//         ...this.editedPromotion,
//         time: new Date(this.editedPromotion.time).toISOString(),
//         status: this.calculateStatus(this.editedPromotion.time)
//       };
//       try {
//         await this.promotionService.updatePromotion(updated);
//         this.loadPromotions();
//         this.closeEditModal();
//       } catch (err) {
//         console.error('Lỗi cập nhật khuyến mãi:', err);
//       }
//     } else {
//       alert('Vui lòng nhập đầy đủ thông tin hợp lệ.');
//     }
//   }

//   async deletePromotion(index: number): Promise<void> {
//     const promotion = this.filteredPromotions[index];
//     if (confirm('Bạn có chắc muốn xóa khuyến mãi này?')) {
//       try {
//         await this.promotionService.deletePromotion(promotion.id!);
//         this.loadPromotions();
//       } catch (err) {
//         console.error('Lỗi xóa khuyến mãi:', err);
//       }
//     }
//   }
// }
