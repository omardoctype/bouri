package com.bourievents.dto;

import com.bourievents.entity.enums.EventType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
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
public class BookingRequest {

    @NotBlank(message = "Le nom complet est obligatoire.")
    private String fullName;

    @NotBlank(message = "L'email est obligatoire.")
    @Email(message = "Format email invalide.")
    private String email;

    @NotBlank(message = "Le telephone est obligatoire.")
    private String phone;

    @NotBlank(message = "La ville est obligatoire.")
    private String city;

    @NotNull(message = "Le type d'evenement est obligatoire.")
    private EventType eventType;

    @NotNull(message = "La date de l'evenement est obligatoire.")
    @FutureOrPresent(message = "La date de l'evenement doit etre aujourd'hui ou dans le futur.")
    private LocalDate eventDate;

    @NotBlank(message = "Le lieu est obligatoire.")
    private String location;

    @NotNull(message = "Le nombre d'invites est obligatoire.")
    @Min(value = 1, message = "Le nombre d'invites doit etre superieur a 0.")
    private Integer guestsCount;

    @NotBlank(message = "Le budget est obligatoire.")
    private String budget;

    @NotNull(message = "Au moins un service est obligatoire.")
    @Size(min = 1, message = "Au moins un service est obligatoire.")
    private List<@NotBlank(message = "Le nom du service est obligatoire.") String> requestedServices;

    private Long preferredProviderId;
    private String preferredProviderName;

    @Size(max = 4000, message = "Le message est trop long.")
    private String message;
}

