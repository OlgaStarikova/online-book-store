<h1><strong>Online Book Store</strong></h1>

<h2>Introduction</h2>
<ul style="list-style-type: disc;">
<li>
<h3>What is it?</h3>
This is the Web application.<br />This project was created as an example of online store. It provides the main backend functionality of the e - shop.
<blockquote>The main goal of creating the project was to master the tools of Java in the process of the building all its components from scratch.</blockquote>
</li>
<li>
<h3>Tools used</h3>
So,
<ul style="list-style-type: circle;">
<li>Project is relazed on Java 17 and Spring Boot Web.</li>
<li>This application is a self-contained HTTP server by using embedded Tomcat.</li>
<li>For work with data and for CRUD operations is used Hibernate wich works with specification for managing relational data Java Persistence API (Spring Data JPA).</li>
<li>Paginating and sorting are maintaining.</li>
<li>All tables are generate by Liquibase when the application is running the first time. </li>
<li>Mapping between different object models (Entities and DTOs) is generated by MapStruct.</li>
<li>Basic CRUD operations are generated and managed by JpaRepository, custom methods is written with Query with Params usage.</li>
<li>SoftDeleting approach is applied.</li>
<li>Lombok is used for automatic building getters and setters for enteties.</li>
<li>In my Spring Boot application, I use the Swagger UI tool to automatically generate documentation for REST APIs.</li>
<li>Application is defended with usage of Spring Boot Security. Authenticantion and access-control by roles are provided. </li>
<li>Authenticantion is processing by getting a login and password in request and generation a JWT (JSON Web Token) in respond. In the next requests bearer tokens enable requests to authenticate using this token as an access key. </li>
<li>The SecurityFilterChain defines the sequence of filters that will be applied to the request. </li>
<li>This application has two users roles : Admin and User.</li>
<li>Application completly is containered by Docker.</li>
<li>All work with this project had been doing in IntelliJ IDEA IDE</li>
<li>Building with Maven</li>
<li>Transfering to GitHub for consultation with mentors.</li>
</ul>
</li>
</ul>
<h2>Example</h2>
The project was launched on AWS
http://ec2-54-235-185-184.compute-1.amazonaws.com/swagger-ui/index.html
You can test it using this Login and Password: 
{
  "email": "User@gmail.com",
  "password": "123456789"
}
