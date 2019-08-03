import { Component, OnInit, Input } from '@angular/core';
import { Village, PlayerColor, City, Street } from 'src/app/models/catan.models';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.css']
})
export class PricesComponent {

  @Input() color: PlayerColor = PlayerColor.white;
  get village(): Village {
    return new Village(this.color);
  }

  get city(): City {
    return new City(this.color);
  }

  get street(): Street {
    return new Street(this.color);
  }
  constructor() { }
}
