package com.github.duc010298.shopxml.controller;

import com.github.duc010298.shopxml.entity.AppUser;
import com.github.duc010298.shopxml.entity.Bill;
import com.github.duc010298.shopxml.entity.Product;
import com.github.duc010298.shopxml.repository.AppUserRepository;
import com.github.duc010298.shopxml.repository.BillRepository;
import com.github.duc010298.shopxml.repository.ProductRepository;
import com.github.duc010298.shopxml.services.TokenAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping("/bills")
public class BillController {

    private BillRepository billRepository;
    private AppUserRepository appUserRepository;
    private ProductRepository productRepository;
    private TokenAuthenticationService tokenAuthenticationService;

    @Autowired
    public BillController(BillRepository billRepository, AppUserRepository appUserRepository,
                          ProductRepository productRepository, TokenAuthenticationService tokenAuthenticationService) {
        this.billRepository = billRepository;
        this.appUserRepository = appUserRepository;
        this.productRepository = productRepository;
        this.tokenAuthenticationService = tokenAuthenticationService;
    }

    @PostMapping(produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> addBill(@RequestParam("product_id") int productId, @RequestParam("address") String address, @RequestHeader("token") String token) {
        try {
            String userName = tokenAuthenticationService.getUserName(token);
            AppUser currentUser = appUserRepository.findByUserName(userName);
            Optional<Product> productOptional = productRepository.findById(productId);
            if (!productOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
            }
            Product product = productOptional.get();
            Bill bill = new Bill();
            bill.setDateCreate(new Date());
            bill.setPurchasePrice(product.getPrice());
            bill.setAddress(address);
            bill.setUser(currentUser);
            bill.setProduct(product);
            billRepository.save(bill);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
