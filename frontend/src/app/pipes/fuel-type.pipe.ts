import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fuelType'
})
export class FuelTypePipe implements PipeTransform {
  private fuelMap: Record<string, string> = {
    diesel: 'Dizel',
    petrol: 'Benzin',
    hybrid: 'Hibrid'
  };

  private transmissionMap: Record<string, string> = {
    manual: 'Manuelni',
    automatic: 'Automatik'
  };

  transform(value: string, type: 'fuel' | 'transmission' = 'fuel'): string {
    if (!value) return value;
    return type === 'transmission'
      ? (this.transmissionMap[value] ?? value)
      : (this.fuelMap[value] ?? value);
  }
}
