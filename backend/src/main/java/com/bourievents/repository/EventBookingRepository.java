package com.bourievents.repository;

import com.bourievents.entity.EventBooking;
import com.bourievents.entity.enums.BookingStatus;
import com.bourievents.entity.enums.EventType;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventBookingRepository extends JpaRepository<EventBooking, Long> {

    List<EventBooking> findByClientId(Long clientId);

    List<EventBooking> findByClientIdOrderByCreatedAtDesc(Long clientId);

    Optional<EventBooking> findByIdAndClientId(Long id, Long clientId);

    List<EventBooking> findAllByOrderByCreatedAtDesc();

    Optional<EventBooking> findTopByReferenceStartingWithOrderByReferenceDesc(String referencePrefix);

    long countByStatus(BookingStatus status);

    long countByEventType(EventType eventType);
}
