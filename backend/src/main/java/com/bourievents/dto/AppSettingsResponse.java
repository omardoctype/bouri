package com.bourievents.dto;

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
public class AppSettingsResponse {

    private Long id;
    private String agencyName;
    private String agencyEmail;
    private String whatsappNumber;
    private String instagramUrl;
    private String facebookUrl;
}

