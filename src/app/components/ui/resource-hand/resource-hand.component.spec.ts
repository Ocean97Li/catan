import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceHandComponent } from './resource-hand.component';

describe('ResourceHandComponent', () => {
  let component: ResourceHandComponent;
  let fixture: ComponentFixture<ResourceHandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourceHandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
