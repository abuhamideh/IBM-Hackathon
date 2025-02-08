package com.example.hackathon.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class InvestmentPagesController {
    @GetMapping("/isa")
    public String isa() {
        return "isa";
    }

    @GetMapping("/investment")
    public String investment() {
        return "investment";
    }
}
