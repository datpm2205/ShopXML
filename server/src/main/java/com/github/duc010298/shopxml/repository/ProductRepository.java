package com.github.duc010298.shopxml.repository;

import com.github.duc010298.shopxml.entity.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    @Query("select count(p.id) from Product p")
    Integer getTotalProduct();

    List<Product> findByOrderByLastUpdateAsc(Pageable pageable);

    List<Product> findByOrderByLastUpdateDesc(Pageable pageable);

    List<Product> findByOrderByPriceAsc(Pageable pageable);

    List<Product> findByOrderByPriceDesc(Pageable pageable);

    List<Product> findByOrderByNameAsc(Pageable pageable);

    List<Product> findByOrderByNameDesc(Pageable pageable);
}
