import { render, type RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n-test";
import {
	createRouter,
	createRootRoute,
	createMemoryHistory,
	RouterProvider,
	AnyRoute,
} from "@tanstack/react-router";
import React from "react";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
	initialEntries?: string[];
	routes?: AnyRoute[];
}

const customRender = async (
	ui: React.ReactElement,
	{ initialEntries = ["/"], routes = [], ...options }: CustomRenderOptions = {},
) => {
	const rootRoute = createRootRoute();
	const routeTree = rootRoute.addChildren(routes);

	const router = createRouter({
		routeTree,
		history: createMemoryHistory({ initialEntries }),
	});

	await router.load();

	const queryClient = new QueryClient({
		defaultOptions: { queries: { retry: false } },
	});

	const Wrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router}>
				<I18nextProvider i18n={i18n}>{children}</I18nextProvider>
			</RouterProvider>
		</QueryClientProvider>
	);

	return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { customRender as render };
