package com.example.hackathon.controller;

import com.example.hackathon.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/money")
public class MoneyController {
    private final UserService userService;

    @Autowired
    public MoneyController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/add")
    public String addMoney(@RequestParam String username, @RequestParam int money) {
        userService.addMoney(username, money);
        return "success";
    }

    @PostMapping("/subtract")
    public String subtractMoney(@RequestParam String username, @RequestParam int money) {
        userService.subtractMoney(username, money);
        return "success";
    }

    @RequestMapping("/balance")
    public int balance(@RequestParam String username) {
        return userService.checkBalance(username);
    }

    @GetMapping("/username")
    @ResponseBody
    public String username(Authentication authentication) {
        if (authentication == null) {
            throw new RuntimeException("User is not authenticated");
        }
        return authentication.getName();
    }
}
