import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dices',
  templateUrl: './dices.component.html',
  styleUrls: ['./dices.component.css']
})
export class DicesComponent implements OnInit {
  @Input() dice1: number;
  @Input() dice2: number;
  constructor() { }

  ngOnInit() {
  }

}
