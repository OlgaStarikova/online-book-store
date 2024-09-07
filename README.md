# **Online Book Store**
___
## Introduction

### What is it?
This is the Web application.<br />This project  provides the main backend functionality of the **e - shop**.
>_The main goal of creating the project was to master the tools of Java in the process of the building all its components from scratch._

### What does it can?
Bookstore is a web application that enables online selection and purchase of books of various categories. 
>**ADMIN ROLE** The application allows the administrator to enter and manage the database of books by categories, adding and deleting categories, books, changing the price and other properties. 

>**USER ROLE** Using this platform, users can browse the catalog of books and search for books by various criteria. After registration, users can add to the cart and order books.

## Technologies and Tools used
So,

+ **Java 17** Project is relazed on Java 17 
+ **Spring Boot Web**
+ **Tomcat** - This application is a self-contained HTTP server by using embedded Tomcat
+ **Hibernate** - For work with data and for CRUD operations is used Hibernate
+ **Spring Data JPA**- Hibernate working with specification for managing relational data Java Persistence API (Spring Data JPA)
+ **Lombok** is used for automatic building getters and setters for entities
+ **Paginating** and sorting are maintaining
+ **Liquibase** - All tables are generate by Liquibase when the application is running the first time
+ **MapStruct** - Mapping between different object models (Entities and DTOs) is generated by MapStruct
+ **JpaRepository** - Basic CRUD operations are generated and managed by JpaRepository, custom methods is written with Query with Params usage
+ **MySQL** - relational database is used to store and manage data in application. 
+ **SoftDeleting** approach is applied
+ **Swagger**  - In my Spring Boot application, I use the Swagger UI tool to automatically generate documentation for REST APIs
+ **Spring Boot Security** - Application is defended with usage of Spring Boot Security. Authenticantion and access-control by roles are provided
+ **JSON Web Token** - Authenticantion is processing by getting a login and password in request and generation a JWT (JSON Web Token) in respond. In the next requests bearer tokens enable requests to authenticate using this token as an access key
+ **The SecurityFilterChain** defines the sequence of filters that will be applied to the request
+ **Access by roles** - This application has two users roles : Admin and User
+ **Docker** - Application completly is containered by Docker
+ **IntelliJ IDEA** - All work with this project had been doing in IntelliJ IDEA IDE
+ **Maven** - Building and checking code style with Maven
+ **GitHub** - Transfering to GitHub for consultation with mentors
+ **AWS** - Launched on AWS service EC2.

## Functionality of controllers
### Authentication controller
| HTTP Request| Endpoint             | Description            |
|-------------|----------------------|------------------------|
| POST        | `/auth/registration` | Register a new user    |
| POST        | `/auth/login`        | Login an existing user |    

### Category controller
| HTTP Request| Endpoint                 | Description                               |
|-------------|--------------------------|-------------------------------------------|
| POST        | `/categories`            | Create a new category                     |
| GET         | `/categories`            | Get a list of all categories              |
| GET         | `/categories/{id}`       | Get one category according to its ID      |
| PUT         | `/categories/{id}`       | Update an existing category by its ID     |
| DELETE      | `/categories/{id}`       | Delete one category according to its ID   |
| GET         | `/categories/{id}/books` | Get list of books by specific category ID |

### Book controller
| HTTP Request| Endpoint        | Description                                          |
|-------------|-----------------|------------------------------------------------------|
| GET         | `/books`        | Get a list of all available books                    |
| POST        | `/books`        | Create a new book and save it to the DB              |
| GET         | `/books/search` | Search books by specific parameters (authors/titles) |
| GET         | `/books/{id}`   | Get one book according to its ID                     |
| PUT         | `/books/{id}`   | Update an existing book from DB by its ID            |
| DELETE      | `/books/{id} `  | Delete one book from DB according to its ID          |

### Order controller
| HTTP Request| Endpoint                           | Description                            |
|-------------|------------------------------------|----------------------------------------|
| POST        | `/orders`                          | Place order using shipping address     |
| GET         | `/orders`                          | Get all users orders                   |
| PATCH       | `/orders/{id}`                     | Update orders status by its ID         |
| GET         | `/orders/{orderId}/items/{itemId}` | Get order item by its ID and orders ID |
| GET         | `/orders/{orderId}/items`          | Get order items by orders ID           |

### Shopping cart controller
| HTTP Request| Endpoint           | Description                                      |
|-------------|--------------------|--------------------------------------------------|
| GET         | `/cart`            | Get a content of shopping cart                   |
| POST        | `/cart`            | Add book to shopping cart                        |
| PUT         | `/cart/items/{id}` | Update quantity of one specific book in the cart |
| DELETE      | `/cart/items/{id}` | Delete cart item from users shopping cart        |

## DataBase Diagramm

![BookStoreDb](https://github.com/user-attachments/assets/e846edf7-4357-4691-91c0-264cc5b99dc4)

## Example
The project was launched on AWS
http://ec2-54-235-185-184.compute-1.amazonaws.com/swagger-ui/index.html
You can test it using this Login and Password: 
{
  "email": "User@gmail.com",
  "password": "123456789"
}
This video will help you understand what you need to do to log in:

https://github.com/user-attachments/assets/9b209410-33da-451a-8656-c50ed69fd5eb

Authorization is necessary for getting access to data.

For an example of how to make a request, watch this video:

https://github.com/user-attachments/assets/19caabe5-7ec2-4904-9d24-59b6823a71f0


