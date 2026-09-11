package com.securevault.controller;

import com.securevault.service.ReportService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportRestController {
    private final ReportService reportService;

    public ReportRestController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/password-health")
    public Map<String, Object> getPasswordHealth(@RequestParam String email) {
        return reportService.getPasswordHealthReport(email);
    }

    @GetMapping("/login-activity")
    public Map<String, Object> getLoginActivity(@RequestParam String email) {
        return reportService.getLoginActivityReport(email);
    }
}