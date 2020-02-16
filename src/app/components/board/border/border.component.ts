import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Border } from 'src/app/models/catan.models';

@Component({
  selector: 'app-border',
  templateUrl: './border.component.html',
  styleUrls: ['./border.component.css']
})
export class BorderComponent implements OnInit {
  @Input() border: Border;
  @Output() build = new EventEmitter<Border>();
  constructor() { }

  ngOnInit() {
  }

  get styles() {
    if (this.border.street) {
      return {...this.coordsToPosition(), ...this.streetColor};
    }
    return {...this.coordsToPosition()};
  }

  coordsToPosition() {
    let position = {
      left: '',
      top: ''
    };
    let left = 0;
    let top = 0;
    this.border.coordinates.forEach(coords => {
      left += coords.y * 100;
      top += coords.x * 86;
      left += coords.x * 50;
    });
    left = Math.round(left / 2);
    top = Math.round(top / 2);
    position = {
      ...position,
      left: `${left}px`,
      top: `${top}px`
    };
    return { ...position };
  }

  get streetColor(): any {
    return {
        'background-color': `var(--${this.border.street.color})`
    };
  }

  get correctRotation(): string {
    // if x coords are equal do nothing
    if (this.border.coordinates[0].x !== this.border.coordinates[1].x) {
      // if y cords are equal rotate 120deg
      if (this.border.coordinates[0].y === this.border.coordinates[1].y) {
        return 'rotate120';
      } else {
        // if z cords are equal rotate -120deg
        if (this.border.coordinates[0].z === this.border.coordinates[1].z) {
          return 'rotate-120';
        }
      }
    }
    return '';
  }

}
