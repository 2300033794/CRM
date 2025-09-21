// src/main/java/com/crm/config/DataSeeder.java
package com.crm.config;

import com.crm.model.Interaction;
import com.crm.model.Role;
import com.crm.model.User;
import com.crm.model.User.UserStatus;
import com.crm.repository.InteractionRepository;
import com.crm.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private InteractionRepository interactionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        if (userRepository.findByUsername("admin").isEmpty()) {
            System.out.println("No admin account found. Creating default admin...");
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("password"));
            admin.setEmail("admin@crmproject.com");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setStatus(UserStatus.ACTIVE);
            admin.setJoinDate(LocalDateTime.now());
            admin.setDepartment("Management");
            admin.setPosition("System Administrator");
            userRepository.save(admin);
            System.out.println("Default admin account created successfully.");
            System.out.println("Username: admin | Password: password");
        } else {
            System.out.println("Admin account already exists.");
        }

        // Seed Customer User and Interactions
        if (userRepository.findByUsername("customer").isEmpty()) {
            System.out.println("No default customer found. Creating sample customer...");
            User customer = new User();
            customer.setUsername("customer");
            customer.setPassword(passwordEncoder.encode("password"));
            customer.setEmail("customer@crmproject.com");
            customer.setRole(Role.ROLE_CUSTOMER);
            customer.setStatus(UserStatus.ACTIVE); // Set to ACTIVE for immediate login
            customer.setJoinDate(LocalDateTime.now().minusDays(45));
            customer.setAge(30);
            customer.setPhone("9876543210");
            customer.setAddress("123 CRM Street, Tech City");
            customer.setAdharCard("123456789012");
            User savedCustomer = userRepository.save(customer);
            System.out.println("Default customer account created successfully.");
            System.out.println("Username: customer | Password: password");

            // Seed Interactions for the new customer
            System.out.println("Seeding sample interactions for default customer...");
            Interaction i1 = new Interaction(savedCustomer, "email", "Initial Welcome Email", LocalDateTime.now().minusDays(28), "completed", "Sent a welcome email with resources.");
            Interaction i2 = new Interaction(savedCustomer, "call", "Follow-up Call", LocalDateTime.now().minusDays(25), "completed", "Discussed initial setup and answered questions.");
            Interaction i3 = new Interaction(savedCustomer, "meeting", "Onboarding Meeting", LocalDateTime.now().minusDays(20), "completed", "Completed the full onboarding session.");
            Interaction i4 = new Interaction(savedCustomer, "email", "Check-in Email", LocalDateTime.now().minusDays(10), "completed", "Checked in on progress, no issues reported.");
            Interaction i5 = new Interaction(savedCustomer, "call", "Support Call", LocalDateTime.now().minusDays(5), "completed", "Resolved a minor issue regarding billing.");
            Interaction i6 = new Interaction(savedCustomer, "email", "Monthly Newsletter", LocalDateTime.now().minusDays(2), "scheduled", "Scheduled to send the monthly newsletter.");
            interactionRepository.saveAll(List.of(i1, i2, i3, i4, i5, i6));
            System.out.println("Sample interactions seeded successfully.");

        } else {
            System.out.println("Default customer already exists.");
        }
    }
}