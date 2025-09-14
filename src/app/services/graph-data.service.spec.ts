import { TestBed } from '@angular/core/testing';
import { GraphDataService } from './graph-data.service';
import { GraphNode, GraphEdge, GraphData } from '../models/graph.models';

describe('GraphDataService', () => {
  let service: GraphDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphDataService);
  });

  describe('Service Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with mock data', () => {
      expect(service.nodeCount()).toBe(4);
      expect(service.edgeCount()).toBe(3);
      expect(service.graphData().nodes.length).toBe(4);
      expect(service.graphData().links.length).toBe(3);
    });

    it('should initialize with sidebar not collapsed', () => {
      expect(service.sidebarCollapsed()).toBeFalse();
    });

    it('should initialize with no selected node', () => {
      expect(service.selectedNode()).toBeNull();
    });
  });

  describe('Node Management', () => {
    it('should add a new node', () => {
      const initialCount = service.nodeCount();
      const newNode: GraphNode = {
        id: 'test-node',
        label: 'Test Node',
        data: { type: 'asset', status: 'high' }
      };

      service.addNode(newNode);

      expect(service.nodeCount()).toBe(initialCount + 1);
      expect(service.graphData().nodes).toContain(newNode);
    });

    it('should remove a node and its associated edges', () => {
      const initialNodeCount = service.nodeCount();
      const initialEdgeCount = service.edgeCount();
      
      // Remove node1 which has connections
      service.removeNode('node1');

      expect(service.nodeCount()).toBe(initialNodeCount - 1);
      expect(service.edgeCount()).toBeLessThan(initialEdgeCount);
      
      // Verify node is removed
      const nodeExists = service.graphData().nodes.some(node => node.id === 'node1');
      expect(nodeExists).toBeFalse();
      
      // Verify edges connected to node1 are removed
      const edgesWithNode1 = service.graphData().links.filter(
        link => link.source === 'node1' || link.target === 'node1'
      );
      expect(edgesWithNode1.length).toBe(0);
    });

    it('should select a node', () => {
      const testNode: GraphNode = {
        id: 'test-select',
        label: 'Test Select',
        data: { type: 'risk', status: 'medium' }
      };

      service.selectNode(testNode);
      expect(service.selectedNode()).toEqual(testNode);
    });

    it('should deselect a node', () => {
      const testNode: GraphNode = {
        id: 'test-deselect',
        label: 'Test Deselect',
        data: { type: 'contextual', status: 'low' }
      };

      service.selectNode(testNode);
      expect(service.selectedNode()).toEqual(testNode);

      service.selectNode(null);
      expect(service.selectedNode()).toBeNull();
    });
  });

  describe('Edge Management', () => {
    it('should add a new edge', () => {
      const initialCount = service.edgeCount();
      const newEdge: GraphEdge = {
        id: 'test-edge',
        source: 'node2',
        target: 'node4',
        data: { type: 'connection' }
      };

      service.addEdge(newEdge);

      expect(service.edgeCount()).toBe(initialCount + 1);
      expect(service.graphData().links).toContain(newEdge);
    });
  });

  describe('Computed Signals', () => {
    it('should compute critical nodes correctly', () => {
      const criticalNodes = service.criticalNodes();
      expect(criticalNodes.length).toBe(1);
      expect(criticalNodes[0].data?.status).toBe('critical');
      expect(criticalNodes[0].id).toBe('node1');
    });

    it('should update critical nodes when new critical node is added', () => {
      const initialCriticalCount = service.criticalNodes().length;
      
      const newCriticalNode: GraphNode = {
        id: 'critical-test',
        label: 'Critical Test',
        data: { type: 'asset', status: 'critical' }
      };

      service.addNode(newCriticalNode);

      expect(service.criticalNodes().length).toBe(initialCriticalCount + 1);
    });

    it('should update node count when nodes are added/removed', () => {
      const initialCount = service.nodeCount();
      
      const testNode: GraphNode = {
        id: 'count-test',
        label: 'Count Test',
        data: { type: 'risk', status: 'high' }
      };

      service.addNode(testNode);
      expect(service.nodeCount()).toBe(initialCount + 1);

      service.removeNode('count-test');
      expect(service.nodeCount()).toBe(initialCount);
    });
  });

  describe('Sidebar Management', () => {
    it('should toggle sidebar state', () => {
      expect(service.sidebarCollapsed()).toBeFalse();
      
      service.toggleSidebar();
      expect(service.sidebarCollapsed()).toBeTrue();
      
      service.toggleSidebar();
      expect(service.sidebarCollapsed()).toBeFalse();
    });
  });

  describe('Graph Data Management', () => {
    it('should set new graph data', () => {
      const newGraphData: GraphData = {
        nodes: [
          {
            id: 'new-node-1',
            label: 'New Node 1',
            data: { type: 'asset', status: 'high' }
          }
        ],
        links: []
      };

      service.setGraphData(newGraphData);

      expect(service.graphData()).toEqual(newGraphData);
      expect(service.nodeCount()).toBe(1);
      expect(service.edgeCount()).toBe(0);
    });

    it('should maintain data integrity when updating', () => {
      const originalData = service.graphData();
      
      // Add a node
      const newNode: GraphNode = {
        id: 'integrity-test',
        label: 'Integrity Test',
        data: { type: 'contextual', status: 'medium' }
      };
      
      service.addNode(newNode);
      
      // Original data should not be mutated
      expect(originalData.nodes.length).toBe(4);
      expect(service.graphData().nodes.length).toBe(5);
    });
  });

  describe('Mock Data Validation', () => {
    it('should have valid mock data structure', () => {
      const graphData = service.graphData();
      
      // Validate nodes
      graphData.nodes.forEach(node => {
        expect(node.id).toBeTruthy();
        expect(node.label).toBeTruthy();
        expect(node.data).toBeTruthy();
        expect(['asset', 'risk', 'contextual']).toContain(node.data!.type);
        expect(['critical', 'high', 'medium', 'low']).toContain(node.data!.status);
      });
      
      // Validate edges
      graphData.links.forEach(edge => {
        expect(edge.id).toBeTruthy();
        expect(edge.source).toBeTruthy();
        expect(edge.target).toBeTruthy();
        
        // Verify source and target nodes exist
        const sourceExists = graphData.nodes.some(node => node.id === edge.source);
        const targetExists = graphData.nodes.some(node => node.id === edge.target);
        expect(sourceExists).toBeTrue();
        expect(targetExists).toBeTrue();
      });
    });
  });
});
