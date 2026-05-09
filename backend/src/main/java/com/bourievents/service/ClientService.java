package com.bourievents.service;

import com.bourievents.dto.BookingRequest;
import com.bourievents.dto.BookingResponse;
import com.bourievents.dto.UpdateProfileRequest;
import com.bourievents.dto.UserResponse;
import com.bourievents.entity.EventBooking;
import com.bourievents.entity.Provider;
import com.bourievents.entity.User;
import com.bourievents.entity.enums.Role;
import com.bourievents.exception.ResourceNotFoundException;
import com.bourievents.exception.UnauthorizedException;
import com.bourievents.mapper.BookingMapper;
import com.bourievents.mapper.UserMapper;
import com.bourievents.repository.EventBookingRepository;
import com.bourievents.repository.ProviderRepository;
import com.bourievents.repository.UserRepository;
import java.time.LocalDate;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final EventBookingRepository eventBookingRepository;
    private final UserMapper userMapper;
    private final BookingMapper bookingMapper;

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserProfile(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateCurrentUserProfile(Authentication authentication, UpdateProfileRequest request) {
        User user = getAuthenticatedUser(authentication);
        userMapper.updateEntity(user, request);
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Transactional
    public BookingResponse createBooking(Authentication authentication, BookingRequest request) {
        User user = getAuthenticatedUser(authentication);

        Provider preferredProvider = null;
        if (request.getPreferredProviderId() != null) {
            preferredProvider = providerRepository.findById(request.getPreferredProviderId())
                .orElseThrow(() -> new ResourceNotFoundException("Prestataire prefere introuvable."));
        }

        String reference = generateBookingReference();
        EventBooking booking = bookingMapper.toEntity(request, user, preferredProvider, reference);
        EventBooking saved = eventBookingRepository.save(booking);
        return bookingMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookingsForCurrentUser(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        List<EventBooking> bookings = isAdmin(user)
            ? eventBookingRepository.findAllByOrderByCreatedAtDesc()
            : eventBookingRepository.findByClientIdOrderByCreatedAtDesc(user.getId());

        return bookings.stream().map(bookingMapper::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingByIdForCurrentUser(Authentication authentication, Long bookingId) {
        User user = getAuthenticatedUser(authentication);

        EventBooking booking = isAdmin(user)
            ? eventBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable."))
            : eventBookingRepository.findByIdAndClientId(bookingId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable."));

        return bookingMapper.toResponse(booking);
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new UnauthorizedException("Utilisateur non authentifie.");
        }

        String email = authentication.getName().trim().toLowerCase();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new UnauthorizedException("Utilisateur non authentifie."));
    }

    private boolean isAdmin(User user) {
        return user.getRole() == Role.ADMIN;
    }

    private synchronized String generateBookingReference() {
        int year = LocalDate.now().getYear();
        String prefix = "BE-" + year + "-";

        long nextSequence = eventBookingRepository.findTopByReferenceStartingWithOrderByReferenceDesc(prefix)
            .map(EventBooking::getReference)
            .map(reference -> extractNextSequence(reference, prefix))
            .orElse(1L);

        return prefix + String.format("%06d", nextSequence);
    }

    private long extractNextSequence(String reference, String prefix) {
        if (reference == null || !reference.startsWith(prefix)) {
            return 1L;
        }

        String raw = reference.substring(prefix.length());
        try {
            return Long.parseLong(raw) + 1L;
        } catch (NumberFormatException ex) {
            return 1L;
        }
    }
}

