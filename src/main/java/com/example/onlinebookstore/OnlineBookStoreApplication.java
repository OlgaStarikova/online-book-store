package com.example.onlinebookstore;

import com.example.onlinebookstore.model.Book;
import com.example.onlinebookstore.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class OnlineBookStoreApplication {
    @Autowired
    private BookService bookService;

    public static void main(String[] args) {
        SpringApplication.run(OnlineBookStoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner() {
        return args -> {
            Book bookTomSoyer = new Book();
            bookTomSoyer.setTitle("Tom Soyer");
            bookTomSoyer.setAuthor("Mark Twen");
            bookTomSoyer.setIsbn("111");
            bookTomSoyer.setPrice(BigDecimal.valueOf(120.00));
            Book bookSaved = bookService.save(bookTomSoyer);
            System.out.println(bookService.findAll());
        };
    }
}
