package com.example.wellnessbackend.dto;

public class GoogleTokenRequest {

    private String credential;  // Google ID token (JWT) from frontend

    public String getCredential() { return credential; }
    public void setCredential(String credential) { this.credential = credential; }
}
