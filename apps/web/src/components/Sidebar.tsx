import { useNavigate } from "@tanstack/react-router";
import { Home, LogOut, Target, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/domain/auth/auth.store";
import { Button } from "./ui/button";
import { SidebarItem } from "./SidebarItem";

const sidebarItems = [
	{
		to: "/",
		icon: Home,
		label: "Dashboard",
	},
	{
		to: "/goals",
		icon: Target,
		label: "Goals",
	},
	{
		to: "/profile",
		icon: User,
		label: "Profile",
	},
];

export function Sidebar() {
	const { t } = useTranslation();
	const logout = useAuthStore((state) => state.logout);
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate({ to: "/login" });
	};

	return (
		<div className="flex flex-col h-full p-4 bg-sidebar">
			<h2 className="text-2xl font-bold text-sidebar-foreground mb-5">
				{t("FinanSync")}
			</h2>
			<nav className="flex flex-col space-y-4">
				{sidebarItems.map((item) => (
					<SidebarItem
						key={item.to}
						to={item.to}
						icon={item.icon}
						label={item.label}
					/>
				))}
			</nav>
			<div className="mt-auto">
				<Button
					onClick={handleLogout}
					variant="outline"
					className="w-full bg-slate-200 text-foreground/70 rounded-2xl py-3 px-6 font-semibold hover:bg-slate-300 transition-all"
				>
					<LogOut className="h-5 w-5 mr-2" />
					{t("Logout")}
				</Button>
			</div>
		</div>
	);
}
