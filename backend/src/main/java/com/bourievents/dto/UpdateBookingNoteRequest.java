package com.bourievents.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
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
public class UpdateBookingNoteRequest {

    @NotBlank(message = "La note admin est obligatoire.")
    @Size(max = 4000, message = "La note admin est trop longue.")
    private String adminNote;
}

