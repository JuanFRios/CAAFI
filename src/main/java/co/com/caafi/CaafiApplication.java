package co.com.caafi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import co.com.caafi.config.FileStorageProperties;

@SpringBootApplication
@EnableScheduling
@EnableConfigurationProperties({
    FileStorageProperties.class
})
public class CaafiApplication {

	public static void main(String[] args) {
		SpringApplication.run(CaafiApplication.class, args);
	}
}
