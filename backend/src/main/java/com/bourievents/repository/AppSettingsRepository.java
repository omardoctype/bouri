package com.bourievents.repository;

import com.bourievents.entity.AppSettings;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppSettingsRepository extends JpaRepository<AppSettings, Long> {

    Optional<AppSettings> findTopByOrderByIdAsc();
}
