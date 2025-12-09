import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ========= FETCH USERS =========
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // ========= UNIFIED UPDATE ROLE MUTATION =========
  const updateRoleMutation = useMutation({
    mutationFn: async ({ id, role }) => {
      return axiosSecure.patch(`/users/${id}`, { role });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  // ====== HANDLERS ======
  const handleMakeLibrarian = (id) => {
    updateRoleMutation.mutate({ id, role: "librarian" });
  };

  const handleMakeAdmin = (id) => {
    updateRoleMutation.mutate({ id, role: "admin" });
  };

  if (isLoading) return <div className="p-6">Loading users...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Manage Users</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user._id}>
              <TableCell> <img className="w-9 h-9 rounded" src={user.photoURL} alt="" /> </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>

              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {user.role}
                </Badge>
              </TableCell>

              <TableCell className="text-right space-x-2">

                {user.role === "user" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMakeLibrarian(user._id)}
                    >
                      Make Librarian
                    </Button>

                    <Button size="sm" onClick={() => handleMakeAdmin(user._id)}>
                      Make Admin
                    </Button>
                  </>
                )}

                {user.role === "librarian" && (
                  <Button size="sm" onClick={() => handleMakeAdmin(user._id)}>
                    Make Admin
                  </Button>
                )}

                {user.role === "admin" && (
                  <span className="text-sm text-muted-foreground">
                    Already Admin
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ManageUsers;