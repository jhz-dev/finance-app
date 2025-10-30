import { Link, useNavigate } from "@tanstack/react-router";
import { Home, LogOut, Target, User } from "lucide-react";
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
		<div className="flex flex-col h-full p-4 glass-effect">
			<h2 className="text-2xl font-bold text-white mb-10">{t("FinanSync")}</h2>
			<nav className="flex flex-col space-y-4">
				<Link
					to="/"
					className="flex items-center space-x-2 text-white hover:text-primary"
				>
					<Home className="h-5 w-5" />
					<span>{t("Dashboard")}</span>
				</Link>
				<Link
					to="/goals"
					className="flex items-center space-x-2 text-white hover:text-primary"
				>
					<Target className="h-5 w-5" />
					<span>{t("Goals")}</span>
				</Link>
				<Link
					to="/profile"
					className="flex items-center space-x-2 text-white hover:text-primary"
				>
					<User className="h-5 w-5" />
					<span>{t("Profile")}</span>
				</Link>
			</nav>
			<div className="mt-auto">
				<Button
					onClick={handleLogout}
					variant="outline"
					className="w-full bg-transparent hover:bg-white/10 text-white"
				>
					<LogOut className="h-5 w-5 mr-2" />
					{t("Logout")}
				</Button>
			</div>
		</div>
	);
}
