package com.bourievents.mapper;

import com.bourievents.dto.AuthResponse;
import com.bourievents.dto.UpdateProfileRequest;
import com.bourievents.dto.UserResponse;
import com.bourievents.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .city(user.getCity())
            .role(user.getRole())
            .active(user.isActive())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
    }

    public AuthResponse toAuthResponse(User user, String token) {
        if (user == null) {
            return null;
        }

        return AuthResponse.builder()
            .token(token)
            .id(user.getId())
            .fullName(user.getFullName())
            .email(user.getEmail())
            .phone(user.getPhone())
            .city(user.getCity())
            .role(user.getRole())
            .build();
    }

    public void updateEntity(User user, UpdateProfileRequest request) {
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        user.setCity(request.getCity().trim());
    }
}

