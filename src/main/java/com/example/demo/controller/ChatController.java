package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.ChatRequest;
import com.example.demo.dto.ChatResponse;
import com.example.demo.service.ChatService;

@RestController
@RequestMapping("/chat")
public class ChatController {

    @Autowired
    private ChatService service;

    @PostMapping
    public ChatResponse chat(
            @RequestBody ChatRequest req) {

        String reply = service.getReply(
                req.getMessage());

        return new ChatResponse(
                reply);

    }

}