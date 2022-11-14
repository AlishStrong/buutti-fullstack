FROM maven:3.8.6-ibmjava-8

WORKDIR /backend
COPY . .
RUN mvn clean install

CMD mvn spring-boot:run
