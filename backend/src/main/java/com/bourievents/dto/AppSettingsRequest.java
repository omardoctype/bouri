package com.bourievents.dto;

import jakarta.validation.constraints.Email;
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
public class AppSettingsRequest {

    @NotBlank(message = "Le nom de l'agence est obligatoire.")
    @Size(max = 150, message = "Le nom de l'agence est trop long.")
    private String agencyName;

    @NotBlank(message = "L'email de l'agence est obligatoire.")
    @Email(message = "Format email invalide.")
    private String agencyEmail;

    @NotBlank(message = "Le numero WhatsApp est obligatoire.")
    @Size(max = 30, message = "Le numero WhatsApp est trop long.")
    private String whatsappNumber;

    @Size(max = 255, message = "Le lien Instagram est trop long.")
    private String instagramUrl;

    @Size(max = 255, message = "Le lien Facebook est trop long.")
    private String facebookUrl;
}

