package com.securevault.service;

import com.securevault.entity.Notification;
import com.securevault.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(
            Long userId,
            String type,
            String title,
            String message
    ) {

        Notification notification =
                new Notification(
                        userId,
                        type,
                        title,
                        message
                );

        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public String markAsRead(Long notificationId) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElse(null);

        if (notification == null) {
            return "Notification not found";
        }

        notification.setRead(true);

        notificationRepository.save(notification);

        return "Notification marked as read";
    }

    public String markAllAsRead(Long userId) {

        List<Notification> notifications =
                notificationRepository
                        .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);

        return "All notifications marked as read";
    }
}