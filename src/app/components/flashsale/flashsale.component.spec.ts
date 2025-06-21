import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashsaleManagementComponent } from './flashsale.component';

describe('FlashsaleManagementComponent', () => {
  let component: FlashsaleManagementComponent;
  let fixture: ComponentFixture<FlashsaleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FlashsaleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashsaleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
