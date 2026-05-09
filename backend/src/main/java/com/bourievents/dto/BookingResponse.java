package com.bourievents.dto;

import com.bourievents.entity.enums.BookingStatus;
import com.bourievents.entity.enums.EventType;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingResponse {

    private Long id;
    private String reference;
    private Long clientId;
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private EventType eventType;
    private LocalDate eventDate;
    private String location;
    private Integer guestsCount;
    private String budget;
    private List<String> requestedServices;
    private Long preferredProviderId;
    private String preferredProviderName;
    private String message;
    private BookingStatus status;
    private String adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

