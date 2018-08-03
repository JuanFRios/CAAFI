package co.com.caafi.service.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.http.client.ClientHttpRequestFactory;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;

@Service
@PropertySource("classpath:udea-${spring.profiles.active}.properties")
public class RestService {
	
	@Autowired
	protected Environment env;
	
	protected ClientHttpRequestFactory getClientHttpRequestFactory(int timeout) {
	    HttpComponentsClientHttpRequestFactory clientHttpRequestFactory
	      = new HttpComponentsClientHttpRequestFactory();
	    clientHttpRequestFactory.setConnectTimeout(timeout);
	    return clientHttpRequestFactory;
	}

}
