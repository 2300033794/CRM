package com.crm.controller;

import com.crm.dto.AuthRequest;
import com.crm.dto.AuthResponse;
import com.crm.dto.UserDto;
import com.crm.model.User;
import com.crm.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto userDto) {
        User user = authService.registerUser(userDto);
        return ResponseEntity.ok("User registered successfully with ID: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        return ResponseEntity.ok(authService.login(authRequest));
    }
}