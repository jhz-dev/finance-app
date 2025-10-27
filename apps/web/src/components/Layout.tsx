import type React from 'react';
import { useEffect, useRef } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { Header } from '@/components/Header';
import { Sidebar } from './Sidebar';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from '@/components/ui/resizable';
import { useSidebarStore } from '@/domain/sidebar/sidebar.store';
import type { ImperativePanelGroupHandle } from 'react-resizable-panels';

export function Layout({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublicPage = ['/login', '/register'].includes(pathname);
  const { isCollapsed, toggle } = useSidebarStore();
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

  useEffect(() => {
    if (panelGroupRef.current) {
      if (isCollapsed) {
        panelGroupRef.current.setLayout([0, 100]);
      } else {
        panelGroupRef.current.setLayout([20, 80]);
      }
    }
  }, [isCollapsed]);


  if (isPublicPage) {
    return (
      <main className="h-screen w-screen flex items-center justify-center bg-gray-900">
        {children}
      </main>
    );
  }

  return (
    <ResizablePanelGroup
      ref={panelGroupRef}
      direction="horizontal"
      className="h-screen w-full"
    >
      <ResizablePanel
        defaultSize={20}
        minSize={15}
        maxSize={25}
        collapsible
        onCollapse={() => {
          if (!isCollapsed) {
            toggle();
          }
        }}
        onExpand={() => {
          if(isCollapsed) {
            toggle();
          }
        }}
        className="h-full"
      >
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={80}>
        <div className="flex flex-col h-full">
          <Header />
          <main className="flex-1 p-6 overflow-y-auto">{children}</main>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
