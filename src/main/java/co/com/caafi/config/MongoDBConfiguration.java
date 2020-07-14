package co.com.caafi.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Extra field json files configuration Created by Michael DESIGAUD on
 * 25/02/2016.
 */
@EnableMongoRepositories(basePackages = "co.com.caafi.repository")
@Configuration
public class MongoDBConfiguration {
}
