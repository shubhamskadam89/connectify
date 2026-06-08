package com.connectify.backend.auth.service;

import com.connectify.backend.user.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class JwtService {

    private static final String HMAC_ALGORITHM = "HmacSHA256";
    private static final Base64.Encoder ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder DECODER = Base64.getUrlDecoder();

    private final ObjectMapper objectMapper;
    private final byte[] secret;
    private final long accessTokenTtlSeconds;

    public JwtService(
            ObjectMapper objectMapper,
            @Value("${JWT_SECRET:change-this-jwt-secret-before-production}") String secret,
            @Value("${JWT_ACCESS_TOKEN_TTL_SECONDS:900}") long accessTokenTtlSeconds
    ) {
        this.objectMapper = objectMapper;
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.accessTokenTtlSeconds = accessTokenTtlSeconds;
    }

    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        Map<String, Object> header = new LinkedHashMap<>();
        header.put("alg", "HS256");
        header.put("typ", "JWT");

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sub", user.getEmail());
        payload.put("uid", user.getId());
        payload.put("role", user.getRole().name());
        payload.put("iat", now.getEpochSecond());
        payload.put("exp", now.plusSeconds(accessTokenTtlSeconds).getEpochSecond());

        String unsignedToken = encode(header) + "." + encode(payload);
        return unsignedToken + "." + sign(unsignedToken);
    }

    public Optional<String> extractSubject(String token) {
        try {
            Map<String, Object> payload = parseAndValidate(token);
            Object subject = payload.get("sub");
            return subject instanceof String value ? Optional.of(value) : Optional.empty();
        } catch (RuntimeException ex) {
            return Optional.empty();
        }
    }

    public boolean isValid(String token) {
        try {
            parseAndValidate(token);
            return true;
        } catch (RuntimeException ex) {
            return false;
        }
    }

    private Map<String, Object> parseAndValidate(String token) {
        String[] parts = token.split("\\.");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Invalid JWT");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        String expectedSignature = sign(unsignedToken);
        if (!MessageDigest.isEqual(expectedSignature.getBytes(StandardCharsets.UTF_8), parts[2].getBytes(StandardCharsets.UTF_8))) {
            throw new IllegalArgumentException("Invalid JWT signature");
        }

        Map<String, Object> payload = decode(parts[1]);
        Object expiry = payload.get("exp");
        if (!(expiry instanceof Number number) || Instant.now().getEpochSecond() >= number.longValue()) {
            throw new IllegalArgumentException("JWT expired");
        }

        return payload;
    }

    private String encode(Map<String, Object> value) {
        try {
            byte[] json = objectMapper.writeValueAsBytes(value);
            return ENCODER.encodeToString(json);
        } catch (Exception ex) {
            throw new IllegalStateException("Could not encode JWT", ex);
        }
    }

    private Map<String, Object> decode(String value) {
        try {
            byte[] json = DECODER.decode(value);
            return objectMapper.readValue(json, new TypeReference<>() {
            });
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid JWT payload", ex);
        }
    }

    private String sign(String value) {
        try {
            Mac mac = Mac.getInstance(HMAC_ALGORITHM);
            mac.init(new SecretKeySpec(secret, HMAC_ALGORITHM));
            return ENCODER.encodeToString(mac.doFinal(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Could not sign JWT", ex);
        }
    }
}
