import { Component, OnInit, Input } from '@angular/core';
import { Resource } from 'src/app/models/catan.models';

@Component({
  selector: 'app-resource-hand',
  templateUrl: './resource-hand.component.html',
  styleUrls: ['./resource-hand.component.css']
})
export class ResourceHandComponent implements OnInit {
  @Input() resources: Resource[];
  constructor() { }

  get resourcesFiltered(): Resource[] {
    return this.resources.sort((a, b) => {
      if (a === b) {
        return 0;
      } else if (a > b) {
        return 1;
      } else {
        return -1;
      }
    });
  }

  ngOnInit() {
  }

}
