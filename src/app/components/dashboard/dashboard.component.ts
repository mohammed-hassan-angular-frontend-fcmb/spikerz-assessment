import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { PopoverComponent } from '../popover/popover.component';
import { GraphDataService } from '../../services/graph-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    PopoverComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private graphDataService = inject(GraphDataService);

  // Access signals from service
  readonly sidebarCollapsed = this.graphDataService.sidebarCollapsed;
  readonly selectedNode = this.graphDataService.selectedNode;
  readonly nodeCount = this.graphDataService.nodeCount;
  readonly criticalNodes = this.graphDataService.criticalNodes;

  // Tooltip state
  showNodeTooltip = false;

  // Dashboard data for the right panel
  get dashboardStats() {
    return {
      totalNodes: this.nodeCount(),
      criticalCount: this.criticalNodes().length,
      selectedNodeTitle: this.selectedNode()?.label || 'Lorem Lorem Lorem'
    };
  }
}
