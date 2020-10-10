import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoilComponent } from './coil.component';

describe('CoilComponent', () => {
  let component: CoilComponent;
  let fixture: ComponentFixture<CoilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
