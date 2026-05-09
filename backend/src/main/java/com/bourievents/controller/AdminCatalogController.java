package com.bourievents.controller;

import com.bourievents.dto.AppSettingsRequest;
import com.bourievents.dto.AppSettingsResponse;
import com.bourievents.dto.ProviderRequest;
import com.bourievents.dto.ProviderResponse;
import com.bourievents.dto.ServiceItemRequest;
import com.bourievents.dto.ServiceItemResponse;
import com.bourievents.service.CatalogService;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminCatalogController {

    private final CatalogService catalogService;

    @PostMapping("/providers")
    @ResponseStatus(HttpStatus.CREATED)
    public ProviderResponse createProvider(@Valid @RequestBody ProviderRequest request) {
        return catalogService.createProvider(request);
    }

    @GetMapping("/providers")
    public List<ProviderResponse> getProviders() {
        return catalogService.getAdminProviders();
    }

    @GetMapping("/providers/{id}")
    public ProviderResponse getProviderById(@PathVariable Long id) {
        return catalogService.getAdminProviderById(id);
    }

    @PutMapping("/providers/{id}")
    public ProviderResponse updateProvider(
        @PathVariable Long id,
        @Valid @RequestBody ProviderRequest request
    ) {
        return catalogService.updateProvider(id, request);
    }

    @DeleteMapping("/providers/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProvider(@PathVariable Long id) {
        catalogService.deleteProvider(id);
    }

    @PatchMapping("/providers/{id}/availability")
    public ProviderResponse toggleProviderAvailability(@PathVariable Long id) {
        return catalogService.toggleProviderAvailability(id);
    }

    @PostMapping("/services")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceItemResponse createService(@Valid @RequestBody ServiceItemRequest request) {
        return catalogService.createService(request);
    }

    @GetMapping("/services")
    public List<ServiceItemResponse> getServices() {
        return catalogService.getAdminServices();
    }

    @PutMapping("/services/{id}")
    public ServiceItemResponse updateService(
        @PathVariable Long id,
        @Valid @RequestBody ServiceItemRequest request
    ) {
        return catalogService.updateService(id, request);
    }

    @DeleteMapping("/services/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteService(@PathVariable Long id) {
        catalogService.deleteService(id);
    }

    @GetMapping("/settings")
    public AppSettingsResponse getSettings() {
        return catalogService.getAppSettings();
    }

    @PutMapping("/settings")
    public AppSettingsResponse updateSettings(@Valid @RequestBody AppSettingsRequest request) {
        return catalogService.updateAppSettings(request);
    }
}

