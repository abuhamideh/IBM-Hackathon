package com.example.hackathon.repo;

import com.example.hackathon.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserRepository extends CrudRepository<User, String> {
    User findByUsername(String username);
    List<User> findAll();
}
