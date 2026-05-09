package com.bourievents.controller;

import com.bourievents.dto.BookingResponse;
import com.bourievents.dto.DashboardStatsResponse;
import com.bourievents.dto.UpdateBookingNoteRequest;
import com.bourievents.dto.UpdateBookingStatusRequest;
import com.bourievents.dto.UpdateClientActiveRequest;
import com.bourievents.dto.UserResponse;
import com.bourievents.entity.enums.BookingStatus;
import com.bourievents.entity.enums.EventType;
import com.bourievents.service.AdminService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard/stats")
    public DashboardStatsResponse getDashboardStats() {
        return adminService.getDashboardStats();
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getBookings(
        @RequestParam(required = false) BookingStatus status,
        @RequestParam(required = false) EventType eventType,
        @RequestParam(required = false) String search
    ) {
        return adminService.getBookings(status, eventType, search);
    }

    @GetMapping("/bookings/{id}")
    public BookingResponse getBookingById(@PathVariable Long id) {
        return adminService.getBookingById(id);
    }

    @PatchMapping("/bookings/{id}/status")
    public BookingResponse updateBookingStatus(
        @PathVariable Long id,
        @Valid @RequestBody UpdateBookingStatusRequest request
    ) {
        return adminService.updateBookingStatus(id, request);
    }

    @PutMapping("/bookings/{id}/note")
    public BookingResponse updateBookingNote(
        @PathVariable Long id,
        @Valid @RequestBody UpdateBookingNoteRequest request
    ) {
        return adminService.updateBookingNote(id, request);
    }

    @DeleteMapping("/bookings/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBooking(@PathVariable Long id) {
        adminService.deleteBooking(id);
    }

    @GetMapping("/clients")
    public List<UserResponse> getClients() {
        return adminService.getClients();
    }

    @GetMapping("/clients/{id}")
    public UserResponse getClientById(@PathVariable Long id) {
        return adminService.getClientById(id);
    }

    @PatchMapping("/clients/{id}/active")
    public UserResponse updateClientActive(
        @PathVariable Long id,
        @Valid @RequestBody UpdateClientActiveRequest request
    ) {
        return adminService.updateClientActive(id, request);
    }
}

