import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  MoreHorizontal,
  ShieldCheck,
  BookOpen,
  User,
  ShieldAlert
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/users/${id}`, { role });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["users"]);
      toast.success(`User role updated to ${variables.role}`);
    },
    onError: () => {
      toast.error("Failed to update user role.");
    }
  });

  const handleRoleUpdate = (id, role) => {
    updateRoleMutation.mutate({ id, role });
  };

  // Helper to render role badge
  const getRoleBadge = (role) => {
    switch (role) {
      case "admin":
        return (
          <Badge className="gap-1 bg-violet-600 hover:bg-violet-700">
            <ShieldCheck className="h-3 w-3" /> Admin
          </Badge>
        );
      case "librarian":
        return (
          <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-300">
            <BookOpen className="h-3 w-3" /> Librarian
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="gap-1 text-muted-foreground">
            <User className="h-3 w-3" /> User
          </Badge>
        );
    }
  };

  if (isLoading) return <TableSkeleton />;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-muted-foreground">
            Manage access and permissions for {users.length} members.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Account Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} className="group">
                {/* User Column */}
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={user.photoURL} alt={user.name} />
                      <AvatarFallback className="uppercase">
                        {user.name?.slice(0, 2) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium leading-none">{user.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </TableCell>

                {/* Role Column */}
                <TableCell>
                  {getRoleBadge(user.role)}
                </TableCell>

                {/* Status Column (Placeholder based on context) */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-sm text-muted-foreground">Active</span>
                  </div>
                </TableCell>

                {/* Actions Column */}
                <TableCell className="text-right">
                  {user.role === "admin" ? (
                    <span className="text-xs text-muted-foreground italic pr-3">
                      Restricted
                    </span>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {user.role !== "librarian" && (
                          <DropdownMenuItem onClick={() => handleRoleUpdate(user._id, "librarian")}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            Make Librarian
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleRoleUpdate(user._id, "admin")}
                          className="text-violet-600 focus:text-violet-700">
                          <ShieldAlert className="mr-2 h-4 w-4" />
                          Promote to Admin
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const TableSkeleton = () => (
  <div className="p-8 max-w-7xl mx-auto space-y-6">
    <div className="h-8 w-48 bg-muted rounded animate-pulse" />
    <div className="border rounded-xl bg-card">
      <div className="p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ManageUsers;