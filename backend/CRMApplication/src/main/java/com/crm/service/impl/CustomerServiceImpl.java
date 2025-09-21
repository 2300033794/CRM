package com.crm.service.impl;

import com.crm.exception.ResourceNotFoundException;
import com.crm.model.CustomerCampaign;
import com.crm.model.EmailCampaign;
import com.crm.model.Interaction;
import com.crm.model.User;
import com.crm.repository.CustomerCampaignRepository;
import com.crm.repository.EmailCampaignRepository;
import com.crm.repository.InteractionRepository;
import com.crm.repository.UserRepository;
import com.crm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired private UserRepository userRepository;
    @Autowired private InteractionRepository interactionRepository;
    @Autowired private EmailCampaignRepository emailCampaignRepository;
    @Autowired private CustomerCampaignRepository customerCampaignRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
    }

    @Override
    public User getCustomerById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
    }

    @Override
    public User updateCustomer(Long id, User userDetails) {
        User customer = getCustomerById(id);
        customer.setEmail(userDetails.getEmail());
        customer.setAge(userDetails.getAge());
        customer.setAddress(userDetails.getAddress());
        customer.setPhone(userDetails.getPhone());
        return userRepository.save(customer);
    }

    @Override
    public void changePassword(Long customerId, String currentPassword, String newPassword) {
        User customer = getCustomerById(customerId);
        if (!passwordEncoder.matches(currentPassword, customer.getPassword())) {
            throw new IllegalArgumentException("Incorrect current password.");
        }
        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long.");
        }
        customer.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(customer);
    }

    @Override
    public Map<String, Object> getCustomerAnalytics(Long customerId) {
        User customer = getCustomerById(customerId);
        Map<String, Object> analyticsData = new HashMap<>();
        
        long totalInteractions = interactionRepository.countByCustomer(customer);
        List<CustomerCampaign> submittedCampaigns = customerCampaignRepository.findByCustomerId(customerId);
        analyticsData.put("totalInteractions", totalInteractions);
        analyticsData.put("submittedCampaignsCount", submittedCampaigns.size());
        analyticsData.put("approvedCampaignsCount", submittedCampaigns.stream().filter(c -> "APPROVED".equals(c.getStatus())).count());

        analyticsData.put("interactionsByType", interactionRepository.countInteractionsByType(customer));

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Object[]> dailyCounts = interactionRepository.countInteractionsPerDay(customer, thirtyDaysAgo);

        Map<LocalDate, Long> dailyCountsMap = dailyCounts.stream()
            .collect(Collectors.toMap(
                row -> ((java.sql.Date) row[0]).toLocalDate(),
                row -> (Long) row[1]
            ));
        analyticsData.put("interactionTrend", dailyCountsMap);
        
        return analyticsData;
    }

    @Override
    public Page<Interaction> getInteractionsForCustomer(Long customerId, String type, String searchTerm, Pageable pageable) {
        User customer = getCustomerById(customerId);
        boolean hasType = type != null && !type.isEmpty() && !type.equalsIgnoreCase("all");
        boolean hasSearchTerm = searchTerm != null && !searchTerm.isEmpty();

        if (hasType && hasSearchTerm) {
            return interactionRepository.findByCustomerAndTypeContaining(customer, type, searchTerm, pageable);
        } else if (hasSearchTerm) {
            return interactionRepository.findByCustomerContaining(customer, searchTerm, pageable);
        } else if (hasType) {
            return interactionRepository.findByCustomerAndType(customer, type, pageable);
        } else {
            return interactionRepository.findByCustomer(customer, pageable);
        }
    }

    @Override
    public List<EmailCampaign> getCampaignsForCustomer(Long customerId) {
        return emailCampaignRepository.findAll();
    }

    @Override
    public Interaction addInteraction(Long customerId, Interaction interaction) {
        User customer = getCustomerById(customerId);
        interaction.setCustomer(customer);
        interaction.setDate(LocalDateTime.now());
        if (interaction.getStatus() == null || interaction.getStatus().isEmpty()) {
            interaction.setStatus("PENDING");
        }
        return interactionRepository.save(interaction);
    }

    @Override
    public CustomerCampaign submitCampaign(Long customerId, CustomerCampaign campaign) {
        User customer = getCustomerById(customerId);
        campaign.setCustomer(customer);
        return customerCampaignRepository.save(campaign);
    }

    @Override
    public List<CustomerCampaign> getSubmittedCampaigns(Long customerId) {
        return customerCampaignRepository.findByCustomerId(customerId);
    }
}