import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { getUsers, updateUser } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export default function UserManagement() {
  const { data, refetch } = useQuery(["users"], getUsers);

  const updateRole = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      refetch();
      enqueueSnackbar("Role updated", {
        variant: "success",
      });
    } catch (error) {
      enqueueSnackbar(error.message || "Something went wrong", {
        variant: "error",
      });
    }
  };

  return (
    <Container>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User Id</TableCell>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Phone Number</TableCell>
            <TableCell>Update Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.users?.map((user) => (
            <TableRow key={user.user_id}>
              <TableCell>{user.user_id}</TableCell>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>{user.phone_number}</TableCell>
              <TableCell>
                <select
                  onChange={(e) => updateRole(user.user_id, e.target.value)}
                  defaultValue={user.role}
                >
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
