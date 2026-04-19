package com.example.wellnessbackend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ExternalHealthApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    // OpenFDA: fetch drug/medication info
    public String fetchOpenFdaData(String query) {
        String url = "https://api.fda.gov/drug/label.json?search=" + query;
        return restTemplate.getForObject(url, String.class);
    }

    // WHO: global health insights
    public String fetchWhoData() {
        String url = "https://www.who.int/data/gho/info/indicators"; // example endpoint
        return restTemplate.getForObject(url, String.class);
    }

    // Fitness API: Apple Health / Google Fit (simulated)
    public String fetchFitnessData(String userId) {
        // Placeholder: integrate real API with OAuth tokens later
        return "{ \"steps\": 5000, \"heartRate\": 72 }";
    }
}
