package com.bourievents.repository;

import com.bourievents.entity.ServiceItem;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {

    List<ServiceItem> findAllByOrderByCreatedAtDesc();

    List<ServiceItem> findByActiveTrueOrderByCreatedAtDesc();
}
