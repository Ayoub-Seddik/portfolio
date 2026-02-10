# Multi-stage build for Spring Boot (Gradle)
FROM gradle:8.14-jdk17 AS build
WORKDIR /app

# Copy Gradle files first for caching
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
RUN gradle dependencies --no-daemon

# Copy source
COPY src ./src

# Build bootJar
RUN gradle bootJar --no-daemon

# Runtime stage (NOT alpine)
FROM eclipse-temurin:17-jre
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
