import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarItemProps {
	to: string;
	icon: LucideIcon;
	label: string;
}

export function SidebarItem({ to, icon: Icon, label }: SidebarItemProps) {
	const { t } = useTranslation();
	return (
		<Link
			to={to}
			className="sidebar-item"
			activeProps={{ className: "sidebar-item-active" }}
		>
			<Icon className="h-5 w-5" />
			<span className="px-2">{t(label)}</span>
		</Link>
	);
}
