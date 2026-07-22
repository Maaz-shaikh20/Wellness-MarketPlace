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
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final NotificationRepository notificationRepository;

    // ─────────────────────────────────────────────────────────────────────────
    // Generate recommendation and save in DB
    // ─────────────────────────────────────────────────────────────────────────
    public RecommendationResponseDto generateRecommendation(RecommendationRequestDto dto) {

        // Normalize input: lowercase + strip common conversational filler so that
        // "I have a headache" → "headache", "suffering from chest pain" → "chest pain"
        String raw = dto.getSymptom().toLowerCase().trim();

        String symptom = raw
                // Strip common conversational prefixes / filler phrases
                .replaceAll("\\b(i am |i'm |i have |i've got |i got |i feel |i'm feeling |i am feeling |suffering from |experiencing |dealing with |have been having |having |experiencing a |i have a |i have an )\\b", " ")
                // Normalise hyphens used in compound words (e.g. head-ache → head ache)
                .replaceAll("-", " ")
                // Replace common separators so each part can be matched independently
                .replaceAll("[,;/]", " ")
                .replaceAll("\\b(and|or|also|with|plus|as well as|along with|together with)\\b", " ")
                // Collapse multiple spaces
                .replaceAll("\\s+", " ")
                .trim();

        List<String> therapies = new ArrayList<>();

        // ── Cardiovascular & Chest (always checked first — safety priority) ──
        if (containsAny(symptom,
                "chest pain", "chest tight", "chest pressure", "chest discomfort",
                "heart pain", "heart attack", "palpitation", "irregular heartbeat",
                "shortness of breath", "breathless", "difficulty breathing",
                "can't breathe", "cannot breathe", "trouble breathing")) {
            therapies.add("Cardiac Yoga / Pranayama Breathing Therapy — Please consult a physician for urgent chest symptoms.");
        }

        // ── Musculoskeletal ──
        if (containsAny(symptom,
                "back pain", "lower back", "upper back", "spine", "spinal",
                "herniated", "slipped disc", "lumbar", "back ache", "backache")) {
            therapies.add("Physiotherapy / Chiropractic Alignment");
        }
        if (containsAny(symptom,
                "neck pain", "neck stiff", "cervical", "whiplash", "neck ache", "stiff neck")) {
            therapies.add("Chiropractic Care / Acupuncture / Massage Therapy");
        }
        if (containsAny(symptom,
                "shoulder pain", "frozen shoulder", "rotator", "shoulder ache", "shoulder stiff")) {
            therapies.add("Physiotherapy / Trigger Point Massage");
        }
        if (containsAny(symptom,
                "knee pain", "knee swelling", "knee ache", "joint pain", "joint swelling",
                "joint inflammation", "arthritis", "rheumatoid", "inflamed joint")) {
            therapies.add("Acupuncture / Physiotherapy / Hydrotherapy");
        }
        if (containsAny(symptom,
                "muscle pain", "muscle cramp", "muscle spasm", "fibromyalgia",
                "body ache", "body pain", "soreness", "sore muscle", "myalgia",
                "muscle weakness", "muscle tension")) {
            therapies.add("Massage Therapy / Myofascial Release / Acupuncture");
        }
        if (containsAny(symptom,
                "foot pain", "heel pain", "plantar fasciitis", "ankle pain",
                "sole pain", "arch pain")) {
            therapies.add("Reflexology / Physiotherapy / Orthotic Support Therapy");
        }
        if (containsAny(symptom,
                "wrist pain", "hand pain", "elbow pain", "tennis elbow",
                "carpal tunnel", "finger pain", "joint stiffness")) {
            therapies.add("Physiotherapy / Acupuncture / Anti-Inflammatory Herbal Therapy");
        }
        if (containsAny(symptom,
                "hip pain", "groin pain", "pelvis pain", "pelvic pain")) {
            therapies.add("Physiotherapy / Yoga for Hip Flexibility / Acupuncture");
        }

        // ── Mental & Emotional Health ──
        if (containsAny(symptom,
                "stress", "stressed", "overwhelmed", "burnout", "burnt out",
                "overworked", "pressure", "work stress", "mental pressure")) {
            therapies.add("Mindfulness Meditation / Yoga / Ayurvedic Stress Relief");
        }
        if (containsAny(symptom,
                "anxiety", "anxious", "panic attack", "panic", "nervous", "nervousness",
                "worry", "worried", "fear", "phobia", "restless", "overthinking")) {
            therapies.add("Cognitive Yoga / Pranayama / Aromatherapy / Acupuncture");
        }
        if (containsAny(symptom,
                "depression", "depressed", "hopeless", "hopelessness", "sadness",
                "sad", "low mood", "emptiness", "worthless", "melancholy", "grief",
                "lack of motivation", "no motivation", "motivation")) {
            therapies.add("Mindfulness Therapy / Light Therapy / Ayurveda Rasayana / Guided Meditation");
        }
        if (containsAny(symptom,
                "anger", "angry", "rage", "irritab", "mood swing", "emotional instab",
                "mood disorder", "agitation", "frustration", "emotional")) {
            therapies.add("Mindfulness Meditation / Yoga Nidra / Ayurvedic Counselling");
        }
        if (containsAny(symptom,
                "ptsd", "trauma", "traumatic", "flashback", "post traumatic", "abuse")) {
            therapies.add("Somatic Therapy / EMDR-supported Yoga / Trauma-informed Meditation");
        }
        if (containsAny(symptom, "loneliness", "lonely", "isolation", "social anxiety")) {
            therapies.add("Group Yoga / Community Wellness / Guided Meditation / Ayurvedic Counselling");
        }

        // ── Sleep ──
        if (containsAny(symptom,
                "insomnia", "can't sleep", "cannot sleep", "unable to sleep",
                "sleep problem", "sleepless", "trouble sleeping", "difficulty sleeping",
                "waking up at night", "poor sleep", "no sleep", "not sleeping")) {
            therapies.add("Sleep Hygiene Therapy / Yoga Nidra / Ayurvedic Ashwagandha Protocol / Acupuncture");
        }
        if (containsAny(symptom,
                "oversleeping", "excessive sleep", "hypersomnia", "fatigue after sleeping",
                "sleep too much", "sleeping too much")) {
            therapies.add("Ayurvedic Detox / Pranayama Energization / Herbal Therapy");
        }

        // ── Fatigue & Energy ──
        if (containsAny(symptom,
                "fatigue", "tired", "tiredness", "exhausted", "exhaustion",
                "no energy", "low energy", "lack of energy", "weak", "weakness",
                "lethargy", "lethargic", "chronic fatigue", "always tired", "feeling drained")) {
            therapies.add("Ayurvedic Rejuvenation (Rasayana) / Acupuncture / Nutritional Therapy");
        }
        if (containsAny(symptom,
                "brain fog", "difficulty concentrating", "poor memory", "memory loss",
                "lack of focus", "can't focus", "cannot focus", "concentration",
                "forgetful", "forgetfulness", "mental clarity", "unclear thinking")) {
            therapies.add("Ayurvedic Medhya Rasayana / Meditation / Acupuncture");
        }

        // ── Digestive ──
        if (containsAny(symptom,
                "bloating", "bloated", "gas", "flatulence", "indigestion",
                "acidity", "acid reflux", "gerd", "heartburn", "burping", "belching")) {
            therapies.add("Ayurvedic Digestive Therapy / Herbal Medicine / Probiotic Therapy");
        }
        if (containsAny(symptom,
                "constipation", "irregular bowel", "ibs", "irritable bowel",
                "stomach cramp", "stomach pain", "abdominal pain", "abdominal cramp")) {
            therapies.add("Ayurvedic Panchakarma / Abdominal Massage / Herbal Laxative Therapy");
        }
        if (containsAny(symptom,
                "nausea", "nauseated", "vomiting", "vomit", "motion sickness",
                "stomach upset", "queasy", "upset stomach")) {
            therapies.add("Acupressure / Ginger-based Herbal Therapy / Ayurvedic Digestive Balance");
        }
        if (containsAny(symptom,
                "appetite loss", "no appetite", "not hungry", "eating disorder",
                "anorexia", "loss of appetite", "poor appetite")) {
            therapies.add("Ayurvedic Agni Therapy / Nutritional Counselling / Mindful Eating Therapy");
        }
        if (containsAny(symptom, "diarrhea", "diarrhoea", "loose stool", "loose motion")) {
            therapies.add("Ayurvedic Digestive Balance / Probiotic Therapy / Herbal Astringent Therapy");
        }

        // ── Headache & Neurological ──
        if (containsAny(symptom,
                "migraine", "chronic headache", "cluster headache", "severe headache")) {
            therapies.add("Acupuncture / Biofeedback Therapy / Ayurvedic Shirodhara");
        }
        if (containsAny(symptom,
                "headache", "head ache", "headaches", "head pain", "head pressure",
                "tension headache", "pain in the head", "pain in my head",
                "my head hurts", "head hurts", "head is hurting")) {
            therapies.add("Acupressure / Aromatherapy / Yoga for Tension Relief");
        }
        if (containsAny(symptom,
                "vertigo", "dizziness", "dizzy", "lightheaded", "balance problem",
                "spinning sensation")) {
            therapies.add("Vestibular Physiotherapy / Acupuncture / Herbal Therapy");
        }
        if (containsAny(symptom,
                "tingling", "numbness", "numb", "nerve pain", "neuropathy",
                "sciatica", "sciatic", "pins and needles")) {
            therapies.add("Acupuncture / Physiotherapy / Ayurvedic Nerve Therapy");
        }

        // ── Respiratory ──
        if (containsAny(symptom,
                "asthma", "wheezing", "wheeze", "difficulty breathing", "bronchitis",
                "chronic cough", "chest congestion")) {
            therapies.add("Pranayama Breathing Therapy / Acupuncture / Ayurvedic Herbal Steam");
        }
        if (containsAny(symptom,
                "cold", "common cold", "cough", "flu", "influenza", "runny nose",
                "sore throat", "throat pain", "congestion", "nasal congestion",
                "sinusitis", "sinus", "blocked nose", "stuffy nose")) {
            therapies.add("Ayurvedic Herbal Immunity Therapy / Steam Inhalation / Neti Pot Cleanse");
        }
        if (containsAny(symptom,
                "allergy", "allergic", "allergies", "hay fever", "sneezing", "itchy eyes",
                "watery eyes", "pollen", "dust allergy")) {
            therapies.add("Acupuncture / Ayurvedic Allergy Relief / Herbal Antihistamine Therapy");
        }

        // ── Skin ──
        if (containsAny(symptom,
                "acne", "pimple", "breakout", "skin rash", "eczema", "psoriasis",
                "dermatitis", "rosacea", "skin infection", "skin irritation")) {
            therapies.add("Ayurvedic Skin Therapy / Herbal Blood Purification / Nutritional Therapy");
        }
        if (containsAny(symptom,
                "dry skin", "oily skin", "itching", "itchy skin", "redness", "hives",
                "skin problem", "skin issue", "flaky skin")) {
            therapies.add("Ayurveda / Herbal Dermatology Therapy");
        }

        // ── Hormonal & Women's Health ──
        if (containsAny(symptom,
                "period pain", "menstrual cramp", "menstrual", "pcos", "polycystic ovary",
                "pms", "premenstrual", "irregular period", "missed period", "heavy period")) {
            therapies.add("Ayurvedic Hormonal Balance / Yoga for Women / Acupuncture");
        }
        if (containsAny(symptom,
                "menopause", "hot flash", "hot flush", "hormonal imbalance", "estrogen",
                "night sweat", "menopausal")) {
            therapies.add("Ayurvedic Menopause Therapy / Phytoestrogen Herbal Treatment / Acupuncture");
        }
        if (containsAny(symptom,
                "fertility", "infertility", "trying to conceive", "ivf", "reproductive")) {
            therapies.add("Ayurvedic Fertility Therapy / Acupuncture / Stress Reduction Yoga");
        }

        // ── Weight & Metabolic ──
        if (containsAny(symptom,
                "weight gain", "obesity", "obese", "overweight", "metabolic syndrome",
                "can't lose weight", "cannot lose weight")) {
            therapies.add("Ayurvedic Detox (Panchakarma) / Naturopathy Diet / Therapeutic Yoga");
        }
        if (containsAny(symptom,
                "weight loss", "underweight", "low bmi", "thin", "can't gain weight",
                "cannot gain weight", "too thin", "skinny")) {
            therapies.add("Ayurvedic Nutritive Therapy / Yoga for Weight Gain / Nutritional Counselling");
        }
        if (containsAny(symptom,
                "diabetes", "blood sugar", "high blood sugar", "low blood sugar",
                "insulin", "hyperglycemia", "hypoglycemia", "diabetic")) {
            therapies.add("Ayurvedic Diabetes Management / Yoga Therapy / Naturopathic Nutritional Support");
        }
        if (containsAny(symptom,
                "high blood pressure", "hypertension", "low blood pressure", "hypotension",
                "blood pressure")) {
            therapies.add("Yoga / Pranayama / Ayurvedic Cardiovascular Therapy / Meditation");
        }
        if (containsAny(symptom,
                "high cholesterol", "cholesterol", "triglyceride", "lipid")) {
            therapies.add("Ayurvedic Lipid Management / Naturopathic Diet Therapy / Yoga");
        }

        // ── Urinary & Kidney ──
        if (containsAny(symptom,
                "uti", "urinary infection", "urinary tract", "frequent urination",
                "burning urination", "painful urination", "bladder", "bladder infection")) {
            therapies.add("Ayurvedic Urinary Tract Therapy / Herbal Diuretic Support / Naturopathy");
        }
        if (containsAny(symptom,
                "kidney stone", "kidney pain", "kidney problem", "kidney", "renal")) {
            therapies.add("Ayurvedic Kidney Detox / Herbal Stone Dissolution Therapy / Hydration Therapy");
        }

        // ── Eye & Ear ──
        if (containsAny(symptom,
                "eye strain", "dry eyes", "blurry vision", "eye pain", "eye problem",
                "vision problem", "poor vision", "watery eyes")) {
            therapies.add("Ayurvedic Netra Therapy (Eye Care) / Palming Technique / Yoga for Eyes");
        }
        if (containsAny(symptom,
                "ear pain", "ear infection", "ear ache", "tinnitus", "ringing in ears",
                "hearing loss", "hearing problem", "hard of hearing")) {
            therapies.add("Ayurvedic Karna Poorana (Ear Oil Therapy) / Acupuncture");
        }

        // ── Immune & General Wellness ──
        if (containsAny(symptom,
                "low immunity", "weak immune", "frequent illness", "immune system",
                "autoimmune", "frequent infection", "getting sick often")) {
            therapies.add("Ayurvedic Rasayana Immunity Boost / Herbal Adaptogens / Yoga");
        }
        if (containsAny(symptom,
                "detox", "toxin", "cleanse", "body purification", "liver detox", "liver")) {
            therapies.add("Ayurvedic Panchakarma Detox / Naturopathic Cleanse / Herbal Therapy");
        }

        // ── Dental & Oral ──
        if (containsAny(symptom,
                "tooth pain", "toothache", "gum pain", "oral health", "mouth ulcer",
                "bad breath", "gum disease", "bleeding gums", "jaw pain")) {
            therapies.add("Ayurvedic Oil Pulling / Herbal Oral Care / Acupuncture for Dental Pain");
        }

        // ── Addiction & Lifestyle ──
        if (containsAny(symptom,
                "smoking", "nicotine", "alcohol", "addiction", "substance", "craving")) {
            therapies.add("Acupuncture / Mindfulness-Based Addiction Therapy / Ayurvedic Detox");
        }

        // ─────────────────────────────────────────────────────────────────────
        // Build final response
        // ─────────────────────────────────────────────────────────────────────
        String suggestedTherapy;
        if (therapies.isEmpty()) {
            suggestedTherapy = "Holistic Wellness Assessment — Based on your description, we recommend a personalised consultation with an Ayurvedic practitioner or holistic health coach. Consider Yoga, Meditation, or Naturopathy as a starting point.";
        } else if (therapies.size() == 1) {
            suggestedTherapy = therapies.get(0);
        } else {
            // Multiple conditions matched — combine them clearly
            suggestedTherapy = String.join(" | ", therapies);
        }

        String sourceAPI = "Wellnest Rule-Based Wellness Engine v3";

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
        String notifTherapy = suggestedTherapy.split("—")[0].split("\\|")[0].trim();
        Notification notification = Notification.builder()
                .userId(dto.getUserId())
                .type("RECOMMENDATION")
                .message("New therapy recommendation: " + notifTherapy)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        return mapToResponseDto(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Helper: check if input contains any of the given keywords
    // ─────────────────────────────────────────────────────────────────────────
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
        dto.setCreatedAt(recommendation.getCreatedAt());
        return dto;
    }
}
