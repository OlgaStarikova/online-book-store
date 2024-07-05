# Builder stage
FROM openjdk:17-jdk-alpine as builder
WORKDIR /online-book-store
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} online-book-store.jar
RUN java -Djarmode=layertools -jar online-book-store.jar extract

# Final stage
FROM openjdk:17-jdk-alpine
WORKDIR /online-book-store
COPY --from=builder online-book-store/dependencies/ ./
COPY --from=builder online-book-store/spring-boot-loader/ ./
COPY --from=builder online-book-store/snapshot-dependencies/ ./
COPY --from=builder online-book-store/application/ ./
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]
EXPOSE 8080
