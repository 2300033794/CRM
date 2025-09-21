package com.crm.controller;

import com.crm.model.CustomerCampaign;
import com.crm.model.EmailCampaign;
import com.crm.model.Interaction;
import com.crm.model.User;
import com.crm.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    private void checkAccess(Long requestedId, UserDetails userDetails) {
        User currentUser = customerService.findUserByUsername(userDetails.getUsername());
        if (!Objects.equals(currentUser.getId(), requestedId)) {
            throw new AccessDeniedException("You are not authorized to access this resource.");
        }
    }

    // == Profile Endpoints ==
    @GetMapping("/{id}")
    public ResponseEntity<User> getCustomerProfile(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        checkAccess(id, userDetails);
        User customer = customerService.getCustomerById(id);
        return ResponseEntity.ok(customer);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateCustomerProfile(@PathVariable Long id, @RequestBody User userDetails, @AuthenticationPrincipal UserDetails authDetails) {
        checkAccess(id, authDetails);
        User updatedCustomer = customerService.updateCustomer(id, userDetails);
        return ResponseEntity.ok(updatedCustomer);
    }

    @PutMapping("/{id}/change-password")
    public ResponseEntity<Map<String, String>> changePassword(@PathVariable Long id, @RequestBody Map<String, String> passwordData, @AuthenticationPrincipal UserDetails userDetails) {
        checkAccess(id, userDetails);
        customerService.changePassword(
                id,
                passwordData.get("currentPassword"),
                passwordData.get("newPassword")
        );
        return ResponseEntity.ok(Map.of("message", "Password changed successfully."));
    }

    // == Analytics Endpoint ==
    @GetMapping("/{id}/analytics")
    public ResponseEntity<Map<String, Object>> getCustomerAnalytics(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        checkAccess(id, userDetails);
        Map<String, Object> analyticsData = customerService.getCustomerAnalytics(id);
        return ResponseEntity.ok(analyticsData);
    }

    // == Interactions Endpoints ==
    @GetMapping("/{id}/interactions")
    public ResponseEntity<Page<Interaction>> getCustomerInteractions(
            @PathVariable Long id,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String search,
            Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        checkAccess(id, userDetails);
        Page<Interaction> interactions = customerService.getInteractionsForCustomer(id, type, search, pageable);
        return ResponseEntity.ok(interactions);
    }

    @PostMapping("/{id}/interactions")
    public ResponseEntity<Interaction> addInteraction(
            @PathVariable Long id,
            @RequestBody Interaction interaction,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        checkAccess(id, userDetails);
        Interaction newInteraction = customerService.addInteraction(id, interaction);
        return new ResponseEntity<>(newInteraction, HttpStatus.CREATED);
    }

    // == Marketing Email Campaigns Endpoint ==
    @GetMapping("/{id}/campaigns")
    public ResponseEntity<List<EmailCampaign>> getCustomerCampaigns(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        checkAccess(id, userDetails);
        List<EmailCampaign> campaigns = customerService.getCampaignsForCustomer(id);
        return ResponseEntity.ok(campaigns);
    }

    // == Customer-Submitted Campaign Endpoints ==
    @PostMapping("/{id}/campaigns")
    public ResponseEntity<CustomerCampaign> submitCampaign(@PathVariable Long id, @RequestBody CustomerCampaign campaign, @AuthenticationPrincipal UserDetails userDetails) {
        checkAccess(id, userDetails);
        CustomerCampaign submittedCampaign = customerService.submitCampaign(id, campaign);
        return new ResponseEntity<>(submittedCampaign, HttpStatus.CREATED);
    }

    @GetMapping("/{id}/customer-campaigns")
    public ResponseEntity<List<CustomerCampaign>> getSubmittedCampaigns(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        checkAccess(id, userDetails);
        List<CustomerCampaign> campaigns = customerService.getSubmittedCampaigns(id);
        return ResponseEntity.ok(campaigns);
    }
}