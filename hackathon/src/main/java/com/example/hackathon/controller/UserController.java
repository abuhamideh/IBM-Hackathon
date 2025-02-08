package com.example.hackathon.controller;

import com.example.hackathon.model.User;
import com.example.hackathon.repo.UserRepository;
import com.example.hackathon.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value="/register", method = RequestMethod.GET)
    public String register() {
        return "register";
    }

    @RequestMapping(value="/register", method = RequestMethod.POST)
    public String userRegistration(
            @RequestParam String username,
            @RequestParam String password,
            @RequestParam String fullName,
            @RequestParam String investmentType) {
        userService.registerUser(username, fullName, investmentType, password);
        return "redirect:/login";
    }
}
