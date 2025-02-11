package com.example.hackathon.service;

import com.example.hackathon.model.User;
import com.example.hackathon.repo.UserRepository;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class CustomerDetails implements UserDetailsService {
    private final UserRepository userRepository;

    @Autowired
    public CustomerDetails(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public org.springframework.security.core.userdetails.UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Attempting to load user: " + username);

        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("User not found: " + username);
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        System.out.println("User found: " + username);
        System.out.println("Investment type: " + user.getInvestmentType());

        var userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .roles(user.getInvestmentType())
                .build();

        System.out.println("UserDetails created successfully");
        return userDetails;
    }
}
