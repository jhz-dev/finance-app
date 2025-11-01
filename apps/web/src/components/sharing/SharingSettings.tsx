import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { budgetRepository } from "@/infrastructure/ApiBudgetRepository";
import { useTranslation } from "react-i18next";
import { useParams } from "@tanstack/react-router";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Trash2, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { BudgetMember, BudgetRole } from "@/domain/transaction/budget";
import { useAuth } from "@/hooks/useAuth";

const inviteUserSchema = z.object({
  email: z.string().email(),
  role: z.enum(["VIEWER", "EDITOR"]),
});

export function SharingSettings() {
  const { t } = useTranslation();
  const { budgetId } = useParams({ from: "/budgets/$budgetId" });
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const {
    data: budget,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["budgets", budgetId],
    queryFn: () => budgetRepository.getById(budgetId),
    enabled: !!budgetId,
  });

  const form = useForm<z.infer<typeof inviteUserSchema>>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: "",
      role: "VIEWER",
    },
  });

  const { mutate: inviteUser } = useMutation({
    mutationFn: (data: z.infer<typeof inviteUserSchema>) =>
      budgetRepository.inviteUser(budgetId, data.email, data.role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
      form.reset();
    },
  });

  const { mutate: updateMemberRole } = useMutation({
    mutationFn: ({
      memberId,
      role,
    }: {
      memberId: string;
      role: BudgetRole;
    }) => budgetRepository.updateMemberRole(budgetId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });

  const { mutate: removeMember } = useMutation({
    mutationFn: (memberId: string) =>
      budgetRepository.removeMember(budgetId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["budgets", budgetId] });
    },
  });

  function onSubmit(data: z.infer<typeof inviteUserSchema>) {
    inviteUser(data);
  }

  const isOwner = budget?.ownerId === user?.id;

  if (isLoading) {
    return <div>{t("Loading...")}</div>;
  }

  if (isError || !budget) {
    return <div>{t("Error loading budget details.")}</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("Manage Access")}</CardTitle>
          <CardDescription>
            {t("View and manage who has access to this budget.")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("Member")}</TableHead>
                <TableHead>{t("Role")}</TableHead>
                {isOwner && <TableHead className="text-right"></TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {budget.members.map((member: BudgetMember) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium flex items-center">
                    <Avatar className="h-9 w-9 mr-4">
                      <AvatarFallback>
                        {member.user.name?.charAt(0).toUpperCase() ||
                          member.user.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{member.user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {isOwner ? (
                      <Select
                        value={member.role}
                        onValueChange={(role: BudgetRole) =>
                          updateMemberRole({ memberId: member.id, role })
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VIEWER">{t("Viewer")}</SelectItem>
                          <SelectItem value="EDITOR">{t("Editor")}</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      member.role
                    )}
                  </TableCell>
                  {isOwner && (
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("Open menu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => removeMember(member.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t("Remove")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isOwner && (
        <Card>
          <CardHeader>
            <CardTitle>{t("Invite New Member")}</CardTitle>
            <CardDescription>
              {t("Invite another user to collaborate on this budget.")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex items-center space-x-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormControl>
                        <Input
                          placeholder={t("name@example.com")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder={t("Select a role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="VIEWER">{t("Viewer")}</SelectItem>
                          <SelectItem value="EDITOR">{t("Editor")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("Invite")}</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
