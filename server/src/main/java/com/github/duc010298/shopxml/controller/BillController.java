package com.github.duc010298.shopxml.controller;

import com.github.duc010298.shopxml.dto.BillDTO;
import com.github.duc010298.shopxml.entity.AppUser;
import com.github.duc010298.shopxml.entity.Bill;
import com.github.duc010298.shopxml.entity.BillDetail;
import com.github.duc010298.shopxml.entity.Product;
import com.github.duc010298.shopxml.repository.AppUserRepository;
import com.github.duc010298.shopxml.repository.BillDetailRepository;
import com.github.duc010298.shopxml.repository.BillRepository;
import com.github.duc010298.shopxml.repository.ProductRepository;
import com.github.duc010298.shopxml.services.TokenAuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/bills")
public class BillController {

    private BillRepository billRepository;
    private BillDetailRepository billDetailRepository;
    private AppUserRepository appUserRepository;
    private ProductRepository productRepository;
    private TokenAuthenticationService tokenAuthenticationService;

    @Autowired
    public BillController(BillRepository billRepository, BillDetailRepository billDetailRepository,
                          AppUserRepository appUserRepository, ProductRepository productRepository,
                          TokenAuthenticationService tokenAuthenticationService) {
        this.billRepository = billRepository;
        this.billDetailRepository = billDetailRepository;
        this.appUserRepository = appUserRepository;
        this.productRepository = productRepository;
        this.tokenAuthenticationService = tokenAuthenticationService;
    }

    @GetMapping(produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> getBills( @RequestHeader("token") String token) {
        String userName = tokenAuthenticationService.getUserName(token);
        AppUser currentUser = appUserRepository.findByUserName(userName);
        return ResponseEntity.status(HttpStatus.OK).body(currentUser.getBillList());
    }

    @PostMapping(produces = MediaType.APPLICATION_XML_VALUE, consumes = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> addBill(@RequestBody BillDTO billDTO, @RequestHeader("token") String token) {
        Bill bill = new Bill();
        try {
            bill.setDateCreate(new Date());
            bill.setRecipientName(billDTO.getRecipientName());
            bill.setRecipientPhone(billDTO.getRecipientPhone());
            bill.setRecipientAddress(billDTO.getRecipientAddress());
            bill.setStatus(1);

            String userName = tokenAuthenticationService.getUserName(token);
            AppUser currentUser = appUserRepository.findByUserName(userName);
            bill.setUser(currentUser);
            bill = billRepository.save(bill);

            HashMap<String, String> countHash = new HashMap<>();

            for (String productId : billDTO.getProductIds()) {
                if (countHash.containsKey(productId)) {
                    int amount = Integer.parseInt(countHash.get(productId));
                    countHash.replace(productId, String.valueOf(amount + 1));
                } else {
                    countHash.put(productId, "1");
                }
            }

            for (Map.Entry me : countHash.entrySet()) {
                Optional<Product> productOptional = productRepository.findById(Integer.parseInt(me.getKey().toString()));
                if (!productOptional.isPresent()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
                }
                Product product = productOptional.get();
                BillDetail billDetail = new BillDetail();
                billDetail.setProductName(product.getName());
                billDetail.setProductImage(product.getImage());
                billDetail.setProductPrice(product.getPrice());
                billDetail.setAmount(Integer.parseInt(me.getValue().toString()));
                billDetail.setBill(bill);
                billDetailRepository.save(billDetail);
            }

            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}
