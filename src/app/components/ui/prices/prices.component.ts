import { Component, Input } from '@angular/core';
import { Village, PlayerColor, City, Street, Resource } from 'src/app/models/catan.models';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent {

  @Input() color: PlayerColor;
  @Input() prices: Map<string, Resource[]>;

  get village(): Village {
    return new Village(this.color);
  }

  get city(): City {
    return new City(this.color);
  }

  get street(): Street {
    return new Street(this.color);
  }

  public getStreetColor(): any {
    return {
      'background-color': `var(--${this.street.color})`
    };
  }

  constructor() { }
}
