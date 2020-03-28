package com.github.duc010298.shopxml;

import com.github.duc010298.shopxml.configuration.ApiConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({
        ApiConfig.class
})
public class ShopXmlApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopXmlApplication.class, args);
    }

}
