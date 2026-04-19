package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.service.ExternalHealthApiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/external")
@RequiredArgsConstructor
public class ExternalApiController {

    private final ExternalHealthApiService externalService;

    @GetMapping("/openfda/search")
    public ResponseEntity<String> getOpenFdaData(@RequestParam String query) {
        String response = externalService.fetchOpenFdaData(query);
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
