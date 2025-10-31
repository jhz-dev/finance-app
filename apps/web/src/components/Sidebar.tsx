import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/domain/auth/auth.store";
import { Button } from "./ui/button";

export function Sidebar() {
	const { t } = useTranslation();
	const logout = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate({ to: "/login" });
	};

	return (
		<div className="flex flex-col h-full p-4 bg-slate-200">
			<h2 className="text-2xl font-bold text-slate-900 mb-10">
				{t("FinanSync")}
			</h2>
			<nav className="flex flex-col space-y-4">
				<Link
					to="/"
					className="text-slate-600 font-medium flex items-center space-x-3 py-3 px-4 rounded-full"
					activeProps={{
						className:
							"bg-white text-emerald-600 font-semibold shadow-lg py-3 px-4 rounded-full",
					}}
				>
					<Home className="h-5 w-5" />
					<span>{t("Dashboard")}</span>
				</Link>
			</nav>
			<div className="mt-auto">
				<Button
					onClick={handleLogout}
					variant="outline"
					className="w-full bg-slate-200 text-slate-700 rounded-full py-3 px-6 font-semibold hover:bg-slate-300 transition-all"
				>
					<LogOut className="h-5 w-5 mr-2" />
					{t("Logout")}
				</Button>
			</div>
		</div>
	);
}
