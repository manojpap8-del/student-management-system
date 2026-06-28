package com.example.demo.service;

import org.springframework.stereotype.Service;

@Service
public class ChatService {

    public String getReply(
            String message
    ){
        return "AI: " + message;
    }

}