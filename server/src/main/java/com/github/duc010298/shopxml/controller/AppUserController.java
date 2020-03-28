package com.github.duc010298.shopxml.controller;

import com.github.duc010298.shopxml.entity.AppUser;
import com.github.duc010298.shopxml.entity.Bill;
import com.github.duc010298.shopxml.response.LoginResponse;
import com.github.duc010298.shopxml.repository.AppUserRepository;
import com.github.duc010298.shopxml.services.TokenAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class AppUserController {

    private AppUserRepository appUserRepository;
    private TokenAuthenticationService tokenAuthenticationService;

    @Autowired
    public AppUserController(AppUserRepository appUserRepository, TokenAuthenticationService tokenAuthenticationService) {
        this.appUserRepository = appUserRepository;
        this.tokenAuthenticationService = tokenAuthenticationService;
    }

    @PostMapping(value = "/sign-in", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> signIn(@RequestParam("username") String userName, @RequestParam("password") String password) {
        try {
            Optional<AppUser> appUserEntityOptional = appUserRepository.findByUserNameAndPassword(userName, password);
            if (!appUserEntityOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login unsuccessful");
            }

            return ResponseEntity.status(HttpStatus.OK).body(
                    new LoginResponse(tokenAuthenticationService.getToken(appUserEntityOptional.get().getUserName()),
                            appUserEntityOptional.get())
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login unsuccessful");
        }
    }

    @PostMapping(value = "/sign-up", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> signUp(@RequestParam("username") String userName, @RequestParam("password") String password,
                                   @RequestParam("fullName") String fullName, @RequestParam("email") String email,
                                   @RequestParam("phone") String phone) {
        if (invalidData(userName) || invalidData(password) || invalidData(fullName) || invalidData(email) || invalidData(phone)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Bad Request");
        }
        AppUser user = appUserRepository.findByUserName(userName);
        if (user != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username exist");
        }
        user = new AppUser();
        user.setUserName(userName);
        user.setPassword(password);
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        appUserRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body("Create user successfully");
    }

    private boolean invalidData(String value) {
        return value == null || value.isEmpty();
    }

    @GetMapping(value = "/{id}/bills", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> getAllBillOfUser(@PathVariable("id") int userId, @RequestHeader("token") String token) {
        try {
            String userName = tokenAuthenticationService.getUserName(token);
            AppUser currentUser = appUserRepository.findByUserName(userName);
            if (currentUser.getId() != userId) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            List<Bill> bills = currentUser.getBillList();
            return ResponseEntity.status(HttpStatus.OK).body(bills);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
