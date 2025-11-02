import {
	Outlet,
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { useAuthStore } from "@/domain/auth/auth.store";
import { Layout } from "./components/Layout";
import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import { BudgetDetailPage } from "./routes/budgets/detail.tsx";
import DashboardPage from "./routes/DashboardPage.tsx";
import { LoginPage } from "./routes/login.tsx";
import { RegisterPage } from "./routes/register.tsx";
import GoalsPage from "./routes/GoalsPage.tsx";

export function createAppRouter() {
	const rootRoute = createRootRoute({
		component: () => (
			<Layout>
				<Outlet />
				<TanStackRouterDevtools />
			</Layout>
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

	const routeTree = rootRoute.addChildren([
		indexRoute,
		loginRoute,
		registerRoute,
		budgetDetailRoute,
		goalsRoute,
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

	return router;
}
