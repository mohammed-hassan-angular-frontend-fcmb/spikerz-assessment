import { Injectable, signal } from '@angular/core';
import { PopoverData } from '../models/graph.models';

@Injectable({
  providedIn: 'root'
})
export class PopoverService {
  // Signals for popover state
  private _isVisible = signal<boolean>(false);
  private _popoverData = signal<PopoverData | null>(null);

  // Public readonly signals
  readonly isVisible = this._isVisible.asReadonly();
  readonly popoverData = this._popoverData.asReadonly();

  constructor() { }

  // Actions
  showPopover(data: PopoverData): void {
    this._popoverData.set(data);
    this._isVisible.set(true);
  }

  hidePopover(): void {
    this._isVisible.set(false);
    // Delay clearing data to allow for exit animations
    setTimeout(() => {
      this._popoverData.set(null);
    }, 200);
  }

  updatePosition(x: number, y: number): void {
    const currentData = this._popoverData();
    if (currentData) {
      this._popoverData.set({
        ...currentData,
        position: { x, y }
      });
    }
  }
}
