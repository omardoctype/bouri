package com.bourievents.mapper;

import com.bourievents.dto.ServiceItemRequest;
import com.bourievents.dto.ServiceItemResponse;
import com.bourievents.entity.ServiceItem;
import org.springframework.stereotype.Component;

@Component
public class ServiceItemMapper {

    public ServiceItemResponse toResponse(ServiceItem entity) {
        if (entity == null) {
            return null;
        }

        return ServiceItemResponse.builder()
            .id(entity.getId())
            .name(entity.getName())
            .category(entity.getCategory())
            .description(entity.getDescription())
            .active(entity.isActive())
            .createdAt(entity.getCreatedAt())
            .updatedAt(entity.getUpdatedAt())
            .build();
    }

    public ServiceItem toEntity(ServiceItemRequest request) {
        if (request == null) {
            return null;
        }

        return ServiceItem.builder()
            .name(request.getName().trim())
            .category(request.getCategory().trim())
            .description(request.getDescription().trim())
            .active(Boolean.TRUE.equals(request.getActive()))
            .build();
    }

    public void updateEntity(ServiceItem entity, ServiceItemRequest request) {
        entity.setName(request.getName().trim());
        entity.setCategory(request.getCategory().trim());
        entity.setDescription(request.getDescription().trim());
        entity.setActive(Boolean.TRUE.equals(request.getActive()));
    }
}

