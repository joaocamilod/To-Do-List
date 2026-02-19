FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw ./

RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

COPY src ./src
RUN ./mvnw package -DskipTests -q

FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

RUN addgroup -S todogroup && adduser -S todouser -G todogroup
USER todouser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-jar", "app.jar"]
