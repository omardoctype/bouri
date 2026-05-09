package com.bourievents.config;

import com.bourievents.entity.AppSettings;
import com.bourievents.entity.Provider;
import com.bourievents.entity.ServiceItem;
import com.bourievents.entity.User;
import com.bourievents.entity.enums.ProviderCategory;
import com.bourievents.entity.enums.Role;
import com.bourievents.repository.AppSettingsRepository;
import com.bourievents.repository.ProviderRepository;
import com.bourievents.repository.ServiceItemRepository;
import com.bourievents.repository.UserRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private static final String ADMIN_EMAIL = "admin@bourievents.tn";
    private static final String AGENCY_EMAIL = "faresbouri32@gmail.com";

    private final UserRepository userRepository;
    private final ProviderRepository providerRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final AppSettingsRepository appSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        try {
            seedAdmin();
            seedProviders();
            seedServices();
            seedAppSettings();
        } catch (RuntimeException ex) {
            log.warn("Demo seed skipped because database is currently unavailable: {}", ex.getMessage());
        }
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail(ADMIN_EMAIL)) {
            return;
        }

        User admin = User.builder()
            .fullName("Admin System")
            .email(ADMIN_EMAIL)
            .phone("21600000000")
            .password(passwordEncoder.encode("Admin123!"))
            .city("Tunis")
            .role(Role.ADMIN)
            .active(true)
            .build();

        userRepository.save(admin);
    }

    private void seedProviders() {
        if (providerRepository.count() > 0) {
            return;
        }

        List<Provider> providers = List.of(
            provider("Lumiere Royale Studio", ProviderCategory.PHOTOGRAPHE, "Tunis", "Photographie mariage et soirees premium.", "1200.00", 4.9, "21620111222"),
            provider("Atlas Lens Sfax", ProviderCategory.PHOTOGRAPHE, "Sfax", "Reportage photo lifestyle pour evenements familiaux.", "850.00", 4.7, "21655100331"),
            provider("Nabeul Moments", ProviderCategory.PHOTOGRAPHE, "Nabeul", "Photo storytelling pour fiancailles et anniversaires.", "700.00", 4.6, "21629144110"),
            provider("Pulse Night DJ", ProviderCategory.DJ, "Sousse", "DJ set moderne, pop, orientale et deep house.", "600.00", 4.8, "21622447788"),
            provider("Carthage Beats", ProviderCategory.DJ, "Monastir", "Animation musicale, transitions live et ambiance club.", "750.00", 4.7, "21654788192"),
            provider("Medina Live Band", ProviderCategory.BAND, "Mahdia", "Band live pour mariages, corporate et festivals.", "1800.00", 4.8, "21650991337"),
            provider("Nour Deco Lab", ProviderCategory.DECORATION, "Tunis", "Decors elegant, fleuristerie et mise en scene.", "1400.00", 4.9, "21698001472"),
            provider("Jasmin Design Events", ProviderCategory.DECORATION, "Nabeul", "Concept decoratif complet avec themes sur mesure.", "1100.00", 4.6, "21622299221"),
            provider("Djerba Visual Films", ProviderCategory.VIDEASTE, "Djerba", "Video cinematic, teaser social media et highlights.", "1600.00", 4.8, "21628977004"),
            provider("Bizerte Motion Crew", ProviderCategory.VIDEASTE, "Bizerte", "Captation multicamera et montage rapide.", "1300.00", 4.5, "21653228761"),
            provider("Sonic Light Pro", ProviderCategory.SON_LUMIERE, "Sousse", "Sonorisation professionnelle et light show intelligent.", "2000.00", 4.9, "21655800412"),
            provider("Amina Live Show", ProviderCategory.ARTISTE, "Tunis", "Performance live orientale et pop tunisienne.", "2500.00", 4.9, "21626101919")
        );

        providerRepository.saveAll(providers);
    }

    private void seedServices() {
        if (serviceItemRepository.count() > 0) {
            return;
        }

        List<ServiceItem> services = List.of(
            service("Photographe", "Capture", "Shooting evenementiel et retouche premium."),
            service("Vid\u00e9aste", "Capture", "Captation video et montage cinematic."),
            service("DJ", "Animation", "Mix live et playlists personnalisees."),
            service("Band musical", "Animation", "Groupe live pour moments forts."),
            service("Artiste live", "Animation", "Show artistique personnalise."),
            service("D\u00e9coration", "Decoration", "Scenographie, fleurs et design d'espace."),
            service("Sonorisation", "Technique", "Installation son et regie complete."),
            service("Lumi\u00e8re", "Technique", "Design lumieres intelligent et ambiance."),
            service("Salle", "Lieu", "Selection et reservation de salle."),
            service("Animation", "Animation", "MC, jeux et experience invites."),
            service("Organisation compl\u00e8te", "Coordination", "Gestion complete du projet evenementiel.")
        );

        serviceItemRepository.saveAll(services);
    }

    private void seedAppSettings() {
        if (appSettingsRepository.count() > 0) {
            return;
        }

        AppSettings settings = AppSettings.builder()
            .agencyName("Bouri Events")
            .agencyEmail(AGENCY_EMAIL)
            .whatsappNumber("216XXXXXXXX")
            .instagramUrl(null)
            .facebookUrl(null)
            .build();

        appSettingsRepository.save(settings);
    }

    private Provider provider(
        String name,
        ProviderCategory category,
        String city,
        String description,
        String priceFrom,
        double rating,
        String phone
    ) {
        return Provider.builder()
            .name(name)
            .category(category)
            .city(city)
            .description(description)
            .priceFrom(new BigDecimal(priceFrom))
            .rating(rating)
            .imageUrl(null)
            .phone(phone)
            .instagram(null)
            .available(true)
            .build();
    }

    private ServiceItem service(String name, String category, String description) {
        return ServiceItem.builder()
            .name(name)
            .category(category)
            .description(description)
            .active(true)
            .build();
    }
}
