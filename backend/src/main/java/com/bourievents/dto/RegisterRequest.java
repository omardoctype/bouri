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
public class RegisterRequest {

    @NotBlank(message = "Le nom complet est obligatoire.")
    private String fullName;

    @NotBlank(message = "L'email est obligatoire.")
    @Email(message = "Format email invalide.")
    private String email;

    @NotBlank(message = "Le numero de telephone est obligatoire.")
    private String phone;

    @NotBlank(message = "Le mot de passe est obligatoire.")
    @Size(min = 6, message = "Le mot de passe doit contenir au moins 6 caracteres.")
    private String password;

    @NotBlank(message = "La ville est obligatoire.")
    private String city;
}

