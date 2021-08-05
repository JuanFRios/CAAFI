FROM maven:3.6.3-openjdk-11 AS build
COPY src /home/app/src
COPY pom.xml /home/app
COPY src/main/webapp/WEB-INF/lib /home/app/local-libs
ENV JAR_HOME /home/app/local-libs
RUN mvn -f /home/app/pom.xml clean install


FROM openjdk:14
ADD target/caafi-0.0.1-SNAPSHOT.jar caafi-0.0.1-SNAPSHOT.jar
EXPOSE 9004
ENTRYPOINT ["java","-Dspring.profiles.active=pdn", "-jar", "caafi-0.0.1-SNAPSHOT.jar"]