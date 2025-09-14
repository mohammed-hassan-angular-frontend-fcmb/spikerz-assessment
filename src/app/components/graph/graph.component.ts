import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxGraphModule, Edge, Node, ClusterNode } from '@swimlane/ngx-graph';
import { GraphDataService } from '../../services/graph-data.service';
import { PopoverService } from '../../services/popover.service';
import { GraphNode, PopoverData } from '../../models/graph.models';
import * as shape from 'd3-shape';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [CommonModule, NgxGraphModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.scss'
})
export class GraphComponent implements OnInit, AfterViewInit {
  @ViewChild('graphContainer', { static: true }) graphContainer!: ElementRef;

  private graphDataService = inject(GraphDataService);
  private popoverService = inject(PopoverService);

  // Graph configuration
  layout: string = 'dagreCluster';
  curve = shape.curveBundle.beta(1);

  // Graph data
  nodes: Node[] = [];
  links: Edge[] = [];

  // Layout settings
  layoutSettings = {
    orientation: 'TB'
  };

  // View dimensions
  view: [number, number] = [800, 600];
  autoZoom = true;
  autoCenter = true;
  enableZoom = true;
  enablePan = true;

  // Color scheme
  colorScheme = {
    domain: ['#0ea5e9', '#22c55e', '#f59e0b', '#ef4444']
  };

  ngOnInit(): void {
    this.loadGraphData();
    this.updateViewDimensions();
  }

  ngAfterViewInit(): void {
    this.updateViewDimensions();
    window.addEventListener('resize', () => this.updateViewDimensions());
  }

  private loadGraphData(): void {
    const graphData = this.graphDataService.graphData();

    // Transform nodes
    this.nodes = graphData.nodes.map(node => ({
      id: node.id,
      label: node.label,
      data: {
        ...node.data,
        color: this.getNodeColor(node.data?.status || 'low')
      }
    }));

    // Transform links
    this.links = graphData.links.map(link => ({
      id: link.id,
      source: link.source,
      target: link.target,
      label: link.label || ''
    }));
  }

  private getNodeColor(status: string): string {
    const colors = {
      critical: '#ef4444',
      high: '#f59e0b',
      medium: '#22c55e',
      low: '#0ea5e9'
    };
    return colors[status as keyof typeof colors] || colors.low;
  }

  private updateViewDimensions(): void {
    if (this.graphContainer?.nativeElement) {
      const container = this.graphContainer.nativeElement;
      const rect = container.getBoundingClientRect();
      this.view = [rect.width, rect.height];
    }
  }

  onNodeClick(event: MouseEvent, node: Node): void {
    event.stopPropagation();

    // Find the original node data
    const originalNode = this.graphDataService.graphData().nodes.find(n => n.id === node.id);
    if (!originalNode) return;

    // Create popover data
    const popoverData: PopoverData = {
      nodeId: node.id,
      title: node.label || 'Unknown Node',
      description: originalNode.data?.description || 'No description available',
      status: originalNode.data?.status || 'low',
      details: originalNode.data?.details || {},
      position: {
        x: event.clientX,
        y: event.clientY
      }
    };

    // Show popover
    this.popoverService.showPopover(popoverData);

    // Update selected node in service
    this.graphDataService.selectNode(originalNode);
  }

  onNodeMouseEnter(node: Node): void {
    // Optional: Add hover effects
  }

  onNodeMouseLeave(node: Node): void {
    // Optional: Remove hover effects
  }

  onBackgroundClick(): void {
    this.popoverService.hidePopover();
    this.graphDataService.selectNode(null);
  }

  getNodeIcon(type?: string): string {
    const icons = {
      asset: '📦',
      risk: '⚠️',
      contextual: '📊'
    };
    return icons[type as keyof typeof icons] || '📦';
  }
}
