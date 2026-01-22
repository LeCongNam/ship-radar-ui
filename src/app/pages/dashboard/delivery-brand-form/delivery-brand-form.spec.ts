import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBrandForm } from './delivery-brand-form.module';

describe('DeliveryBrandForm', () => {
  let component: DeliveryBrandForm;
  let fixture: ComponentFixture<DeliveryBrandForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryBrandForm],
    }).compileComponents();

    fixture = TestBed.createComponent(DeliveryBrandForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
