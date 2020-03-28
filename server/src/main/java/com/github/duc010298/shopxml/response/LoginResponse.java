package com.github.duc010298.shopxml.response;

import com.github.duc010298.shopxml.entity.AppUser;

public class LoginResponse {
    private String token;
    private AppUser appUser;

    public LoginResponse(String token, AppUser appUser) {
        this.token = token;
        this.appUser = appUser;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public AppUser getAppUser() {
        return appUser;
    }

    public void setAppUser(AppUser appUser) {
        this.appUser = appUser;
    }
}
