# Stage 1: build with Maven
FROM eclipse-temurin:17-jdk-alpine AS builder
WORKDIR /online-book-store
COPY pom.xml .
COPY checkstyle.xml .
COPY src ./src
RUN apk add --no-cache maven && mvn package -DskipTests

# Stage 2: extract layers
FROM eclipse-temurin:17-jdk-alpine AS layers
WORKDIR /online-book-store
COPY --from=builder /online-book-store/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

# Stage 3: final image
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /online-book-store
COPY --from=layers /online-book-store/dependencies/ ./
COPY --from=layers /online-book-store/spring-boot-loader/ ./
COPY --from=layers /online-book-store/snapshot-dependencies/ ./
COPY --from=layers /online-book-store/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
EXPOSE 8080
