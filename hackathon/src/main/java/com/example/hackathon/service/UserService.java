package com.example.hackathon.service;

import com.example.hackathon.model.User;
import com.example.hackathon.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void registerUser(String username, String fullName, String investmentType, String password) {
        User user = new User();
        user.setUsername(username);
        user.setFullName(fullName);
        user.setInvestmentType(investmentType);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
    }
}
