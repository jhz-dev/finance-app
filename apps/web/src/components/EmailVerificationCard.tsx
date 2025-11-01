import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { userRepository } from "@/infrastructure/ApiUserRepository";
import { useAuth } from "@/hooks/useAuth";

export function EmailVerificationCard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: () => userRepository.requestVerificationEmail(),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("Email Verification")}</CardTitle>
        <CardDescription>
          {t("Verify your email address to secure your account.")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {user?.emailVerified ? (
          <p className="text-green-600">{t("Email verified")}</p>
        ) : (
          <Button onClick={() => mutate()} disabled={isPending}>
            {isPending
              ? t("Sending...")
              : t("Send Verification Email")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
