package com.example.onlinebookstore.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {
    private String endpoint;
    private String accessKey;
    private String secretKey;
    private String region;
    private String bucketName;
    private String publicUrl;
}
