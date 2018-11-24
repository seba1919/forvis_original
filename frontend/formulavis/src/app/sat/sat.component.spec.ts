import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SatComponent } from './sat.component';

describe('SatComponent', () => {
  let component: SatComponent;
  let fixture: ComponentFixture<SatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
