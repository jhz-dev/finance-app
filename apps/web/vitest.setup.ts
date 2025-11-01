import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

vi.mock('react-resizable-panels', () => ({
  Panel: (props: any) => props.children,
  PanelGroup: (props: any) => props.children,
  PanelResizeHandle: () => null,
}));
