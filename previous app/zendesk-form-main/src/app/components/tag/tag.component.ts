import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent {
  @Input() tag: string = '';
  @Output() removed = new EventEmitter<string>();

  get initial(): string {
    return this.tag.charAt(0).toUpperCase();
  }

  get displayName(): string {
    const atIndex = this.tag.indexOf('@');
    if (atIndex > 0) {
      return this.tag.substring(0, atIndex);
    }
    return this.tag;
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.removed.emit(this.tag);
  }
}
