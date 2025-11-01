import { createFileRoute } from "@tanstack/react-router";
import { ChangePasswordForm } from "@/components/ChangePasswordForm";
import { EmailVerificationCard } from "@/components/EmailVerificationCard";
import { ProfileForm } from "@/components/ProfileForm";

export const Route = createFileRoute("/ProfilePage")({
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileForm />
      <ChangePasswordForm />
      <EmailVerificationCard />
    </div>
  );
}
