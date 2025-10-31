import { useRouterState } from "@tanstack/react-router";
import type React from "react";
import { useEffect, useRef } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import { Header } from "@/components/Header";
import {
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebarStore } from "@/domain/sidebar/sidebar.store";
import { Sidebar } from "./Sidebar";

export function Layout({ children }: { children: React.ReactNode }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const isPublicPage = ["/login", "/register"].includes(pathname);
	const { isCollapsed, toggle } = useSidebarStore();
	const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);

	useEffect(() => {
		if (panelGroupRef.current) {
			panelGroupRef.current.setLayout(isCollapsed ? [0, 100] : [20, 80]);
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
					if (isCollapsed) {
						toggle();
					}
				}}
				className="h-full"
			>
				<Sidebar />
			</ResizablePanel>
			<ResizableHandle withHandle className={undefined} />
			<ResizablePanel defaultSize={80}>
				<div className="flex flex-col h-full">
					<Header />
					<main className="flex-1 p-6 overflow-y-auto">{children}</main>
				</div>
			</ResizablePanel>
		</ResizablePanelGroup>
	);
}
