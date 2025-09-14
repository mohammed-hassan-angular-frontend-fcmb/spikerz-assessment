import { Injectable, signal, computed } from '@angular/core';
import { GraphData, GraphNode, GraphEdge } from '../models/graph.models';

@Injectable({
  providedIn: 'root'
})
export class GraphDataService {
  // Signals for state management
  private _graphData = signal<GraphData>({
    nodes: [],
    links: []
  });

  private _selectedNode = signal<GraphNode | null>(null);
  private _sidebarCollapsed = signal<boolean>(false);

  // Public readonly signals
  readonly graphData = this._graphData.asReadonly();
  readonly selectedNode = this._selectedNode.asReadonly();
  readonly sidebarCollapsed = this._sidebarCollapsed.asReadonly();

  // Computed signals
  readonly nodeCount = computed(() => this._graphData().nodes.length);
  readonly edgeCount = computed(() => this._graphData().links.length);
  readonly criticalNodes = computed(() =>
    this._graphData().nodes.filter(node => node.data?.status === 'critical')
  );

  constructor() {
    this.initializeMockData();
  }

  // Actions
  setGraphData(data: GraphData): void {
    this._graphData.set(data);
  }

  selectNode(node: GraphNode | null): void {
    this._selectedNode.set(node);
  }

  toggleSidebar(): void {
    this._sidebarCollapsed.update(collapsed => !collapsed);
  }

  addNode(node: GraphNode): void {
    this._graphData.update(data => ({
      ...data,
      nodes: [...data.nodes, node]
    }));
  }

  removeNode(nodeId: string): void {
    this._graphData.update(data => ({
      nodes: data.nodes.filter(node => node.id !== nodeId),
      links: data.links.filter(link => link.source !== nodeId && link.target !== nodeId)
    }));
  }

  addEdge(edge: GraphEdge): void {
    this._graphData.update(data => ({
      ...data,
      links: [...data.links, edge]
    }));
  }

  private initializeMockData(): void {
    const mockData: GraphData = {
      nodes: [
        {
          id: 'node1',
          label: 'Loremipsumdolorit',
          data: {
            type: 'asset',
            status: 'critical',
            badge: 2,
            ip: '192.168.1.1',
            description: 'Critical asset node',
            details: { asset: 'Asset 1' }
          }
        },
        {
          id: 'node2',
          label: 'Loremipsum',
          data: {
            type: 'risk',
            status: 'high',
            badge: 0,
            description: 'High risk node',
            details: { contextualRisk: 'High' }
          }
        },
        {
          id: 'node3',
          label: 'Loremipsi',
          data: {
            type: 'contextual',
            status: 'medium',
            badge: 0,
            description: 'Medium contextual node',
            details: { contextualRisk: 'Medium' }
          }
        },
        {
          id: 'node4',
          label: 'Loremipsumdolorit002',
          data: {
            type: 'asset',
            status: 'low',
            badge: 3,
            ip: '192.168.1.2',
            description: 'Low risk asset',
            details: { asset: 'Asset 2' }
          }
        }
      ],
      links: [
        {
          id: 'edge1',
          source: 'node1',
          target: 'node2',
          data: { type: 'connection' }
        },
        {
          id: 'edge2',
          source: 'node2',
          target: 'node3',
          data: { type: 'dependency' }
        },
        {
          id: 'edge3',
          source: 'node1',
          target: 'node4',
          data: { type: 'flow' }
        }
      ]
    };

    this.setGraphData(mockData);
  }
}
