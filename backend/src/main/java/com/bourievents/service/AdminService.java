package com.bourievents.service;

import com.bourievents.dto.BookingResponse;
import com.bourievents.dto.DashboardStatsResponse;
import com.bourievents.dto.UpdateBookingNoteRequest;
import com.bourievents.dto.UpdateBookingStatusRequest;
import com.bourievents.dto.UpdateClientActiveRequest;
import com.bourievents.dto.UserResponse;
import com.bourievents.entity.EventBooking;
import com.bourievents.entity.User;
import com.bourievents.entity.enums.BookingStatus;
import com.bourievents.entity.enums.EventType;
import com.bourievents.entity.enums.Role;
import com.bourievents.exception.ResourceNotFoundException;
import com.bourievents.mapper.BookingMapper;
import com.bourievents.mapper.UserMapper;
import com.bourievents.repository.EventBookingRepository;
import com.bourievents.repository.ProviderRepository;
import com.bourievents.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final EventBookingRepository eventBookingRepository;
    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final BookingMapper bookingMapper;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        long totalBookings = eventBookingRepository.count();
        long newBookings = eventBookingRepository.countByStatus(BookingStatus.NOUVELLE_DEMANDE);
        long inProgressBookings = eventBookingRepository.countByStatus(BookingStatus.EN_COURS);
        long confirmedBookings = eventBookingRepository.countByStatus(BookingStatus.CONFIRMEE);
        long cancelledBookings = eventBookingRepository.countByStatus(BookingStatus.ANNULEE);
        long totalClients = userRepository.countByRole(Role.CLIENT);
        long totalProviders = providerRepository.count();

        List<EventBooking> allBookings = eventBookingRepository.findAllByOrderByCreatedAtDesc();
        Map<String, Long> bookingsByStatus = buildBookingsByStatus(allBookings);
        Map<String, Long> bookingsByEventType = buildBookingsByEventType(allBookings);
        List<BookingResponse> latestBookings = allBookings.stream()
            .limit(10)
            .map(bookingMapper::toResponse)
            .toList();

        String mostRequestedEventType = bookingsByEventType.entrySet()
            .stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("N/A");

        return DashboardStatsResponse.builder()
            .totalBookings(totalBookings)
            .newBookings(newBookings)
            .inProgressBookings(inProgressBookings)
            .confirmedBookings(confirmedBookings)
            .cancelledBookings(cancelledBookings)
            .totalClients(totalClients)
            .totalProviders(totalProviders)
            .mostRequestedEventType(mostRequestedEventType)
            .bookingsByStatus(bookingsByStatus)
            .bookingsByEventType(bookingsByEventType)
            .latestBookings(latestBookings)
            .build();
    }

    @Transactional(readOnly = true)
    public List<BookingResponse> getBookings(BookingStatus status, EventType eventType, String search) {
        String normalizedSearch = normalizeSearch(search);

        return eventBookingRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .filter(booking -> status == null || booking.getStatus() == status)
            .filter(booking -> eventType == null || booking.getEventType() == eventType)
            .filter(booking -> matchesSearch(booking, normalizedSearch))
            .map(bookingMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId) {
        EventBooking booking = eventBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable."));
        return bookingMapper.toResponse(booking);
    }

    @Transactional
    public BookingResponse updateBookingStatus(Long bookingId, UpdateBookingStatusRequest request) {
        EventBooking booking = eventBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable."));

        bookingMapper.updateStatus(booking, request);
        EventBooking saved = eventBookingRepository.save(booking);
        return bookingMapper.toResponse(saved);
    }

    @Transactional
    public BookingResponse updateBookingNote(Long bookingId, UpdateBookingNoteRequest request) {
        EventBooking booking = eventBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable."));

        bookingMapper.updateAdminNote(booking, request);
        EventBooking saved = eventBookingRepository.save(booking);
        return bookingMapper.toResponse(saved);
    }

    @Transactional
    public void deleteBooking(Long bookingId) {
        EventBooking booking = eventBookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Reservation introuvable."));
        eventBookingRepository.delete(booking);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getClients() {
        return userRepository.findByRoleOrderByCreatedAtDesc(Role.CLIENT)
            .stream()
            .map(userMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getClientById(Long clientId) {
        User user = userRepository.findByIdAndRole(clientId, Role.CLIENT)
            .orElseThrow(() -> new ResourceNotFoundException("Client introuvable."));
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponse updateClientActive(Long clientId, UpdateClientActiveRequest request) {
        User user = userRepository.findByIdAndRole(clientId, Role.CLIENT)
            .orElseThrow(() -> new ResourceNotFoundException("Client introuvable."));

        user.setActive(Boolean.TRUE.equals(request.getActive()));
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    private String normalizeSearch(String search) {
        if (search == null) {
            return null;
        }
        String normalized = search.trim().toLowerCase(Locale.ROOT);
        return normalized.isEmpty() ? null : normalized;
    }

    private boolean matchesSearch(EventBooking booking, String normalizedSearch) {
        if (normalizedSearch == null) {
            return true;
        }

        return contains(booking.getFullName(), normalizedSearch)
            || contains(booking.getEmail(), normalizedSearch)
            || contains(booking.getPhone(), normalizedSearch)
            || contains(booking.getCity(), normalizedSearch);
    }

    private boolean contains(String value, String search) {
        return value != null && value.toLowerCase(Locale.ROOT).contains(search);
    }

    private Map<String, Long> buildBookingsByStatus(List<EventBooking> bookings) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (BookingStatus status : BookingStatus.values()) {
            map.put(status.name(), 0L);
        }
        for (EventBooking booking : bookings) {
            String key = booking.getStatus().name();
            map.put(key, map.getOrDefault(key, 0L) + 1L);
        }
        return map;
    }

    private Map<String, Long> buildBookingsByEventType(List<EventBooking> bookings) {
        Map<String, Long> map = new LinkedHashMap<>();
        for (EventType eventType : EventType.values()) {
            map.put(eventType.name(), 0L);
        }
        for (EventBooking booking : bookings) {
            String key = booking.getEventType().name();
            map.put(key, map.getOrDefault(key, 0L) + 1L);
        }
        return map;
    }
}

