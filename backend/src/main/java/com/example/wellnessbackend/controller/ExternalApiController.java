package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.service.ExternalHealthApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/external")
@RequiredArgsConstructor
public class ExternalApiController {

    private final ExternalHealthApiService externalService;

    /**
     * FIX: Return type changed from ResponseEntity<String> to ResponseEntity<Map<String, Object>>.
     * Previously the raw JSON string was returned directly, causing the frontend's
     * res.data.results to always be undefined (can't access a property on a String).
     * Now Spring serialises the Map back to JSON so res.data.results is a proper array.
     */
    @GetMapping("/openfda/search")
    public ResponseEntity<Map<String, Object>> getOpenFdaData(@RequestParam String query) {
        Map<String, Object> response = externalService.fetchOpenFdaData(query);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/who/data")
    public ResponseEntity<?> getWhoData() {
        return ResponseEntity.ok(
                Map.of(
                        "source", "WHO (Mock)",
                        "message", "Public health guidelines fetched successfully",
                        "lastUpdated", LocalDateTime.now()
                )
        );
    }

    @GetMapping("/fitness/health-data")
    public ResponseEntity<String> getFitnessData(@RequestParam String userId) {
        String response = externalService.fetchFitnessData(userId);
        return ResponseEntity.ok(response);
    }
}
