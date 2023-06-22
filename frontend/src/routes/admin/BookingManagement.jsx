import React from "react";
import { getBookings } from "../../services/api";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export default function BookingManagement() {
  const { data } = useQuery(["bookings"], getBookings);
  // booking_id, user_id, show_id, seat_id, booking_date, amount
  return (
    <Container>
      <h1>Booking Management</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Booking Id</TableCell>
            <TableCell>User Id</TableCell>
            <TableCell>Show Id</TableCell>
            <TableCell>Seat Id</TableCell>
            <TableCell>Booking Date</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.bookings?.map((booking) => (
            <TableRow key={booking.booking_id}>
              <TableCell>{booking.booking_id}</TableCell>
              <TableCell>{booking.user_id}</TableCell>
              <TableCell>{booking.show_id}</TableCell>
              <TableCell>{booking.seat_id}</TableCell>
              <TableCell>{booking.booking_date}</TableCell>
              <TableCell>{booking.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
}
