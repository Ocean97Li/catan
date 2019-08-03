import { Component, OnInit, Input } from '@angular/core';
import { Crossroad } from 'src/app/models/catan.models';

@Component({
  selector: 'app-crossroad',
  templateUrl: './crossroad.component.html',
  styleUrls: ['./crossroad.component.css']
})
export class CrossroadComponent implements OnInit {
  @Input()
  crossroad: Crossroad;
  constructor() { }

  ngOnInit() {
  }

  coordsToPosition() {
    let position = {
      left: '',
      top: ''
    };
    let left = 0;
    let top = 0;
    this.crossroad.coordinates.forEach(coords => {
      left += coords.y * 100;
      top += coords.x * 86;
      left += coords.x * 50;
    });
    left = Math.round(left / 3);
    top = Math.round(top / 3);
    position = {
      ...position,
      left: `${left}px`,
      top: `${top}px`
    };
    return { ...position };
  }

}
