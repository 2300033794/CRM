package com.crm.repository;

import com.crm.model.CustomerCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerCampaignRepository extends JpaRepository<CustomerCampaign, Long> {
    List<CustomerCampaign> findByCustomerId(Long customerId);
    List<CustomerCampaign> findByStatus(String status);

    // **NEW**: Method to delete campaigns when a customer is deleted
    @Modifying
    @Query("DELETE FROM CustomerCampaign c WHERE c.customer.id = :customerId")
    void deleteByCustomerId(@Param("customerId") Long customerId);
}