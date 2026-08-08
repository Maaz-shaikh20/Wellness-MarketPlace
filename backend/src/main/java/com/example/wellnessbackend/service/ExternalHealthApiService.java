package com.example.wellnessbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Collections;
import java.util.Map;

@Service
public class ExternalHealthApiService {

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * OpenFDA: fetch drug/medication label info by drug name.
     *
     * Uses UriComponentsBuilder with a URI template variable so Spring handles
     * all percent-encoding of special chars (quotes, parens, spaces) correctly.
     * The {search} placeholder is replaced + encoded in one step via buildAndExpand,
     * which avoids the double-encoding problem of build().encode().
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> fetchOpenFdaData(String query) {
        // Strip double-quotes to avoid breaking Lucene syntax
        String safeQuery = query.replace("\"", "").trim();

        // Use a URI template variable for the search value — Spring will
        // percent-encode it correctly when buildAndExpand is called.
        String searchValue = "(openfda.generic_name:\"" + safeQuery
                + "\" openfda.brand_name:\"" + safeQuery + "\")";

        URI uri = UriComponentsBuilder
                .fromHttpUrl("https://api.fda.gov/drug/label.json")
                .queryParam("search", "{search}")
                .queryParam("limit", "5")
                .buildAndExpand(searchValue)  // encodes {search} correctly
                .toUri();

        try {
            String rawJson = restTemplate.getForObject(uri, String.class);
            return objectMapper.readValue(rawJson, Map.class);
        } catch (Exception e) {
            // openFDA returns 404 when no results — surface empty list
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
