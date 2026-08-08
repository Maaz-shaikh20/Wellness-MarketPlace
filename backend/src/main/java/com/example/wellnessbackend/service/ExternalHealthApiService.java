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
     * KEY FIX: The previous implementation concatenated the search expression
     * directly into the URL string, which caused the special characters
     * (double-quotes, parentheses, '+') to be sent raw to the FDA server.
     * The '+' in particular is interpreted as a URL-encoded space on the
     * server side, so the entire boolean expression was broken and returned
     * no results.
     *
     * We now use UriComponentsBuilder to let Spring properly percent-encode the
     * search parameter value before sending it. The FDA OR syntax uses a space
     * between terms — this gets encoded as %20 in the final URL, which is what
     * the openFDA API actually expects for its Lucene query parser.
     *
     * Examples that now work:  ibuprofen, aspirin, lisinopril, metformin
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> fetchOpenFdaData(String query) {
        // Sanitise: strip double-quotes to avoid breaking the Lucene syntax
        String safeQuery = query.replace("\"", "").trim();

        // openFDA Lucene OR syntax: two terms separated by a space inside parens.
        // UriComponentsBuilder will percent-encode this entire value, turning the
        // inner spaces into %20 and quotes into %22 — which is exactly what the
        // FDA search engine expects.
        String searchExpr = "(openfda.generic_name:\"" + safeQuery
                + "\" openfda.brand_name:\"" + safeQuery + "\")";

        URI uri = UriComponentsBuilder
                .fromHttpUrl("https://api.fda.gov/drug/label.json")
                .queryParam("search", searchExpr)
                .queryParam("limit", 5)
                .build()       // build without pre-encoding flag
                .encode()      // percent-encode special chars in query param values
                .toUri();

        try {
            String rawJson = restTemplate.getForObject(uri, String.class);
            return objectMapper.readValue(rawJson, Map.class);
        } catch (Exception e) {
            // openFDA returns 404 when no results are found — surface empty list
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
