package com.bourievents.dto;

import com.bourievents.entity.enums.BookingStatus;
import jakarta.validation.constraints.NotNull;
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
public class UpdateBookingStatusRequest {

    @NotNull(message = "Le statut est obligatoire.")
    private BookingStatus status;
}

