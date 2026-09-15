package com.securevault.controller;

import com.securevault.entity.Notification;
import com.securevault.entity.User;
import com.securevault.service.NotificationService;
import com.securevault.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping
    public List<Notification> getNotifications(
            @RequestParam String email) {

        User user = userService.getUserByEmail(email);

        if (user == null) {
            return List.of();
        }

        return notificationService
                .getUserNotifications(user.getId());
    }

    @GetMapping("/unread")
    public List<Notification> getUnreadNotifications(
            @RequestParam String email) {

        User user = userService.getUserByEmail(email);

        if (user == null) {
            return List.of();
        }

        return notificationService
                .getUnreadNotifications(user.getId());
    }

    @PutMapping("/{id}/read")
    public String markAsRead(
            @PathVariable Long id) {

        return notificationService
                .markAsRead(id);
    }

    @PutMapping("/read-all")
    public String markAllAsRead(
            @RequestParam String email) {

        User user = userService.getUserByEmail(email);

        if (user == null) {
            return "User not found";
        }

        return notificationService
                .markAllAsRead(user.getId());
    }
}