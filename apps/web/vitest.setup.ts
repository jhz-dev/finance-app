import { vi } from 'vitest';

vi.mock('react-resizable-panels', () => ({
  Panel: (props) => props.children,
  PanelGroup: (props) => props.children,
  PanelResizeHandle: () => null,
}));
