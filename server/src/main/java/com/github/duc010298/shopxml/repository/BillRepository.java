package com.github.duc010298.shopxml.repository;

import com.github.duc010298.shopxml.entity.Bill;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BillRepository  extends JpaRepository<Bill, Integer> {
}
