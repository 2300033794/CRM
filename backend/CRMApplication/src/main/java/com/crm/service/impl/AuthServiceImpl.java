package com.crm.service.impl;

import com.crm.dto.AuthRequest;
import com.crm.dto.AuthResponse;
import com.crm.dto.UserDto;
import com.crm.exception.ResourceNotFoundException;
import com.crm.model.Role;
import com.crm.model.User;
import com.crm.model.User.UserStatus;
import com.crm.repository.UserRepository;
import com.crm.security.JwtUtil;
import com.crm.service.AuthService;
import com.crm.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtil jwtUtil;
    @Autowired private EmailService emailService;

    @Override
    public User registerUser(UserDto userDto) {
        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setAge(userDto.getAge());
        user.setAdharCard(userDto.getAdharCard());
        user.setAddress(userDto.getAddress());
        user.setRole(Role.ROLE_CUSTOMER);
        user.setStatus(UserStatus.PENDING); // **MODIFIED: New users are pending approval**
        user.setJoinDate(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);

        // Send confirmation email
        emailService.sendSimpleMessage(
            savedUser.getEmail(), 
            "Registration Confirmation", 
            "You are registered to the Customer Management System. Your account is pending admin approval."
        );

        return savedUser;
    }

    @Override
    public AuthResponse login(AuthRequest authRequest) {
        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
        } catch (DisabledException e) {
            throw new BadCredentialsException("Your account is not yet active. Please wait for admin approval.");
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid username or password");
        }

        User user = userRepository.findByUsername(authRequest.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        // Final check for role (optional, but good practice)
        String requestedRole = "ROLE_" + authRequest.getRole().toUpperCase();
        if (!user.getRole().name().equals(requestedRole)) {
            throw new BadCredentialsException("Invalid credentials for the selected role.");
        }

        final UserDetails userDetails = user;
        final String token = jwtUtil.generateToken(userDetails);

        return new AuthResponse(token, user.getId());
    }
}