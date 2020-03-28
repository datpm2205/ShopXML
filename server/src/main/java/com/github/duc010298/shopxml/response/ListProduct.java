package com.github.duc010298.shopxml.response;

import com.github.duc010298.shopxml.entity.Product;

import java.util.List;

public class ListProduct {
    private int totalRecord;
    private int pageSize;
    private int pageIndex;
    private String sortMode;
    private List<Product> products;

    public ListProduct(int totalRecord, int pageSize, int pageIndex, String sortMode, List<Product> products) {
        this.totalRecord = totalRecord;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.sortMode = sortMode;
        this.products = products;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public int getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }

    public String getSortMode() {
        return sortMode;
    }

    public void setSortMode(String sortMode) {
        this.sortMode = sortMode;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}
