package com.bourievents.service;

import com.bourievents.dto.AuthResponse;
import com.bourievents.dto.LoginRequest;
import com.bourievents.dto.RegisterRequest;
import com.bourievents.entity.User;
import com.bourievents.entity.enums.Role;
import com.bourievents.exception.DuplicateResourceException;
import com.bourievents.exception.UnauthorizedException;
import com.bourievents.mapper.UserMapper;
import com.bourievents.repository.UserRepository;
import com.bourievents.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("Cet email est deja utilise.");
        }

        User user = User.builder()
            .fullName(request.getFullName().trim())
            .email(normalizedEmail)
            .phone(request.getPhone().trim())
            .password(passwordEncoder.encode(request.getPassword()))
            .city(request.getCity().trim())
            .role(Role.CLIENT)
            .active(true)
            .build();

        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved);
        return userMapper.toAuthResponse(saved, token);
    }

    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = normalizeEmail(request.getEmail());
        User user = userRepository.findByEmail(normalizedEmail)
            .orElseThrow(() -> new UnauthorizedException("Email ou mot de passe invalide."));

        if (!user.isActive()) {
            throw new AccessDeniedException("Ce compte est desactive.");
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedEmail, request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new UnauthorizedException("Email ou mot de passe invalide.");
        }

        String token = jwtService.generateToken(user);
        return userMapper.toAuthResponse(user, token);
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}
