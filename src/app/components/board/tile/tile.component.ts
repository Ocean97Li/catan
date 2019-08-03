import { Component, OnInit, Input } from '@angular/core';
import { Tile } from 'src/app/models/catan.models';

@Component({
  selector: 'app-tile',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.css']
})
export class TileComponent implements OnInit {
  @Input()
  tile: Tile;
  constructor() {
  }

  coordsToPosition() {
    let position = {
      left: '',
      top: ''
    };
    let left: number;
    let top: number;
    left = this.tile.coordinates.y * 100;
    top = this.tile.coordinates.x * 86;
    left += this.tile.coordinates.x * 50;
    position = {
      ...position,
      left: `${left}px`,
      top: `${top}px`
    };
    return { ...position };
  }

  ngOnInit() {
  }

}
