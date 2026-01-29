import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../types';

@Component({
  selector: 'app-user-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss'],
})
export class UserChipComponent {
  @Input() user!: User;
  @Input() removable = true;
  @Output() removed = new EventEmitter<User>();

  get initial(): string {
    if (this.user.initial) {
      return this.user.initial;
    }

    return this.user.name.charAt(0).toUpperCase();
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.removed.emit(this.user);
  }
}
