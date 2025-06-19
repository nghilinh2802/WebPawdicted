import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVariantModalComponent } from './edit-variant-modal.component';

describe('EditVariantModalComponent', () => {
  let component: EditVariantModalComponent;
  let fixture: ComponentFixture<EditVariantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditVariantModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditVariantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
