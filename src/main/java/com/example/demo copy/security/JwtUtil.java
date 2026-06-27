package com.example.demo.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

public class JwtUtil {

    // Secret key kam se kam 32 characters ka hona chahiye HS256 ke liye
    private static final String SECRET_KEY = "mysecretkeymysecretkeymysecretkey123";
    private static final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Token generate karna (login successful hone par)
    public static String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 3600000)) // 1 hour
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Token se username nikalna
    public static String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    // Token valid hai ya nahi check karna
    public static boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false; // token expired, tampered, ya invalid hai
        }
    }

    private static Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}