import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

vi.mock('react-resizable-panels', () => ({
  Panel: (props) => props.children,
  PanelGroup: (props) => props.children,
  PanelResizeHandle: () => null,
}));
