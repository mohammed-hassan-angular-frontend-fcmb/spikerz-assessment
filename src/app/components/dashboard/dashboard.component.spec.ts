import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DashboardComponent } from './dashboard.component';
import { GraphDataService } from '../../services/graph-data.service';
import { GraphNode } from '../../models/graph.models';

describe('DashboardComponent', () => {
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

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should inject GraphDataService', () => {
      expect(graphDataService).toBeTruthy();
    });

    it('should initialize with default tooltip states', () => {
      expect(component.showNodeTooltip).toBeFalse();
      expect(component.showNode2Tooltip).toBeFalse();
      expect(component.showNode3Tooltip).toBeFalse();
      expect(component.showNode4Tooltip).toBeFalse();
      expect(component.showNode5Tooltip).toBeFalse();
    });
  });

  describe('Service Integration', () => {
    it('should access sidebarCollapsed signal from service', () => {
      expect(component.sidebarCollapsed()).toBeFalse();

      graphDataService.toggleSidebar();
      fixture.detectChanges();

      expect(component.sidebarCollapsed()).toBeTrue();
    });

    it('should access selectedNode signal from service', () => {
      expect(component.selectedNode()).toBeNull();

      const testNode: GraphNode = {
        id: 'test-node',
        label: 'Test Node',
        data: { type: 'asset', status: 'critical' }
      };

      graphDataService.selectNode(testNode);
      fixture.detectChanges();

      expect(component.selectedNode()).toEqual(testNode);
    });

    it('should access nodeCount signal from service', () => {
      // Service initializes with mock data (4 nodes)
      expect(component.nodeCount()).toBe(4);
    });

    it('should access criticalNodes signal from service', () => {
      // Service initializes with 1 critical node
      expect(component.criticalNodes().length).toBe(1);
      expect(component.criticalNodes()[0].data?.status).toBe('critical');
    });
  });

  describe('Dashboard Stats', () => {
    it('should return correct dashboard stats with default data', () => {
      const stats = component.dashboardStats;

      expect(stats.totalNodes).toBe(4);
      expect(stats.criticalCount).toBe(1);
      expect(stats.selectedNodeTitle).toBe('Lorem Lorem Lorem');
    });

    it('should update dashboard stats when node is selected', () => {
      const testNode: GraphNode = {
        id: 'test-node',
        label: 'Selected Test Node',
        data: { type: 'asset', status: 'high' }
      };

      graphDataService.selectNode(testNode);
      fixture.detectChanges();

      const stats = component.dashboardStats;
      expect(stats.selectedNodeTitle).toBe('Selected Test Node');
    });

    it('should update dashboard stats when nodes are added', () => {
      const newNode: GraphNode = {
        id: 'new-node',
        label: 'New Node',
        data: { type: 'risk', status: 'critical' }
      };

      graphDataService.addNode(newNode);
      fixture.detectChanges();

      const stats = component.dashboardStats;
      expect(stats.totalNodes).toBe(5);
      expect(stats.criticalCount).toBe(2);
    });
  });

  describe('Tooltip Management', () => {
    it('should toggle node tooltips independently', () => {
      component.showNodeTooltip = true;
      component.showNode2Tooltip = false;

      expect(component.showNodeTooltip).toBeTrue();
      expect(component.showNode2Tooltip).toBeFalse();
      expect(component.showNode3Tooltip).toBeFalse();
    });

    it('should handle multiple tooltips simultaneously', () => {
      component.showNodeTooltip = true;
      component.showNode3Tooltip = true;
      component.showNode5Tooltip = true;

      expect(component.showNodeTooltip).toBeTrue();
      expect(component.showNode2Tooltip).toBeFalse();
      expect(component.showNode3Tooltip).toBeTrue();
      expect(component.showNode4Tooltip).toBeFalse();
      expect(component.showNode5Tooltip).toBeTrue();
    });
  });

  describe('DOM Elements', () => {
    it('should render dashboard container', () => {
      const dashboardContainer = debugElement.query(By.css('.dashboard-container'));
      expect(dashboardContainer).toBeTruthy();
    });

    it('should render main content area', () => {
      const mainContent = debugElement.query(By.css('.main-content'));
      expect(mainContent).toBeTruthy();
    });

    it('should render left and right columns', () => {
      const leftColumn = debugElement.query(By.css('.left-column'));
      const rightColumn = debugElement.query(By.css('.right-column'));

      expect(leftColumn).toBeTruthy();
      expect(rightColumn).toBeTruthy();
    });

    it('should render server cards', () => {
      const serverCards = debugElement.queryAll(By.css('.server-card'));
      expect(serverCards.length).toBe(3); // Lorem P, S, T cards
    });

    it('should render server card wrappers with gray outline', () => {
      const serverCardWrappers = debugElement.queryAll(By.css('.server-card-wrapper'));
      expect(serverCardWrappers.length).toBe(3);
    });

    it('should apply sidebar collapsed class when sidebar is collapsed', () => {
      graphDataService.toggleSidebar();
      fixture.detectChanges();

      const mainContent = debugElement.query(By.css('.main-content'));
      expect(mainContent.nativeElement.classList.contains('sidebar-collapsed')).toBeTrue();
    });
  });

  describe('Responsive Layout', () => {
    it('should have proper CSS classes for responsive design', () => {
      const dashboardContent = debugElement.query(By.css('.dashboard-content'));
      expect(dashboardContent).toBeTruthy();

      const leftColumn = debugElement.query(By.css('.left-column'));
      const rightColumn = debugElement.query(By.css('.right-column'));

      expect(leftColumn).toBeTruthy();
      expect(rightColumn).toBeTruthy();
    });

    it('should render KV list items', () => {
      const kvItems = debugElement.queryAll(By.css('.kv-item'));
      expect(kvItems.length).toBeGreaterThan(0);
    });
  });
});
