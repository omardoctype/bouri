package com.bourievents.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class ServiceItemRequest {

    @NotBlank(message = "Le nom du service est obligatoire.")
    @Size(max = 120, message = "Le nom du service est trop long.")
    private String name;

    @NotBlank(message = "La categorie est obligatoire.")
    @Size(max = 120, message = "La categorie est trop longue.")
    private String category;

    @NotBlank(message = "La description est obligatoire.")
    @Size(max = 3000, message = "La description est trop longue.")
    private String description;

    @NotNull(message = "Le statut actif est obligatoire.")
    private Boolean active;
}

