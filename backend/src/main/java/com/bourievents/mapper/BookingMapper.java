package com.bourievents.mapper;

import com.bourievents.dto.BookingRequest;
import com.bourievents.dto.BookingResponse;
import com.bourievents.dto.UpdateBookingNoteRequest;
import com.bourievents.dto.UpdateBookingStatusRequest;
import com.bourievents.entity.EventBooking;
import com.bourievents.entity.Provider;
import com.bourievents.entity.User;
import com.bourievents.entity.enums.BookingStatus;
import java.util.ArrayList;
import org.springframework.stereotype.Component;

@Component
public class BookingMapper {

    public BookingResponse toResponse(EventBooking booking) {
        if (booking == null) {
            return null;
        }

        return BookingResponse.builder()
            .id(booking.getId())
            .reference(booking.getReference())
            .clientId(booking.getClient() != null ? booking.getClient().getId() : null)
            .fullName(booking.getFullName())
            .email(booking.getEmail())
            .phone(booking.getPhone())
            .city(booking.getCity())
            .eventType(booking.getEventType())
            .eventDate(booking.getEventDate())
            .location(booking.getLocation())
            .guestsCount(booking.getGuestsCount())
            .budget(booking.getBudget())
            .requestedServices(new ArrayList<>(booking.getRequestedServices()))
            .preferredProviderId(booking.getPreferredProvider() != null ? booking.getPreferredProvider().getId() : null)
            .preferredProviderName(booking.getPreferredProviderName())
            .message(booking.getMessage())
            .status(booking.getStatus())
            .adminNote(booking.getAdminNote())
            .createdAt(booking.getCreatedAt())
            .updatedAt(booking.getUpdatedAt())
            .build();
    }

    public EventBooking toEntity(BookingRequest request, User client, Provider preferredProvider, String reference) {
        if (request == null) {
            return null;
        }

        String preferredName = preferredProvider != null
            ? preferredProvider.getName()
            : trimToNull(request.getPreferredProviderName());

        return EventBooking.builder()
            .reference(reference)
            .client(client)
            .fullName(request.getFullName().trim())
            .email(request.getEmail().trim().toLowerCase())
            .phone(request.getPhone().trim())
            .city(request.getCity().trim())
            .eventType(request.getEventType())
            .eventDate(request.getEventDate())
            .location(request.getLocation().trim())
            .guestsCount(request.getGuestsCount())
            .budget(request.getBudget().trim())
            .requestedServices(new ArrayList<>(request.getRequestedServices()))
            .preferredProvider(preferredProvider)
            .preferredProviderName(preferredName)
            .message(trimToNull(request.getMessage()))
            .status(BookingStatus.NOUVELLE_DEMANDE)
            .build();
    }

    public void updateStatus(EventBooking booking, UpdateBookingStatusRequest request) {
        booking.setStatus(request.getStatus());
    }

    public void updateAdminNote(EventBooking booking, UpdateBookingNoteRequest request) {
        booking.setAdminNote(request.getAdminNote().trim());
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

