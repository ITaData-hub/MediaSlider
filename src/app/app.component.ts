import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MediaViewerSliderComponent } from "./media-viewer-slider/media-viewer-slider.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MediaViewerSliderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'MediaSlider';
}
