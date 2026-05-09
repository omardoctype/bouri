package com.bourievents.repository;

import com.bourievents.entity.Provider;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProviderRepository extends JpaRepository<Provider, Long> {

    List<Provider> findAllByOrderByCreatedAtDesc();

    List<Provider> findByAvailableTrueOrderByCreatedAtDesc();
}
