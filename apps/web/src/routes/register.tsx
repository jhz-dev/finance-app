import { Link, useNavigate } from "@tanstack/react-router";
import { useId, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { useRegister } from "@/hooks/useRegister";

export function RegisterPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const mutation = useRegister();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		mutation.mutate(
			{ name, email, password },
			{
				onSuccess: () => {
					navigate({ to: "/login" });
				},
			},
		);
	};

	return (
		<form 
      className="flex flex-col items-center gap-4 w-[100%]"
      onSubmit={handleSubmit}>
      <Card className="w-full max-w-lg bg-background shadow-2xl p-8 sm:p-12">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {t("Sign Up")}
          </CardTitle>
          <CardDescription className="text-foreground-500">
            {t("Enter your information to create an account.")}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <LabeledInput
            id={nameId}
            label="Name"
            placeholder="Max Robinson"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="******"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button
            type="submit"
            className="main-button"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? t("Creating account...")
              : t("Create account")}
          </Button>
          <div className="mt-4 text-center text-sm">
            {t("Already have an account?")}{" "}
            <Link to="/login" className="underline text-primary">
              {t("Sign in")}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </form>
	);
}
