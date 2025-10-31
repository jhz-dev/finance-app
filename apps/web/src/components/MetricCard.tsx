import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
	title: string;
	value: string;
	className?: string;
}

export function MetricCard({ title, value, className }: MetricCardProps) {
	return (
		<Card className={`bg-white rounded-3xl shadow-2xl p-6 ${className}`}>
			<CardHeader>
				<CardTitle className="text-base font-medium text-slate-500">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-4xl font-extrabold text-slate-900">{value}</div>
			</CardContent>
		</Card>
	);
}
