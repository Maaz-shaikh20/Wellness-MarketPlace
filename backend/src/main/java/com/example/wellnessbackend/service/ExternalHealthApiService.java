package com.example.wellnessbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class ExternalHealthApiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * OpenFDA: fetch drug/medication label info.
     *
     * FIX: The previous bare query (search=ibuprofen) returned poor/empty results
     * because openFDA requires a field-qualified search.
     * We now search across active_ingredient OR brand_name, cap results at 5,
     * and parse the raw JSON string into a Map so the controller can return a
     * proper JSON object (instead of a String that the frontend couldn't parse).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> fetchOpenFdaData(String query) {
        // Build a field-qualified openFDA query:
        // active_ingredient:"<term>" OR brand_name:"<term>"
        String encodedQuery = "active_ingredient:\"" + query + "\"+brand_name:\"" + query + "\"";
        String url = "https://api.fda.gov/drug/label.json?search=" + encodedQuery + "&limit=5";

        try {
            String rawJson = restTemplate.getForObject(url, String.class);
            return objectMapper.readValue(rawJson, Map.class);
        } catch (Exception e) {
            // If openFDA returns 404 (no results) or any other error, return empty results
            return Map.of("results", Collections.emptyList(), "error", e.getMessage());
        }
    }

    // WHO: global health insights (mock)
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
