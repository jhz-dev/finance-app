
import { cn } from "@/lib/utils";

type MessageProps = {
  title: string;
  message: string;
  type: "error" | "info" | "warning";
};

const typeStyles = {
  error: "text-red-500",
  info: "text-foreground-700",
  warning: "text-yellow-500",
};

export function Message({ title, message, type }: MessageProps) {
	return (
		<div className="text-center mt-20">
			<h2 className={cn("text-2xl font-bold", typeStyles[type])}>{title}</h2>
			<p className={cn("mt-2", typeStyles[type])}>{message}</p>
		</div>
	);
}
