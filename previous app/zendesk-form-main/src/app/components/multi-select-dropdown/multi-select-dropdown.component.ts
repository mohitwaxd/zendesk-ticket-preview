import { Component, ElementRef, EventEmitter, HostListener, ViewChild, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserChipComponent } from '../user-chip/user-chip.component';
import { User } from '../../types';

@Component({
  selector: 'app-multi-select-dropdown',
  standalone: true,
  imports: [FormsModule, UserChipComponent],
  templateUrl: './multi-select-dropdown.component.html',
  styleUrls: ['./multi-select-dropdown.component.scss'],
})
export class MultiSelectDropdownComponent {
  @Input() options: User[] = [];
  @Input() selectedOptions: User[] = [];
  @Input() label: string = 'To:';
  @Input() placeholder: string = 'Search...';
  @Output() selectionChange = new EventEmitter<User[]>();
  
  @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;

  isDropdownOpen = false;
  searchTerm: string = '';

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent): void {
    if (!this.dropdownContainer.nativeElement.contains(event.target) && !this.dropdownMenu?.nativeElement.contains(event.target) && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }
  
  get filteredOptions(): User[] {
    
    const term = this.searchTerm.toLowerCase();
    
    return this.options.filter(
      (option) =>
        (option.name.toLowerCase().includes(term) ||
      option.email.toLowerCase().includes(term))
    );
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.searchTerm = '';
    }
  }

  selectOption(event: MouseEvent, option: User): void {
    event.stopPropagation();

    if (this.isOptionSelected(option)) {
        this.selectedOptions = this.selectedOptions.filter((selected) => selected.id !== option.id);
    } else {
        this.selectedOptions = [...this.selectedOptions, option];
    }
    this.selectionChange.emit(this.selectedOptions);
  }

  removeOption(option: User): void {
    this.selectedOptions = this.selectedOptions.filter(
      (selected) => selected.id !== option.id,
    );
    this.selectionChange.emit(this.selectedOptions);
  }

  isOptionSelected(option: User): boolean {
    return this.selectedOptions.some((selected) => selected.id === option.id);
  }

  onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }
}
