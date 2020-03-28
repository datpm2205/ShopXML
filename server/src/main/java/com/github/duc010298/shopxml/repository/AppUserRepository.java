package com.github.duc010298.shopxml.repository;

import com.github.duc010298.shopxml.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {

    AppUser findByUserName(String userName);

    Optional<AppUser> findByUserNameAndPassword(String userName, String password);
}
