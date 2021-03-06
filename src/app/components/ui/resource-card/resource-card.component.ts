import { Component, OnInit, Input } from '@angular/core';
import { Resource } from 'src/app/models/catan.models';


@Component({
  selector: 'app-resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.css']
})
export class ResourceCardComponent implements OnInit {
  @Input() public resource: Resource;
  constructor() { }

  ngOnInit() {
  }

}
