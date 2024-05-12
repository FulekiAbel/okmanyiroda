import {Component} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';

/**
 * @title Basic buttons
 */
@Component({
  selector: 'app-home',
  templateUrl: './buttons.component.html',
  styleUrl: 'buttons.component.scss',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule],
})
export class ButtonOverviewExample {}

export class ButtonsComponent {
}
