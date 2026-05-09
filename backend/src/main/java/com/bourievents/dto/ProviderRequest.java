package com.bourievents.dto;

import com.bourievents.entity.enums.ProviderCategory;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
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
public class ProviderRequest {

    @NotBlank(message = "Le nom du prestataire est obligatoire.")
    @Size(max = 120, message = "Le nom du prestataire est trop long.")
    private String name;

    @NotNull(message = "La categorie est obligatoire.")
    private ProviderCategory category;

    @NotBlank(message = "La ville est obligatoire.")
    private String city;

    @NotBlank(message = "La description est obligatoire.")
    @Size(max = 3000, message = "La description est trop longue.")
    private String description;

    @NotNull(message = "Le prix de depart est obligatoire.")
    @DecimalMin(value = "0.0", inclusive = true, message = "Le prix doit etre positif.")
    private BigDecimal priceFrom;

    @NotNull(message = "La note est obligatoire.")
    @DecimalMin(value = "0.0", inclusive = true, message = "La note minimale est 0.")
    @DecimalMax(value = "5.0", inclusive = true, message = "La note maximale est 5.")
    private Double rating;

    @Size(max = 500, message = "L'URL de l'image est trop longue.")
    private String imageUrl;

    @NotBlank(message = "Le telephone est obligatoire.")
    @Size(max = 30, message = "Le telephone est trop long.")
    private String phone;

    @Size(max = 255, message = "Le lien Instagram est trop long.")
    private String instagram;

    @NotNull(message = "Le statut de disponibilite est obligatoire.")
    private Boolean available;
}

