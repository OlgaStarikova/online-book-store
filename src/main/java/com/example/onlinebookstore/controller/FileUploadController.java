package com.example.onlinebookstore.controller;

import com.example.onlinebookstore.service.StorageService;
import io.swagger.v3.oas.annotations.Operation;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/upload")
public class FileUploadController {
    private final StorageService storageService;

    public FileUploadController(StorageService storageService) {
        this.storageService = storageService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Upload book cover image")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file)
            throws IOException {
        String key = UUID.randomUUID() + "_" + file.getOriginalFilename();
        String url = storageService.uploadFile(key, file.getBytes(), file.getContentType());
        return Map.of("url", url);
    }
}
