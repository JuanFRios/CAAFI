FROM openjdk:8
ADD target/CAAFI.jar CAAFI.jar
EXPOSE 8091
ENTRYPOINT ["java","-Dspring.profiles.active=pdn", "-jar", "CAAFI.jar"]