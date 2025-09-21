package com.crm.repository;

import com.crm.model.EmailCampaign;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailCampaignRepository extends JpaRepository<EmailCampaign, Long> {
}