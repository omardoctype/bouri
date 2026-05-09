package com.bourievents.mapper;

import com.bourievents.dto.ProviderRequest;
import com.bourievents.dto.ProviderResponse;
import com.bourievents.entity.Provider;
import org.springframework.stereotype.Component;

@Component
public class ProviderMapper {

    public ProviderResponse toResponse(Provider provider) {
        if (provider == null) {
            return null;
        }

        return ProviderResponse.builder()
            .id(provider.getId())
            .name(provider.getName())
            .category(provider.getCategory())
            .city(provider.getCity())
            .description(provider.getDescription())
            .priceFrom(provider.getPriceFrom())
            .rating(provider.getRating())
            .imageUrl(provider.getImageUrl())
            .phone(provider.getPhone())
            .instagram(provider.getInstagram())
            .available(provider.isAvailable())
            .createdAt(provider.getCreatedAt())
            .updatedAt(provider.getUpdatedAt())
            .build();
    }

    public Provider toEntity(ProviderRequest request) {
        if (request == null) {
            return null;
        }

        return Provider.builder()
            .name(request.getName().trim())
            .category(request.getCategory())
            .city(request.getCity().trim())
            .description(request.getDescription().trim())
            .priceFrom(request.getPriceFrom())
            .rating(request.getRating())
            .imageUrl(trimToNull(request.getImageUrl()))
            .phone(request.getPhone().trim())
            .instagram(trimToNull(request.getInstagram()))
            .available(Boolean.TRUE.equals(request.getAvailable()))
            .build();
    }

    public void updateEntity(Provider provider, ProviderRequest request) {
        provider.setName(request.getName().trim());
        provider.setCategory(request.getCategory());
        provider.setCity(request.getCity().trim());
        provider.setDescription(request.getDescription().trim());
        provider.setPriceFrom(request.getPriceFrom());
        provider.setRating(request.getRating());
        provider.setImageUrl(trimToNull(request.getImageUrl()));
        provider.setPhone(request.getPhone().trim());
        provider.setInstagram(trimToNull(request.getInstagram()));
        provider.setAvailable(Boolean.TRUE.equals(request.getAvailable()));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

