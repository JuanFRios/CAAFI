FROM openjdk:8
ADD target/CAAFI.jar CAAFI.jar
EXPOSE 8091
ENTRYPOINT ["java","-Dspring.profiles.active=dev", "-jar", "CAAFI.jar"]