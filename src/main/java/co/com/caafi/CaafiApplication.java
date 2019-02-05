package co.com.caafi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CaafiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CaafiApplication.class, args);
	}
}
