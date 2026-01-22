export interface DeliveryBrand {
  id: number;
  name: string;
  website?: string;
  hotline?: string;
  supportEmail?: string;
  supportPhone?: string;
  time_pickup_from?: string | Date;
  time_pickup_to?: string | Date;
  operating_hours?: string;
  opening_time?: string | Date;
  closing_time?: string | Date;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}
