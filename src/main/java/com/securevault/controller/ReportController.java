package com.securevault.controller;

import com.securevault.service.ReportService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // =====================================================
    // PASSWORD HEALTH
    // =====================================================

    @GetMapping("/password-health")
    public Map<String, Object> getPasswordHealthReport() {

        return reportService.getPasswordHealthReport();
    }

    // =====================================================
    // LOGIN ACTIVITY
    // =====================================================

    @GetMapping("/login-activity")
    public Map<String, Object> getLoginActivityReport() {

        return reportService.getLoginActivityReport();
    }
}