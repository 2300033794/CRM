package com.crm.service.impl;

import com.crm.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    // Using @Autowired for field injection is a common and valid pattern in Spring
    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendSimpleMessage(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            // It's good practice to set a 'from' address. 
            // This can also be configured in application.properties
            message.setFrom("noreply@crm-app.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            emailSender.send(message);
        } catch (Exception e) {
            // In a real application, you should use a proper logger like SLF4J
            System.err.println("Error while sending email: " + e.getMessage());
        }
    }
}