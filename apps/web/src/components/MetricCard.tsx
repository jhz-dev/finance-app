import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
	title: string;
	value: string;
	className?: string;
}

export function MetricCard({ title, value, className }: MetricCardProps) {
	return (
		<Card className={`glass-effect text-white border-white/20 ${className}`}>
			<CardHeader>
				<CardTitle className="text-base font-medium text-white/70">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="text-3xl font-bold">{value}</div>
			</CardContent>
		</Card>
	);
}
