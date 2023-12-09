import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GamificationhubPage } from './gamificationhub.page';

describe('GamificationhubPage', () => {
  let component: GamificationhubPage;
  let fixture: ComponentFixture<GamificationhubPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(GamificationhubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
