import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactivityGamePage } from './reactivity-game.page';

describe('ReactivityGamePage', () => {
  let component: ReactivityGamePage;
  let fixture: ComponentFixture<ReactivityGamePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ReactivityGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
