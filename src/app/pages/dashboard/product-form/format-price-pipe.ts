import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice',
})
export class FormatPricePipe implements PipeTransform {
  transform(value: string, exponent: string = ''): unknown {
    try {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: exponent ? parseInt(exponent) : 0,
      }).format(Number(value));
    } catch (error) {
      console.error('formatPrice Pipe error:', error);

      return value;
    }
  }
}
