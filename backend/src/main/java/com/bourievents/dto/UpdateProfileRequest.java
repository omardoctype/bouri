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
public class UpdateProfileRequest {

    @NotBlank(message = "Le nom complet est obligatoire.")
    @Size(max = 120, message = "Le nom complet est trop long.")
    private String fullName;

    @NotBlank(message = "Le numero de telephone est obligatoire.")
    @Size(max = 30, message = "Le numero de telephone est trop long.")
    private String phone;

    @NotBlank(message = "La ville est obligatoire.")
    @Size(max = 80, message = "La ville est trop longue.")
    private String city;
}

