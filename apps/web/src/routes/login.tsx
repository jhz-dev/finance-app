import { Link } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { LabeledInput } from "@/components/ui/LabeledInput";
import { useLogin } from "@/hooks/useLogin";

export function LoginPage() {
	const { t } = useTranslation();
	const emailId = useId();
	const passwordId = useId();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const mutation = useLogin();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate({ email, password });
	};

	return (
		<form
			className="flex flex-col items-center gap-4 w-[100%]"
			onSubmit={handleSubmit}
		>
			<Card className="w-full max-w-lg bg-background shadow-2xl p-8 sm:p-12">
				<CardHeader>
					<CardTitle className="text-2xl text-foreground font-bold">
						{t("Login")}
					</CardTitle>
					<CardDescription className="text-foreground">
						{t("Enter your email below to login to your account.")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
          <div className="bg-warning text-warning-foreground" />
					<LabeledInput
						id={emailId}
						label="Email"
						type="email"
						placeholder="m@example.com"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<LabeledInput
						id={passwordId}
						label="Password"
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
				</CardContent>
				<CardFooter className="grid gap-2">
					<Button
						type="submit"
            className="main-button"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? t("Signing in...") : t("Sign in")}
					</Button>
					<div className="gap-2">
						<LanguageSelector />
					</div>
					<span className="mt-4 text-center text-sm">
						{t("Don't have an account?")}{" "}
						<Link to="/register" className="underline text-primary">
							{t("Sign up")}
						</Link>
					</span>
				</CardFooter>
			</Card>
		</form>
	);
}
