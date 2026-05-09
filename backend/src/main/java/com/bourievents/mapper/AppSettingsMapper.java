package com.bourievents.mapper;

import com.bourievents.dto.AppSettingsRequest;
import com.bourievents.dto.AppSettingsResponse;
import com.bourievents.entity.AppSettings;
import org.springframework.stereotype.Component;

@Component
public class AppSettingsMapper {

    public AppSettingsResponse toResponse(AppSettings entity) {
        if (entity == null) {
            return null;
        }

        return AppSettingsResponse.builder()
            .id(entity.getId())
            .agencyName(entity.getAgencyName())
            .agencyEmail(entity.getAgencyEmail())
            .whatsappNumber(entity.getWhatsappNumber())
            .instagramUrl(entity.getInstagramUrl())
            .facebookUrl(entity.getFacebookUrl())
            .build();
    }

    public AppSettings toEntity(AppSettingsRequest request) {
        if (request == null) {
            return null;
        }

        return AppSettings.builder()
            .agencyName(request.getAgencyName().trim())
            .agencyEmail(request.getAgencyEmail().trim().toLowerCase())
            .whatsappNumber(request.getWhatsappNumber().trim())
            .instagramUrl(trimToNull(request.getInstagramUrl()))
            .facebookUrl(trimToNull(request.getFacebookUrl()))
            .build();
    }

    public void updateEntity(AppSettings entity, AppSettingsRequest request) {
        entity.setAgencyName(request.getAgencyName().trim());
        entity.setAgencyEmail(request.getAgencyEmail().trim().toLowerCase());
        entity.setWhatsappNumber(request.getWhatsappNumber().trim());
        entity.setInstagramUrl(trimToNull(request.getInstagramUrl()));
        entity.setFacebookUrl(trimToNull(request.getFacebookUrl()));
    }

    private String trimToNull(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}

