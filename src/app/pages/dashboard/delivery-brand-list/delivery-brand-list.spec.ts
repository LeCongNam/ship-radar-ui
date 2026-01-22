import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryBrandList } from './delivery-brand-list';

describe('DeliveryBrandList', () => {
  let component: DeliveryBrandList;
  let fixture: ComponentFixture<DeliveryBrandList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryBrandList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryBrandList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
