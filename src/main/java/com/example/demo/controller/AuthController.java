package com.example.demo.controller;

import com.example.demo.security.JwtUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {

        if ("admin".equals(request.getUsername()) &&
                "admin".equals(request.getPassword())) {

            return JwtUtil.generateToken(request.getUsername());
        }

        return "Invalid Credentials";
    }
}