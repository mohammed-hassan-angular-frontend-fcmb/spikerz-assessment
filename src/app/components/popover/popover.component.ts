import { Component, inject, OnInit, OnDestroy, ElementRef, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverService } from '../../services/popover.service';
import { PopoverData } from '../../models/graph.models';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popover.component.html',
  styleUrl: './popover.component.scss'
})
export class PopoverComponent implements OnInit, OnDestroy {
  @ViewChild('popoverElement', { static: false }) popoverElement!: ElementRef;

  private popoverService = inject(PopoverService);

  // Component state
  isVisible = false;
  popoverData: PopoverData | null = null;
  position = { x: 0, y: 0 };

  // Expose Object for template use
  Object = Object;

  constructor() {
    // Use effects to react to signal changes
    effect(() => {
      this.isVisible = this.popoverService.isVisible();
      if (this.isVisible) {
        this.updatePosition();
      }
    });

    effect(() => {
      this.popoverData = this.popoverService.popoverData();
      if (this.popoverData) {
        this.position = { ...this.popoverData.position };
        this.updatePosition();
      }
    });
  }

  ngOnInit(): void {
    // Effects are already set up in constructor
  }

  ngOnDestroy(): void {
    // Effects are automatically cleaned up
  }

  private updatePosition(): void {
    if (!this.popoverData) return;

    // Adjust position to prevent popover from going off-screen
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const popoverWidth = 320; // Approximate popover width
    const popoverHeight = 200; // Approximate popover height

    let x = this.popoverData.position.x;
    let y = this.popoverData.position.y;

    // Adjust horizontal position
    if (x + popoverWidth > viewportWidth) {
      x = viewportWidth - popoverWidth - 20;
    }
    if (x < 20) {
      x = 20;
    }

    // Adjust vertical position
    if (y + popoverHeight > viewportHeight) {
      y = y - popoverHeight - 20;
    }
    if (y < 20) {
      y = 20;
    }

    this.position = { x, y };
  }

  onClose(): void {
    this.popoverService.hidePopover();
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  getStatusColor(status: string): string {
    const colors = {
      critical: 'text-danger-600 bg-danger-50',
      high: 'text-warning-600 bg-warning-50',
      medium: 'text-success-600 bg-success-50',
      low: 'text-primary-600 bg-primary-50'
    };
    return colors[status as keyof typeof colors] || colors.low;
  }

  getStatusIcon(status: string): string {
    const icons = {
      critical: 'pi-exclamation-triangle',
      high: 'pi-exclamation-circle',
      medium: 'pi-info-circle',
      low: 'pi-check-circle'
    };
    return icons[status as keyof typeof icons] || icons.low;
  }
}
