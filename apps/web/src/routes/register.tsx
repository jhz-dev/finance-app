import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { isAxiosError } from "axios";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authRepository } from "@/infrastructure/ApiAuthRepository";

export function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [name, setName] = useState("");
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
					<Card className="w-full max-w-sm">
						<CardHeader>
							<CardTitle className="text-2xl">{t("Sign Up")}</CardTitle>
							<CardDescription>
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
							<div className="grid gap-2">
								<Label htmlFor="name">{t("Name")}</Label>
								<Input
									id="name"
									placeholder="Max Robinson"
									required
									value={name}
									onChange={(e) => setName(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="email">{t("Email")}</Label>
								<Input
									id="email"
									type="email"
									placeholder="m@example.com"
									required
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="grid gap-2">
								<Label htmlFor="password">{t("Password")}</Label>
								<Input
									id="password"
									type="password"
									required
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex flex-col">
							<Button
								type="submit"
								className="w-full"
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
						<AlertDialogAction onClick={() => navigate({ to: "/login" })}>
							{t("OK")}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
