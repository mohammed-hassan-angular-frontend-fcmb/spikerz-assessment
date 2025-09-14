export interface GraphNode {
  id: string;
  label: string;
  data?: {
    type: 'asset' | 'risk' | 'contextual';
    status: 'critical' | 'high' | 'medium' | 'low';
    badge?: number; // small red numeric badge shown on node
    ip?: string;    // optional IP label under the node label
    description?: string;
    details?: Record<string, any>;
  };
  position?: {
    x: number;
    y: number;
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  data?: {
    type: 'connection' | 'dependency' | 'flow';
    weight?: number;
  };
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphEdge[];
}

export interface PopoverData {
  nodeId: string;
  title: string;
  description: string;
  status: 'critical' | 'high' | 'medium' | 'low';
  details: {
    asset?: string;
    contextualRisk?: string;
    [key: string]: any;
  };
  position: {
    x: number;
    y: number;
  };
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  active?: boolean;
  children?: SidebarItem[];
}

export interface DashboardState {
  selectedNode: GraphNode | null;
  popoverVisible: boolean;
  popoverData: PopoverData | null;
  sidebarCollapsed: boolean;
}
