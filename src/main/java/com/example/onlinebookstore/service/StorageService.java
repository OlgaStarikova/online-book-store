package com.example.onlinebookstore.service;

import com.example.onlinebookstore.config.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@RequiredArgsConstructor
@Service
public class StorageService {
    private final S3Client s3Client;
    private final StorageProperties storageProperties;

    public String uploadFile(String key, byte[] content, String contentType) {
        PutObjectRequest request = PutObjectRequest.builder()
                .bucket(storageProperties.getBucketName())
                .key(key)
                .contentType(contentType)
                .build();
        s3Client.putObject(request, RequestBody.fromBytes(content));
        return storageProperties.getPublicUrl()
                + "/" + storageProperties.getBucketName()
                + "/" + key;
    }
}
