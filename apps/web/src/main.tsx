import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import React, { StrictMode, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { useAuthStore } from "@/domain/auth/auth.store";
import { Layout } from "./components/Layout";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

import "./styles.css";
import { I18nextProvider } from "react-i18next"; // Import I18nextProvider
import i18n from "./lib/i18n"; // Import the i18n instance

const BudgetDetailPage = React.lazy(() =>
	import("./routes/budgets/detail.tsx").then((module) => ({
		default: module.BudgetDetailPage,
	})),
);
const DashboardPage = React.lazy(() => import("./routes/DashboardPage.tsx"));
const GoalsPage = React.lazy(() =>
	import("./routes/GoalsPage.tsx").then((module) => ({
		default: module.GoalsPage,
	})),
);
const LoginPage = React.lazy(() =>
	import("./routes/login.tsx").then((module) => ({ default: module.LoginPage })),
);
const ProfilePage = React.lazy(() =>
	import("./routes/ProfilePage.tsx").then((module) => ({
		default: module.ProfilePage,
	})),
);
const RegisterPage = React.lazy(() =>
	import("./routes/register.tsx").then((module) => ({
		default: module.RegisterPage,
	})),
);

const rootRoute = createRootRoute({
	component: () => (
		<>
			<Layout>
				<Suspense fallback={<div>Loading...</div>}>
					<Outlet />
				</Suspense>
				<TanStackRouterDevtools />
			</Layout>
			<Toaster/>
		</>
	),
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: DashboardPage,
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (!isAuthenticated) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/login",
	component: LoginPage,
});

const registerRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/register",
	component: RegisterPage,
});

const budgetDetailRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/budgets/$budgetId",
	component: BudgetDetailPage,
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (!isAuthenticated) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

const goalsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/goals",
	component: GoalsPage,
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (!isAuthenticated) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

const profileRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/profile",
	component: ProfilePage,
	beforeLoad: () => {
		const { isAuthenticated } = useAuthStore.getState();
		if (!isAuthenticated) {
			throw redirect({
				to: "/login",
			});
		}
	},
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	loginRoute,
	registerRoute,
	budgetDetailRoute,
	goalsRoute,
	profileRoute,
]);

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
	routeTree,
	context: {
		...TanStackQueryProviderContext,
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
				<I18nextProvider i18n={i18n}>
					<ThemeProvider
						defaultTheme="light"
					>
						<RouterProvider router={router} />
					</ThemeProvider>
				</I18nextProvider>
			</TanStackQueryProvider.Provider>
		</StrictMode>,
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
