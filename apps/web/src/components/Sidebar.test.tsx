import {
	createMemoryHistory,
	createRootRoute,
	createRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { describe, expect, it, vi } from "vitest";
import i18n from "../lib/i18n";
import { Sidebar } from "./Sidebar";

const rootRoute = createRootRoute();
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/" });
const goalsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/goals",
});
const profileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/profile",
});

const router = createRouter({
	routeTree: rootRoute.addChildren([indexRoute, goalsRoute, profileRoute]),
	history: createMemoryHistory(),
});

vi.mock("@/domain/auth/auth.store", () => ({
	useAuthStore: () => ({
		logout: vi.fn(),
	}),
}));

describe.skip("Sidebar", () => {
	it("renders all navigation links and the logout button", async () => {
		render(
			<I18nextProvider i18n={i18n}>
				<RouterProvider router={router}>
					<Sidebar />
				</RouterProvider>
			</I18nextProvider>,
		);

		expect(await screen.findByText("Dashboard")).toBeInTheDocument();
		expect(await screen.findByText("Goals")).toBeInTheDocument();
		expect(await screen.findByText("Profile")).toBeInTheDocument();
		expect(await screen.findByText("Logout")).toBeInTheDocument();
	});
});
