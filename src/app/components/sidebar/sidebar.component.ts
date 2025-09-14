import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarItem } from '../../models/graph.models';
import { GraphDataService } from '../../services/graph-data.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  private graphDataService = inject(GraphDataService);

  // Access signals from service
  readonly sidebarCollapsed = this.graphDataService.sidebarCollapsed;
  readonly nodeCount = this.graphDataService.nodeCount;
  readonly criticalNodes = this.graphDataService.criticalNodes;

  // Icons map to /assets/icons/*.svg as provided by the mock
  sidebarItems: SidebarItem[] = [
    { id: 'grid',      label: 'Lorem', icon: 'grid' },
    { id: 'alert',     label: 'Lorem', icon: 'warning' },
    { id: 'cube',      label: 'Lorem', icon: 'cube' },
    { id: 'collapse',  label: 'Lorem', icon: 'inward', active: true },
    { id: 'plug',      label: 'Lorem', icon: 'plug' },
    { id: 'file',      label: 'Lorem', icon: 'file' },
    { id: 'align',     label: 'Lorem', icon: 'align' },
    { id: 'settings',  label: 'Lorem', icon: 'gear' },
    { id: 'bell',      label: 'Lorem', icon: 'notification' }
  ];

  get topItems(): SidebarItem[] { return this.sidebarItems.slice(0, 7); }
  get bottomItems(): SidebarItem[] { return this.sidebarItems.slice(7); }
  get activeItem(): SidebarItem | undefined { return this.sidebarItems.find(i => i.active); }

  onItemClick(item: SidebarItem): void {
    this.sidebarItems = this.sidebarItems.map(i => ({ ...i, active: i.id === item.id }));
  }

  toggleSidebar(): void {
    this.graphDataService.toggleSidebar();
  }

  onLogout(): void {
    // Handle logout functionality
    console.log('Logout clicked');
    // You can implement actual logout logic here
  }
}
