import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfinvoiceComponent } from './pdfinvoice.component';

describe('PdfinvoiceComponent', () => {
  let component: PdfinvoiceComponent;
  let fixture: ComponentFixture<PdfinvoiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfinvoiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfinvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
