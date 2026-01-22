import { Component, signal, viewChild, ElementRef, effect, afterNextRender } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Ship {
  id: number;
  name: string;
  type: string;
  status: string;
  image: string;
  location: string;
}

@Component({
  selector: 'app-home',
  imports: [
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule,
    NzSkeletonModule,
    NzSpinModule,
    NzGridModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  inputValue = signal('');
  inputElement = viewChild<ElementRef<HTMLInputElement>>('inputField');
  isLoading = signal(true);
  ships = signal<Ship[]>([]);
  allShips: Ship[] = [];
  private searchSubject = new Subject<string>();

  constructor() {
    afterNextRender(() => {
      const element = this.inputElement();
      if (element) {
        element.nativeElement.focus();
      }
    });

    effect(() => {
      const element = this.inputElement();
      if (element) {
        element.nativeElement.focus();
      }
    });

    // Setup debounced search
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchTerm) => {
      this.performSearch(searchTerm);
    });

    this.loadShips();
  }

  onInputChange(value: string) {
    this.inputValue.set(value);
    this.searchSubject.next(value);
  }

  performSearch(searchTerm: string) {
    console.log('Searching for:', searchTerm);
    this.isLoading.set(true);
    console.log('Loading set to true');

    // Mock search with setTimeout
    setTimeout(() => {
      console.log('Search completed');
      if (!searchTerm.trim()) {
        this.ships.set(this.allShips);
      } else {
        const filtered = this.allShips.filter(
          (ship) =>
            ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ship.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ship.location.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        this.ships.set(filtered);
      }
      console.log('Loading set to false');
      this.isLoading.set(false);
    }, 800);
  }

  loadShips() {
    console.log('Initial loading started');
    // Simulate initial loading
    setTimeout(() => {
      this.allShips = [
        {
          id: 1,
          name: 'Ocean Voyager',
          type: 'Container Ship',
          status: 'En Route',
          image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400',
          location: 'Pacific Ocean',
        },
        {
          id: 2,
          name: 'Sea Master',
          type: 'Cargo Ship',
          status: 'Docked',
          image: 'https://images.unsplash.com/photo-1605300177633-4bfe677c8dae?w=400',
          location: 'Port of Singapore',
        },
        {
          id: 3,
          name: 'Pacific Dream',
          type: 'Tanker',
          status: 'En Route',
          image: 'https://images.unsplash.com/photo-1593859140033-9b8d41b2f934?w=400',
          location: 'Indian Ocean',
        },
        {
          id: 4,
          name: 'Atlantic Pride',
          type: 'Bulk Carrier',
          status: 'Maintenance',
          image: 'https://images.unsplash.com/photo-1570057836111-e6b5b6e2f7a3?w=400',
          location: 'Port of Rotterdam',
        },
        {
          id: 5,
          name: 'Nordic Star',
          type: 'Container Ship',
          status: 'En Route',
          image: 'https://images.unsplash.com/photo-1541410080421-f9f6f40f5b43?w=400',
          location: 'North Sea',
        },
        {
          id: 6,
          name: 'Mediterranean Queen',
          type: 'Cruise Ship',
          status: 'Docked',
          image: 'https://images.unsplash.com/photo-1621277224630-81a3c46e0299?w=400',
          location: 'Port of Barcelona',
        },
      ];
      this.ships.set(this.allShips);
      console.log('Initial loading completed, ships loaded:', this.allShips.length);
      this.isLoading.set(false);
      console.log('Loading set to false');
    }, 2000);
  }

  onCheck() {
    const value = this.inputValue();
    if (value.trim()) {
      console.log('Checked value:', value);
      alert(`Giá trị đã nhập: ${value}`);
    } else {
      alert('Vui lòng nhập giá trị!');
    }
  }

  onClear() {
    this.inputValue.set('');
    this.inputElement()?.nativeElement.focus();
  }
}
