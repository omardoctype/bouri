package com.bourievents.controller;

import com.bourievents.dto.ProviderResponse;
import com.bourievents.dto.ServiceItemResponse;
import com.bourievents.service.CatalogService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final CatalogService catalogService;

    @GetMapping("/providers")
    public List<ProviderResponse> getProviders() {
        return catalogService.getPublicProviders();
    }

    @GetMapping("/providers/{id}")
    public ProviderResponse getProviderById(@PathVariable Long id) {
        return catalogService.getPublicProviderById(id);
    }

    @GetMapping("/services")
    public List<ServiceItemResponse> getServices() {
        return catalogService.getPublicServices();
    }

    @GetMapping("/event-types")
    public List<String> getEventTypes() {
        return catalogService.getEventTypes();
    }

    @GetMapping("/budget-options")
    public List<String> getBudgetOptions() {
        return catalogService.getBudgetOptions();
    }
}

