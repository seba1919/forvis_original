import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxsatComponent } from './maxsat.component';

describe('MaxsatComponent', () => {
  let component: MaxsatComponent;
  let fixture: ComponentFixture<MaxsatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaxsatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxsatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
