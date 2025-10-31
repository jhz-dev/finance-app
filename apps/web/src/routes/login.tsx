import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/domain/auth/auth.store";
import { authRepository } from "@/infrastructure/ApiAuthRepository";

export function LoginPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { setToken, setUser } = useAuthStore();
	const emailId = useId();
	const passwordId = useId();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const mutation = useMutation({
		mutationFn: () => authRepository.login({ email, password }),
		onSuccess: (data) => {
			setToken(data.token);
			setUser(data.user);
			navigate({ to: "/" });
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				setErrorMessage(error.response?.data.message || t("Login failed."));
			} else {
				setErrorMessage(t("An unexpected error occurred."));
			}
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);
		mutation.mutate();
	};

	return (
		<form
			className="flex flex-col items-center gap-4 w-[100%]"
			onSubmit={handleSubmit}
		>
			<Card className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
				<CardHeader>
					<CardTitle className="text-2xl text-slate-900 font-bold">
						{t("Login")}
					</CardTitle>
					<CardDescription className="text-slate-500">
						{t("Enter your email below to login to your account.")}
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{errorMessage && (
						<Alert variant="destructive">
							<AlertTitle>{t("Error")}</AlertTitle>
							<AlertDescription>{errorMessage}</AlertDescription>
						</Alert>
					)}
					<div className="grid gap-2">
						<Label htmlFor={emailId}>{t("Email")}</Label>
						<Input
							id={emailId}
							type="email"
							placeholder="m@example.com"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor={passwordId}>{t("Password")}</Label>
						<Input
							id={passwordId}
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
						/>
					</div>
				</CardContent>
				<CardFooter className="grid gap-2">
					<Button
						type="submit"
						className="w-full bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? t("Signing in...") : t("Sign in")}
					</Button>
					<div className="gap-2">
						<LanguageSelector />
					</div>
					<span className="mt-4 text-center text-sm">
						{t("Don't have an account?")}{" "}
						<Link to="/register" className="underline">
							{t("Sign up")}
						</Link>
					</span>
				</CardFooter>
			</Card>
		</form>
	);
}
