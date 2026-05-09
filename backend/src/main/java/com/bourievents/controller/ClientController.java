package com.bourievents.controller;

import com.bourievents.dto.BookingRequest;
import com.bourievents.dto.BookingResponse;
import com.bourievents.dto.UpdateProfileRequest;
import com.bourievents.dto.UserResponse;
import com.bourievents.service.ClientService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @GetMapping("/me")
    public UserResponse getMe(Authentication authentication) {
        return clientService.getCurrentUserProfile(authentication);
    }

    @PutMapping("/me")
    public UserResponse updateMe(
        Authentication authentication,
        @Valid @RequestBody UpdateProfileRequest request
    ) {
        return clientService.updateCurrentUserProfile(authentication, request);
    }

    @PostMapping("/bookings")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
        Authentication authentication,
        @Valid @RequestBody BookingRequest request
    ) {
        return clientService.createBooking(authentication, request);
    }

    @GetMapping("/bookings")
    public List<BookingResponse> getMyBookings(Authentication authentication) {
        return clientService.getBookingsForCurrentUser(authentication);
    }

    @GetMapping("/bookings/{id}")
    public BookingResponse getMyBookingById(
        Authentication authentication,
        @PathVariable Long id
    ) {
        return clientService.getBookingByIdForCurrentUser(authentication, id);
    }
}

