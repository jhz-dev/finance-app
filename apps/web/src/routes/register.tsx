import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { authRepository } from "@/infrastructure/ApiAuthRepository";

export function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const [name, _setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [showSuccessDialog, setShowSuccessDialog] = useState(false);

	const mutation = useMutation({
		mutationFn: () => authRepository.register({ name, email, password }),
		onSuccess: () => {
			setShowSuccessDialog(true);
		},
		onError: (error) => {
			if (isAxiosError(error)) {
				setErrorMessage(
					error.response?.data.message ||
						t("Registration failed. Please try again."),
				);
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
		<>
			<div className="flex items-center justify-center min-h-full">
				<form onSubmit={handleSubmit}>
					<Card className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 sm:p-12">
						<CardHeader>
							<CardTitle className="text-2xl text-slate-900 font-bold">
								{t("Sign Up")}
							</CardTitle>
							<CardDescription className="text-slate-500">
								{t("Enter your information to create an account.")}
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4">
							{errorMessage && (
								<Alert variant="destructive">
									<AlertTitle>{t("Error")}</AlertTitle>
									<AlertDescription>{errorMessage}</AlertDescription>
								</Alert>
							)}
							<LabeledInput
								id={nameId}
								label="Name"
								placeholder="Max Robinson"
								required
								value={name}
								onChange={(e) => _setName(e.target.value)}
								className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
							/>
							<LabeledInput
								id={emailId}
								label="Email"
								type="email"
								placeholder="m@example.com"
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
							/>
							<LabeledInput
								id={passwordId}
								label="Password"
								type="password"
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-white rounded-xl border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400"
							/>
						</CardContent>
						<CardFooter className="flex flex-col">
							<Button
								type="submit"
								className="w-full bg-emerald-500 text-white rounded-full py-3 px-6 font-semibold shadow-lg hover:bg-emerald-600 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
								disabled={mutation.isPending}
							>
								{mutation.isPending
									? t("Creating account...")
									: t("Create account")}
							</Button>
							<div className="mt-4 text-center text-sm">
								{t("Already have an account?")}{" "}
								<Link to="/login" className="underline">
									{t("Sign in")}
								</Link>
							</div>
						</CardFooter>
					</Card>
				</form>
			</div>
			<AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("Success!")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("Registration successful! Please sign in.")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogAction
							onClick={() => navigate({ to: "/login" })}
							className="bg-slate-200 text-slate-700 rounded-full py-3 px-6 font-semibold hover:bg-slate-300 transition-all"
						>
							{t("OK")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
