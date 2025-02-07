import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaViewerSliderComponent } from './media-viewer-slider.component';

describe('MediaViewerSliderComponent', () => {
  let component: MediaViewerSliderComponent;
  let fixture: ComponentFixture<MediaViewerSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediaViewerSliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaViewerSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
