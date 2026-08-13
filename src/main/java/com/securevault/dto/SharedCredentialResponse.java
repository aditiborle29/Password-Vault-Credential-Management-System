package com.securevault.dto;

public class SharedCredentialResponse {

    private Long id;
    private String website;
    private String username;
    private String password;
    private String permission;

    public SharedCredentialResponse() {
    }

    public SharedCredentialResponse(
            Long id,
            String website,
            String username,
            String password,
            String permission) {

        this.id = id;
        this.website = website;
        this.username = username;
        this.password = password;
        this.permission = permission;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }
}