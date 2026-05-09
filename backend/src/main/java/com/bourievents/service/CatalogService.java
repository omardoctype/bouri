package com.bourievents.service;

import com.bourievents.dto.AppSettingsRequest;
import com.bourievents.dto.AppSettingsResponse;
import com.bourievents.dto.ProviderRequest;
import com.bourievents.dto.ProviderResponse;
import com.bourievents.dto.ServiceItemRequest;
import com.bourievents.dto.ServiceItemResponse;
import com.bourievents.entity.AppSettings;
import com.bourievents.entity.Provider;
import com.bourievents.entity.ServiceItem;
import com.bourievents.exception.ResourceNotFoundException;
import com.bourievents.mapper.AppSettingsMapper;
import com.bourievents.mapper.ProviderMapper;
import com.bourievents.mapper.ServiceItemMapper;
import com.bourievents.repository.AppSettingsRepository;
import com.bourievents.repository.ProviderRepository;
import com.bourievents.repository.ServiceItemRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CatalogService {

    private static final List<String> EVENT_TYPES = List.of(
        "Mariage",
        "Anniversaire",
        "Soir\u00e9e Bac",
        "Fian\u00e7ailles",
        "Corporate",
        "Festival",
        "Soir\u00e9e priv\u00e9e",
        "Autre"
    );

    private static final List<String> BUDGET_OPTIONS = List.of(
        "Moins de 500 DT",
        "500 DT \u2013 1000 DT",
        "1000 DT \u2013 2000 DT",
        "2000 DT \u2013 5000 DT",
        "Plus de 5000 DT",
        "Je ne sais pas encore"
    );

    private final ProviderRepository providerRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final AppSettingsRepository appSettingsRepository;
    private final ProviderMapper providerMapper;
    private final ServiceItemMapper serviceItemMapper;
    private final AppSettingsMapper appSettingsMapper;

    @Transactional(readOnly = true)
    public List<ProviderResponse> getPublicProviders() {
        return providerRepository.findByAvailableTrueOrderByCreatedAtDesc()
            .stream()
            .map(providerMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProviderResponse getPublicProviderById(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
            .filter(Provider::isAvailable)
            .orElseThrow(() -> new ResourceNotFoundException("Prestataire introuvable."));
        return providerMapper.toResponse(provider);
    }

    @Transactional(readOnly = true)
    public List<ServiceItemResponse> getPublicServices() {
        return serviceItemRepository.findByActiveTrueOrderByCreatedAtDesc()
            .stream()
            .map(serviceItemMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public List<String> getEventTypes() {
        return EVENT_TYPES;
    }

    @Transactional(readOnly = true)
    public List<String> getBudgetOptions() {
        return BUDGET_OPTIONS;
    }

    @Transactional
    public ProviderResponse createProvider(ProviderRequest request) {
        Provider provider = providerMapper.toEntity(request);
        Provider saved = providerRepository.save(provider);
        return providerMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProviderResponse> getAdminProviders() {
        return providerRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(providerMapper::toResponse)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProviderResponse getAdminProviderById(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Prestataire introuvable."));
        return providerMapper.toResponse(provider);
    }

    @Transactional
    public ProviderResponse updateProvider(Long providerId, ProviderRequest request) {
        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Prestataire introuvable."));

        providerMapper.updateEntity(provider, request);
        Provider saved = providerRepository.save(provider);
        return providerMapper.toResponse(saved);
    }

    @Transactional
    public void deleteProvider(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Prestataire introuvable."));
        providerRepository.delete(provider);
    }

    @Transactional
    public ProviderResponse toggleProviderAvailability(Long providerId) {
        Provider provider = providerRepository.findById(providerId)
            .orElseThrow(() -> new ResourceNotFoundException("Prestataire introuvable."));

        provider.setAvailable(!provider.isAvailable());
        Provider saved = providerRepository.save(provider);
        return providerMapper.toResponse(saved);
    }

    @Transactional
    public ServiceItemResponse createService(ServiceItemRequest request) {
        ServiceItem serviceItem = serviceItemMapper.toEntity(request);
        ServiceItem saved = serviceItemRepository.save(serviceItem);
        return serviceItemMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ServiceItemResponse> getAdminServices() {
        return serviceItemRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(serviceItemMapper::toResponse)
            .toList();
    }

    @Transactional
    public ServiceItemResponse updateService(Long serviceId, ServiceItemRequest request) {
        ServiceItem serviceItem = serviceItemRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service introuvable."));

        serviceItemMapper.updateEntity(serviceItem, request);
        ServiceItem saved = serviceItemRepository.save(serviceItem);
        return serviceItemMapper.toResponse(saved);
    }

    @Transactional
    public void deleteService(Long serviceId) {
        ServiceItem serviceItem = serviceItemRepository.findById(serviceId)
            .orElseThrow(() -> new ResourceNotFoundException("Service introuvable."));
        serviceItemRepository.delete(serviceItem);
    }

    @Transactional(readOnly = true)
    public AppSettingsResponse getAppSettings() {
        return appSettingsMapper.toResponse(getOrCreateSettings());
    }

    @Transactional
    public AppSettingsResponse updateAppSettings(AppSettingsRequest request) {
        AppSettings settings = getOrCreateSettings();
        appSettingsMapper.updateEntity(settings, request);
        AppSettings saved = appSettingsRepository.save(settings);
        return appSettingsMapper.toResponse(saved);
    }

    private AppSettings getOrCreateSettings() {
        return appSettingsRepository.findTopByOrderByIdAsc()
            .orElseGet(() -> appSettingsRepository.save(
                AppSettings.builder()
                    .agencyName("Bouri Events")
                    .agencyEmail("faresbouri32@gmail.com")
                    .whatsappNumber("216XXXXXXXX")
                    .instagramUrl(null)
                    .facebookUrl(null)
                    .build()
            ));
    }
}
