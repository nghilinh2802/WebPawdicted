import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFirebaseComponent } from './check-firebase.component';

describe('CheckFirebaseComponent', () => {
  let component: CheckFirebaseComponent;
  let fixture: ComponentFixture<CheckFirebaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckFirebaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
