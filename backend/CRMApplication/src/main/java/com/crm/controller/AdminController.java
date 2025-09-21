package com.crm.controller;

import com.crm.model.CustomerCampaign;
import com.crm.model.EmailCampaign;
import com.crm.model.Interaction;
import com.crm.model.Settings;
import com.crm.model.User;
import com.crm.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping("/")
    public String home() {
        return "Welcome to the Admin Dashboard API";
    }

    // == Customer Management Endpoints ==
    @GetMapping("/customers")
    public ResponseEntity<Page<User>> getAllCustomers(Pageable pageable) {
        Page<User> customers = adminService.getAllCustomers(pageable);
        return ResponseEntity.ok(customers);
    }

    @PostMapping("/customers")
    public ResponseEntity<User> addCustomer(@RequestBody User customer) {
        User newCustomer = adminService.addCustomer(customer);
        return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);
    }

    @PutMapping("/customers/{id}")
    public ResponseEntity<User> updateCustomer(@PathVariable Long id, @RequestBody User customerDetails) {
        User updatedCustomer = adminService.updateCustomer(id, customerDetails);
        return ResponseEntity.ok(updatedCustomer);
    }

    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        adminService.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }

    // == Customer Approval Endpoints ==
    @GetMapping("/customers/pending")
    public ResponseEntity<Page<User>> getPendingCustomers(Pageable pageable) {
        Page<User> pendingCustomers = adminService.getPendingCustomers(pageable);
        return ResponseEntity.ok(pendingCustomers);
    }

    @PutMapping("/customers/{id}/approve")
    public ResponseEntity<User> approveCustomer(@PathVariable Long id) {
        User approvedCustomer = adminService.approveCustomer(id);
        return ResponseEntity.ok(approvedCustomer);
    }

    @DeleteMapping("/customers/{id}/reject")
    public ResponseEntity<Void> rejectCustomer(@PathVariable Long id) {
        adminService.rejectCustomer(id);
        return ResponseEntity.noContent().build();
    }
    
    // == Interaction Approval Endpoints ==
    @GetMapping("/interactions/pending")
    public ResponseEntity<Page<Interaction>> getPendingInteractions(Pageable pageable) {
        Page<Interaction> pendingInteractions = adminService.getPendingInteractions(pageable);
        return ResponseEntity.ok(pendingInteractions);
    }

    @PutMapping("/interactions/{id}/status")
    public ResponseEntity<Interaction> updateInteractionStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || (!status.equalsIgnoreCase("COMPLETED") && !status.equalsIgnoreCase("SCHEDULED"))) {
            return ResponseEntity.badRequest().build();
        }
        Interaction updatedInteraction = adminService.updateInteractionStatus(id, status.toUpperCase());
        return ResponseEntity.ok(updatedInteraction);
    }

    // == Analytics Endpoint ==
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAdminAnalytics());
    }

    // == Marketing Email Campaign Endpoints ==
    @GetMapping("/campaigns")
    public ResponseEntity<Page<EmailCampaign>> getAllCampaigns(Pageable pageable) {
        Page<EmailCampaign> campaigns = adminService.getAllCampaigns(pageable);
        return ResponseEntity.ok(campaigns);
    }

    @PostMapping("/campaigns")
    public ResponseEntity<EmailCampaign> createCampaign(@RequestBody EmailCampaign campaign) {
        EmailCampaign newCampaign = adminService.createCampaign(campaign);
        return new ResponseEntity<>(newCampaign, HttpStatus.CREATED);
    }

    @PutMapping("/campaigns/{id}")
    public ResponseEntity<EmailCampaign> updateCampaign(@PathVariable Long id, @RequestBody EmailCampaign campaignDetails) {
        EmailCampaign updatedCampaign = adminService.updateCampaign(id, campaignDetails);
        return ResponseEntity.ok(updatedCampaign);
    }

    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<Void> deleteCampaign(@PathVariable Long id) {
        adminService.deleteCampaign(id);
        return ResponseEntity.noContent().build();
    }

    // == Customer-Submitted Campaign Approval Endpoints ==
    @GetMapping("/customer-campaigns/pending")
    public ResponseEntity<List<CustomerCampaign>> getPendingCampaigns() {
        List<CustomerCampaign> pendingCampaigns = adminService.getPendingCampaigns();
        return ResponseEntity.ok(pendingCampaigns);
    }

    @PutMapping("/customer-campaigns/{id}/status")
    public ResponseEntity<CustomerCampaign> updateCustomerCampaignStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        if (status == null || (!status.equalsIgnoreCase("APPROVED") && !status.equalsIgnoreCase("REJECTED"))) {
            return ResponseEntity.badRequest().build();
        }
        CustomerCampaign updatedCampaign = adminService.updateCustomerCampaignStatus(id, status.toUpperCase());
        return ResponseEntity.ok(updatedCampaign);
    }

    // == Admin's Own Profile Management ==
    @GetMapping("/profile")
    public ResponseEntity<User> getAdminProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User adminProfile = adminService.getAdminProfile(userDetails.getUsername());
        return ResponseEntity.ok(adminProfile);
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateAdminProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody User profileDetails) {
        User updatedProfile = adminService.updateAdminProfile(userDetails.getUsername(), profileDetails);
        return ResponseEntity.ok(updatedProfile);
    }

    @PutMapping("/change-password")
    public ResponseEntity<Void> changeAdminPassword(@AuthenticationPrincipal UserDetails userDetails, @RequestBody Map<String, String> passwordData) {
        adminService.changeAdminPassword(userDetails.getUsername(), passwordData);
        return ResponseEntity.ok().build();
    }

    // == System Settings Endpoints ==
    @GetMapping("/settings")
    public ResponseEntity<Settings> getSystemSettings() {
        return ResponseEntity.ok(adminService.getSystemSettings());
    }

    @PutMapping("/settings")
    public ResponseEntity<Settings> updateSystemSettings(@RequestBody Settings settings) {
        Settings updatedSettings = adminService.updateSystemSettings(settings);
        return ResponseEntity.ok(updatedSettings);
    }
}