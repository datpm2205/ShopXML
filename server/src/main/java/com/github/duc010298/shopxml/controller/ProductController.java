package com.github.duc010298.shopxml.controller;

import com.github.duc010298.shopxml.entity.Product;
import com.github.duc010298.shopxml.repository.ProductRepository;
import com.github.duc010298.shopxml.response.ListProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/products")
public class ProductController {

    private ProductRepository productRepository;

    @Autowired
    public ProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping(value = "/", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> getProducts(@RequestParam(value = "pageSize") Integer pageSize, @RequestParam(value = "pageIndex") Integer pageIndex,
                                         @RequestParam(value = "sortMode") String sortMode) {
        if (pageSize == null || pageIndex == null || sortMode == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        Pageable pageable = PageRequest.of(pageIndex, pageSize);
        int totalRecord = productRepository.getTotalProduct();
        // sortMode: latest | oldest | price_asc | price_desc | name_asc | name_desc
        switch (sortMode) {
            case "latest":
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ListProduct(totalRecord, pageSize, pageIndex, sortMode, productRepository.findByOrderByLastUpdateDesc(pageable))
                );
            case "oldest":
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ListProduct(totalRecord, pageSize, pageIndex, sortMode, productRepository.findByOrderByLastUpdateAsc(pageable))
                );
            case "price_asc":
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ListProduct(totalRecord, pageSize, pageIndex, sortMode, productRepository.findByOrderByPriceAsc(pageable))
                );
            case "price_desc":
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ListProduct(totalRecord, pageSize, pageIndex, sortMode, productRepository.findByOrderByPriceDesc(pageable))
                );
            case "name_asc":
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ListProduct(totalRecord, pageSize, pageIndex, sortMode, productRepository.findByOrderByNameAsc(pageable))
                );
            case "name_desc":
                return ResponseEntity.status(HttpStatus.OK).body(
                        new ListProduct(totalRecord, pageSize, pageIndex, sortMode, productRepository.findByOrderByNameDesc(pageable))
                );
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<?> getProduct(@PathVariable("id") Integer id) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (!productOptional.isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Cant find product");
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(productOptional.get());
        }
    }
}
