import { vi } from 'vitest';

vi.mock('react-resizable-panels', () => ({
  Panel: (props: any) => props.children,
  PanelGroup: (props: any) => props.children,
  PanelResizeHandle: () => null,
}));
