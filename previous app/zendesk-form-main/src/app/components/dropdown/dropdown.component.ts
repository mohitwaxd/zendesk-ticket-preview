import { Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { DropdownOption } from '../../types';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent {
  @Input() dropdownOptions: DropdownOption[] = [];
  @Input() selectedOption: DropdownOption | null = null;
  @Input() label: string = 'Select';
  @Input() placeholder: string = 'Select';
  @Input() disabled: boolean = false;
  @Output() optionSelected = new EventEmitter<DropdownOption>();

  isDropdownOpen = false;

  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (!this.dropdownContainer.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: DropdownOption): void {
    this.selectedOption = option;
    this.optionSelected.emit(option);
    this.isDropdownOpen = false;
  }
}
