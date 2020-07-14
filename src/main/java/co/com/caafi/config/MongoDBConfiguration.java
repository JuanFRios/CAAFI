package co.com.caafi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.convert.DbRefResolver;
import org.springframework.data.mongodb.core.convert.DefaultDbRefResolver;
import org.springframework.data.mongodb.core.convert.MappingMongoConverter;
import org.springframework.data.mongodb.core.mapping.MongoMappingContext;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * Extra field json files configuration Created by Michael DESIGAUD on
 * 25/02/2016.
 */
@EnableMongoRepositories(basePackages = "co.com.caafi.repository")
@Configuration
public class MongoDBConfiguration {

  @Bean
  public MappingMongoConverter mongoConverter(MongoDbFactory mongoFactory, MongoMappingContext mongoMappingContext) {
    DbRefResolver dbRefResolver = new DefaultDbRefResolver(mongoFactory);
    MappingMongoConverter mongoConverter = new MappingMongoConverter(dbRefResolver, mongoMappingContext);
    mongoConverter.setMapKeyDotReplacement(".");

    return mongoConverter;
  }
}
