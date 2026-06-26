// package com.example.demo;

// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RestController;

// @RestController
// public class HelloController {

//     @GetMapping("/")
//     public String hello() {
//         return "Hello, Spring Boot is working!";
//     }
// }
package com.example.demo;

import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Hello, Spring Boot is working!";
    }

    @GetMapping("/user")
    public Map<String, Object> getUser() {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Rahul");
        data.put("age", 25);
        data.put("city", "Mumbai");
        return data;
    }
}