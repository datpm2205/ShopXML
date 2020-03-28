package com.github.duc010298.shopxml.services;

import com.github.duc010298.shopxml.configuration.ApiConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

@Component
public class TokenAuthenticationService {

    private ApiConfig apiConfig;

    public TokenAuthenticationService(ApiConfig apiConfig) {
        this.apiConfig = apiConfig;
    }

    public String getToken(String username) {
        return Jwts.builder().setSubject(username).signWith(SignatureAlgorithm.HS512, apiConfig.getTokenSecretKey()).compact();
    }

    public String getUserName(String token) {
        Claims claims = Jwts.parser().setSigningKey(apiConfig.getTokenSecretKey()).parseClaimsJws(token.replace(apiConfig.getTokenPrefix(), "")).getBody();
        return claims.getSubject();
    }
}