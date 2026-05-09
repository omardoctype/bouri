package com.bourievents.dto;

import com.bourievents.entity.enums.Role;
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
public class AuthResponse {

    private String token;
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String city;
    private Role role;
}

