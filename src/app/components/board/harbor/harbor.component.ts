import { Component, OnInit, Input } from '@angular/core';
import { Harbor, HarborType } from 'src/app/models/catan.models';

@Component({
  selector: 'app-harbor',
  templateUrl: './harbor.component.html',
  styleUrls: ['./harbor.component.css']
})
export class HarborComponent implements OnInit {
  @Input()
  harbor: Harbor;
  get text(): string {
        return this.harbor.type === HarborType.THREE_ANY_TO_ONE ? '3:1' : '2:1';
  }
  constructor() { }

  ngOnInit() {
  }

  coordsToPosition() {
    let position = {
      left: '',
      top: ''
    };
    let left: number;
    let top: number;
    left = this.harbor.location.coordinates.y * 100;
    top = this.harbor.location.coordinates.x * 86;
    left += this.harbor.location.coordinates.x * 50;
    position = {
      ...position,
      left: `${left}px`,
      top: `${top}px`
    };
    return { ...position };
  }

}
