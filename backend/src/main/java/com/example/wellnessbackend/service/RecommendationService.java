package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.entity.Recommendation;
import com.example.wellnessbackend.repository.NotificationRepository;
import com.example.wellnessbackend.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final NotificationRepository notificationRepository;

    // Generate recommendation and save in DB
    public RecommendationResponseDto generateRecommendation(RecommendationRequestDto dto) {

        String symptom = dto.getSymptom().toLowerCase().trim();
        String suggestedTherapy;

        // ── Cardiovascular & Chest ──
        if (containsAny(symptom, "chest pain", "chest tightness", "chest pressure", "heart", "palpitation", "shortness of breath", "breathlessness")) {
            suggestedTherapy = "Cardiac Yoga / Pranayama Breathing Therapy — Please consult a physician for urgent chest symptoms.";

        // ── Musculoskeletal ──
        } else if (containsAny(symptom, "back pain", "lower back", "spine", "spinal", "herniated", "slipped disc", "lumbar")) {
            suggestedTherapy = "Physiotherapy / Chiropractic Alignment";

        } else if (containsAny(symptom, "neck pain", "neck stiffness", "cervical", "whiplash")) {
            suggestedTherapy = "Chiropractic Care / Acupuncture / Massage Therapy";

        } else if (containsAny(symptom, "shoulder pain", "frozen shoulder", "rotator")) {
            suggestedTherapy = "Physiotherapy / Trigger Point Massage";

        } else if (containsAny(symptom, "knee pain", "knee swelling", "joint pain", "joint inflammation", "arthritis", "rheumatoid")) {
            suggestedTherapy = "Acupuncture / Physiotherapy / Hydrotherapy";

        } else if (containsAny(symptom, "muscle pain", "muscle cramp", "muscle spasm", "fibromyalgia", "body ache", "soreness")) {
            suggestedTherapy = "Massage Therapy / Myofascial Release / Acupuncture";

        } else if (containsAny(symptom, "foot pain", "heel pain", "plantar fasciitis")) {
            suggestedTherapy = "Reflexology / Physiotherapy / Orthotic Support Therapy";

        // ── Mental & Emotional Health ──
        } else if (containsAny(symptom, "stress", "overwhelmed", "burnout", "overworked", "pressure")) {
            suggestedTherapy = "Mindfulness Meditation / Yoga / Ayurvedic Stress Relief";

        } else if (containsAny(symptom, "anxiety", "panic attack", "panic", "nervous", "worry", "fear")) {
            suggestedTherapy = "Cognitive Yoga / Pranayama / Aromatherapy / Acupuncture";

        } else if (containsAny(symptom, "depression", "depressed", "hopeless", "sadness", "low mood", "emptiness")) {
            suggestedTherapy = "Mindfulness Therapy / Light Therapy / Ayurveda Rasayana / Guided Meditation";

        } else if (containsAny(symptom, "anger", "rage", "irritability", "mood swing", "emotional instability")) {
            suggestedTherapy = "Mindfulness Meditation / Yoga Nidra / Ayurvedic Counselling";

        } else if (containsAny(symptom, "ptsd", "trauma", "flashback", "post traumatic")) {
            suggestedTherapy = "Somatic Therapy / EMDR-supported Yoga / Trauma-informed Meditation";

        // ── Sleep ──
        } else if (containsAny(symptom, "insomnia", "can't sleep", "cannot sleep", "sleep problem", "sleeplessness", "trouble sleeping", "waking up at night")) {
            suggestedTherapy = "Sleep Hygiene Therapy / Yoga Nidra / Ayurvedic Ashwagandha Protocol / Acupuncture";

        } else if (containsAny(symptom, "oversleeping", "excessive sleep", "hypersomnia", "fatigue after sleeping")) {
            suggestedTherapy = "Ayurvedic Detox / Pranayama Energization / Herbal Therapy";

        // ── Fatigue & Energy ──
        } else if (containsAny(symptom, "fatigue", "tired", "exhausted", "no energy", "weak", "lethargy", "low energy", "chronic fatigue")) {
            suggestedTherapy = "Ayurvedic Rejuvenation (Rasayana) / Acupuncture / Nutritional Therapy";

        } else if (containsAny(symptom, "brain fog", "difficulty concentrating", "poor memory", "memory loss", "lack of focus", "concentration")) {
            suggestedTherapy = "Ayurvedic Medhya Rasayana / Meditation / Acupuncture";

        // ── Digestive ──
        } else if (containsAny(symptom, "bloating", "gas", "indigestion", "acidity", "acid reflux", "gerd", "heartburn")) {
            suggestedTherapy = "Ayurvedic Digestive Therapy / Herbal Medicine / Probiotic Therapy";

        } else if (containsAny(symptom, "constipation", "irregular bowel", "ibs", "irritable bowel", "stomach cramp")) {
            suggestedTherapy = "Ayurvedic Panchakarma / Abdominal Massage / Herbal Laxative Therapy";

        } else if (containsAny(symptom, "nausea", "vomiting", "motion sickness", "stomach upset")) {
            suggestedTherapy = "Acupressure / Ginger-based Herbal Therapy / Ayurvedic Digestive Balance";

        } else if (containsAny(symptom, "appetite loss", "no appetite", "not hungry", "eating disorder")) {
            suggestedTherapy = "Ayurvedic Agni Therapy / Nutritional Counselling / Mindful Eating Therapy";

        // ── Headache & Neurological ──
        } else if (containsAny(symptom, "migraine", "chronic headache", "cluster headache")) {
            suggestedTherapy = "Acupuncture / Biofeedback Therapy / Ayurvedic Shirodara";

        } else if (containsAny(symptom, "headache", "head pain", "head pressure")) {
            suggestedTherapy = "Acupressure / Aromatherapy / Yoga for Tension Relief";

        } else if (containsAny(symptom, "vertigo", "dizziness", "lightheaded", "balance problem")) {
            suggestedTherapy = "Vestibular Physiotherapy / Acupuncture / Herbal Therapy";

        } else if (containsAny(symptom, "tingling", "numbness", "nerve pain", "neuropathy", "sciatica")) {
            suggestedTherapy = "Acupuncture / Physiotherapy / Ayurvedic Nerve Therapy";

        // ── Respiratory ──
        } else if (containsAny(symptom, "asthma", "wheezing", "difficulty breathing", "bronchitis")) {
            suggestedTherapy = "Pranayama Breathing Therapy / Acupuncture / Ayurvedic Herbal Steam";

        } else if (containsAny(symptom, "cold", "cough", "flu", "runny nose", "sore throat", "congestion", "sinusitis", "sinus")) {
            suggestedTherapy = "Ayurvedic Herbal Immunity Therapy / Steam Inhalation / Neti Pot Cleanse";

        } else if (containsAny(symptom, "allergy", "allergic reaction", "hay fever", "sneezing")) {
            suggestedTherapy = "Acupuncture / Ayurvedic Allergy Relief / Herbal Antihistamine Therapy";

        // ── Skin ──
        } else if (containsAny(symptom, "acne", "pimple", "breakout", "skin rash", "eczema", "psoriasis", "dermatitis")) {
            suggestedTherapy = "Ayurvedic Skin Therapy / Herbal Blood Purification / Nutritional Therapy";

        } else if (containsAny(symptom, "skin", "dry skin", "oily skin", "itching", "redness", "hives")) {
            suggestedTherapy = "Ayurveda / Herbal Dermatology Therapy";

        // ── Hormonal & Women's Health ──
        } else if (containsAny(symptom, "period pain", "menstrual cramp", "menstrual", "pcos", "pms", "irregular period")) {
            suggestedTherapy = "Ayurvedic Hormonal Balance / Yoga for Women / Acupuncture";

        } else if (containsAny(symptom, "menopause", "hot flash", "hormonal imbalance", "estrogen")) {
            suggestedTherapy = "Ayurvedic Menopause Therapy / Phytoestrogen Herbal Treatment / Acupuncture";

        } else if (containsAny(symptom, "fertility", "infertility", "trying to conceive")) {
            suggestedTherapy = "Ayurvedic Fertility Therapy / Acupuncture / Stress Reduction Yoga";

        // ── Weight & Metabolic ──
        } else if (containsAny(symptom, "weight gain", "obesity", "overweight", "metabolic")) {
            suggestedTherapy = "Ayurvedic Detox (Panchakarma) / Naturopathy Diet / Therapeutic Yoga";

        } else if (containsAny(symptom, "weight loss", "underweight", "low bmi", "thin")) {
            suggestedTherapy = "Ayurvedic Nutritive Therapy / Yoga for Weight Gain / Nutritional Counselling";

        } else if (containsAny(symptom, "diabetes", "blood sugar", "insulin")) {
            suggestedTherapy = "Ayurvedic Diabetes Management / Yoga Therapy / Naturopathic Nutritional Support";

        // ── Urinary & Kidney ──
        } else if (containsAny(symptom, "uti", "urinary infection", "frequent urination", "burning urination", "bladder")) {
            suggestedTherapy = "Ayurvedic Urinary Tract Therapy / Herbal Diuretic Support / Naturopathy";

        } else if (containsAny(symptom, "kidney stone", "kidney pain", "kidney")) {
            suggestedTherapy = "Ayurvedic Kidney Detox / Herbal Stone Dissolution Therapy / Hydration Therapy";

        // ── Eye & Ear ──
        } else if (containsAny(symptom, "eye strain", "dry eyes", "blurry vision", "eye pain")) {
            suggestedTherapy = "Ayurvedic Netra Therapy (Eye Care) / Palming Technique / Yoga for Eyes";

        } else if (containsAny(symptom, "ear pain", "ear infection", "tinnitus", "ringing in ears", "hearing")) {
            suggestedTherapy = "Ayurvedic Karna Poorana (Ear Oil Therapy) / Acupuncture";

        // ── Immune & General ──
        } else if (containsAny(symptom, "low immunity", "frequent illness", "immune system", "autoimmune")) {
            suggestedTherapy = "Ayurvedic Rasayana Immunity Boost / Herbal Adaptogens / Yoga";

        } else if (containsAny(symptom, "detox", "toxin", "cleanse", "body purification")) {
            suggestedTherapy = "Ayurvedic Panchakarma Detox / Naturopathic Cleanse / Herbal Therapy";

        // ── Dental & Oral ──
        } else if (containsAny(symptom, "tooth pain", "gum pain", "toothache", "oral health", "mouth ulcer")) {
            suggestedTherapy = "Ayurvedic Oil Pulling / Herbal Oral Care / Acupuncture for Dental Pain";

        // ── General Fallback ──
        } else {
            suggestedTherapy = "Holistic Wellness Assessment — Consider Ayurveda, Meditation, or a Practitioner Consultation for a personalized plan.";
        }

        String sourceAPI = "Wellnest Rule-Based Wellness Engine v2";

        // Create recommendation entity
        Recommendation recommendation = Recommendation.builder()
                .userId(dto.getUserId())
                .symptom(dto.getSymptom())
                .suggestedTherapy(suggestedTherapy)
                .sourceAPI(sourceAPI)
                .createdAt(LocalDateTime.now())
                .build();

        Recommendation saved = recommendationRepository.save(recommendation);

        // Trigger notification
        Notification notification = Notification.builder()
                .userId(dto.getUserId())
                .type("RECOMMENDATION")
                .message("New therapy recommendation: " + suggestedTherapy.split("—")[0].trim())
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        return mapToResponseDto(saved);
    }

    // Helper: check if input contains any of the given keywords
    private boolean containsAny(String input, String... keywords) {
        for (String keyword : keywords) {
            if (input.contains(keyword)) return true;
        }
        return false;
    }

    // Fetch all recommendations of a user
    public List<RecommendationResponseDto> getRecommendationsByUser(Long userId) {
        List<Recommendation> list = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    // Delete a single recommendation by ID
    public boolean deleteById(Long id) {
        if (recommendationRepository.existsById(id)) {
            recommendationRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Delete all recommendations for a user
    public int deleteAllByUserId(Long userId) {
        List<Recommendation> list = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        recommendationRepository.deleteAll(list);
        return list.size();
    }

    private RecommendationResponseDto mapToResponseDto(Recommendation recommendation) {
        RecommendationResponseDto dto = new RecommendationResponseDto();
        dto.setId(recommendation.getId());
        dto.setUserId(recommendation.getUserId());
        dto.setSymptom(recommendation.getSymptom());
        dto.setSuggestedTherapy(recommendation.getSuggestedTherapy());
        dto.setSourceAPI(recommendation.getSourceAPI());
        dto.setCreatedAt(recommendation.getCreatedAt()); // use createdAt
        return dto;
    }
}
