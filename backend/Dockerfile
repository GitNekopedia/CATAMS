FROM eclipse-temurin:17-jdk-jammy AS base
WORKDIR /app
COPY target/*.jar app.jar
EXPOSE 9000
ENTRYPOINT ["java","-jar","/app/app.jar"]
