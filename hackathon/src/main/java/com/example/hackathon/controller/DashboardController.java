package com.example.hackathon.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DashboardController {
    @GetMapping("/graphs")
    public String graphs() {
        return "graphs";
    }

    @GetMapping("/game")
    public String game() {
        return "game";
    }


}
