import { Component, OnInit, Input } from '@angular/core';
import { Building, Village } from 'src/app/models/catan.models';

@Component({
  selector: 'app-building',
  templateUrl: './building.component.html',
  styleUrls: ['./building.component.css']
})
export class BuildingComponent implements OnInit {
  @Input()
  building: Building;
  constructor() { }

  get isVillage(): boolean {
    return this.building.points === 1;
  }

  color(isRoof: boolean): any {
    if (isRoof) {
      return {
        'border-bottom-color': `var(--${this.building.color})`
      };
    }
    return {
      'background-color': `var(--${this.building.color})`
    };
  }

  ngOnInit() {
  }

}
