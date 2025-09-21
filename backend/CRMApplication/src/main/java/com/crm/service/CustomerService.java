package com.crm.service;

import com.crm.model.CustomerCampaign;
import com.crm.model.EmailCampaign;
import com.crm.model.Interaction;
import com.crm.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Map;

public interface CustomerService {

    // Profile Management
    User getCustomerById(Long id);
    User updateCustomer(Long id, User userDetails);
    void changePassword(Long customerId, String currentPassword, String newPassword);
    User findUserByUsername(String username);

    // Analytics
    Map<String, Object> getCustomerAnalytics(Long customerId);

    // Interactions & Campaigns
    Page<Interaction> getInteractionsForCustomer(Long customerId, String type, String searchTerm, Pageable pageable);
    List<EmailCampaign> getCampaignsForCustomer(Long customerId);
    Interaction addInteraction(Long customerId, Interaction interaction);

    // Customer Submitted Campaigns
    CustomerCampaign submitCampaign(Long customerId, CustomerCampaign campaign);
    List<CustomerCampaign> getSubmittedCampaigns(Long customerId);
}