package com.github.duc010298.shopxml.controller;

import com.github.duc010298.shopxml.dto.ErrorResponse;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.RequestDispatcher;
import javax.servlet.http.HttpServletRequest;

@RestController
public class ShopErrorController implements ErrorController {

    @RequestMapping(value = "/error", produces = MediaType.APPLICATION_XML_VALUE)
    public ErrorResponse handleError(HttpServletRequest request) {
        Integer status = (Integer) request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        String message = (String) request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        String path = (String) request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        String reasonPhrase = HttpStatus.valueOf(400).getReasonPhrase();
        return new ErrorResponse(status, reasonPhrase, message, path);
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }
}