package com.bourievents.dto;

import com.bourievents.entity.enums.ProviderCategory;
import java.math.BigDecimal;
import java.time.LocalDateTime;
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
public class ProviderResponse {

    private Long id;
    private String name;
    private ProviderCategory category;
    private String city;
    private String description;
    private BigDecimal priceFrom;
    private Double rating;
    private String imageUrl;
    private String phone;
    private String instagram;
    private boolean available;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

