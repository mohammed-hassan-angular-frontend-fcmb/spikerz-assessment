import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { GraphDataService } from './services/graph-data.service';
import { GraphNode } from './models/graph.models';

describe('Dashboard Integration Tests', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let graphDataService: GraphDataService;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [GraphDataService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    graphDataService = TestBed.inject(GraphDataService);
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Service-Component Integration', () => {
    it('should reflect service state changes in component', () => {
      // Initial state
      expect(component.sidebarCollapsed()).toBeFalse();
      expect(component.nodeCount()).toBe(4);
      expect(component.criticalNodes().length).toBe(1);

      // Toggle sidebar through service
      graphDataService.toggleSidebar();
      fixture.detectChanges();
      
      expect(component.sidebarCollapsed()).toBeTrue();
      
      // Add node through service
      const newNode: GraphNode = {
        id: 'integration-test',
        label: 'Integration Test Node',
        data: { type: 'asset', status: 'critical' }
      };
      
      graphDataService.addNode(newNode);
      fixture.detectChanges();
      
      expect(component.nodeCount()).toBe(5);
      expect(component.criticalNodes().length).toBe(2);
    });

    it('should update dashboard stats when service data changes', () => {
      const initialStats = component.dashboardStats;
      expect(initialStats.totalNodes).toBe(4);
      expect(initialStats.criticalCount).toBe(1);
      expect(initialStats.selectedNodeTitle).toBe('Lorem Lorem Lorem');

      // Select a node
      const testNode: GraphNode = {
        id: 'stats-test',
        label: 'Stats Test Node',
        data: { type: 'risk', status: 'high' }
      };
      
      graphDataService.selectNode(testNode);
      fixture.detectChanges();
      
      const updatedStats = component.dashboardStats;
      expect(updatedStats.selectedNodeTitle).toBe('Stats Test Node');
      
      // Add critical node
      const criticalNode: GraphNode = {
        id: 'critical-stats',
        label: 'Critical Stats Node',
        data: { type: 'asset', status: 'critical' }
      };
      
      graphDataService.addNode(criticalNode);
      fixture.detectChanges();
      
      const finalStats = component.dashboardStats;
      expect(finalStats.totalNodes).toBe(5);
      expect(finalStats.criticalCount).toBe(2);
    });
  });

  describe('DOM Updates with Service Changes', () => {
    it('should apply sidebar collapsed class when service toggles sidebar', () => {
      const mainContent = debugElement.query(By.css('.main-content'));
      
      // Initially not collapsed
      expect(mainContent.nativeElement.classList.contains('sidebar-collapsed')).toBeFalse();
      
      // Toggle through service
      graphDataService.toggleSidebar();
      fixture.detectChanges();
      
      expect(mainContent.nativeElement.classList.contains('sidebar-collapsed')).toBeTrue();
    });

    it('should maintain DOM structure integrity', () => {
      // Verify essential DOM elements exist
      const dashboardContainer = debugElement.query(By.css('.dashboard-container'));
      const mainContent = debugElement.query(By.css('.main-content'));
      const leftColumn = debugElement.query(By.css('.left-column'));
      const rightColumn = debugElement.query(By.css('.right-column'));
      
      expect(dashboardContainer).toBeTruthy();
      expect(mainContent).toBeTruthy();
      expect(leftColumn).toBeTruthy();
      expect(rightColumn).toBeTruthy();
      
      // Verify server cards
      const serverCards = debugElement.queryAll(By.css('.server-card'));
      expect(serverCards.length).toBe(3);
      
      // Verify server card wrappers
      const serverCardWrappers = debugElement.queryAll(By.css('.server-card-wrapper'));
      expect(serverCardWrappers.length).toBe(3);
    });
  });

  describe('Layout and Styling', () => {
    it('should have proper CSS classes for layout', () => {
      const dashboardContent = debugElement.query(By.css('.dashboard-content'));
      const leftColumn = debugElement.query(By.css('.left-column'));
      const rightColumn = debugElement.query(By.css('.right-column'));
      
      expect(dashboardContent).toBeTruthy();
      expect(leftColumn).toBeTruthy();
      expect(rightColumn).toBeTruthy();
    });

    it('should render server cards with proper structure', () => {
      const serverCards = debugElement.queryAll(By.css('.server-card'));
      
      serverCards.forEach(card => {
        const header = card.query(By.css('.server-card-header'));
        const wrapper = card.query(By.css('.server-card-wrapper'));
        const content = card.query(By.css('.server-card-content'));
        
        expect(header).toBeTruthy();
        expect(wrapper).toBeTruthy();
        expect(content).toBeTruthy();
        
        // Check for left-right split structure
        const leftSection = card.query(By.css('.server-left'));
        const divider = card.query(By.css('.server-divider'));
        const rightSection = card.query(By.css('.server-right'));
        
        expect(leftSection).toBeTruthy();
        expect(divider).toBeTruthy();
        expect(rightSection).toBeTruthy();
      });
    });

    it('should have KV list structure', () => {
      const kvList = debugElement.query(By.css('.kv-list'));
      expect(kvList).toBeTruthy();
      
      const kvItems = debugElement.queryAll(By.css('.kv-item'));
      expect(kvItems.length).toBeGreaterThan(0);
    });
  });

  describe('Tooltip Functionality', () => {
    it('should manage tooltip states independently', () => {
      // Test tooltip state management
      component.showNodeTooltip = true;
      component.showNode3Tooltip = true;
      
      expect(component.showNodeTooltip).toBeTrue();
      expect(component.showNode2Tooltip).toBeFalse();
      expect(component.showNode3Tooltip).toBeTrue();
      expect(component.showNode4Tooltip).toBeFalse();
      expect(component.showNode5Tooltip).toBeFalse();
    });
  });

  describe('Error Handling', () => {
    it('should handle null selected node gracefully', () => {
      graphDataService.selectNode(null);
      fixture.detectChanges();
      
      const stats = component.dashboardStats;
      expect(stats.selectedNodeTitle).toBe('Lorem Lorem Lorem');
    });

    it('should handle empty graph data', () => {
      graphDataService.setGraphData({ nodes: [], links: [] });
      fixture.detectChanges();
      
      expect(component.nodeCount()).toBe(0);
      expect(component.criticalNodes().length).toBe(0);
      
      const stats = component.dashboardStats;
      expect(stats.totalNodes).toBe(0);
      expect(stats.criticalCount).toBe(0);
    });
  });
});
