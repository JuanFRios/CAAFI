package co.com.caafi.rest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import co.com.caafi.service.FileService;

@RestController
@RequestMapping(path = "/rest/file")
public class FileResource {

	@Autowired
	private FileService fileService;
	
	@CrossOrigin(origins = "*")
	@RequestMapping(method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
	public String save(@RequestParam("file") MultipartFile file) {
		return fileService.save(file);
	}
	
	@RequestMapping(path = "/download", method = RequestMethod.GET)
	public ResponseEntity<Resource> download(@RequestParam("name") String name) throws IOException {
		File file = fileService.getFile(name);

	    InputStreamResource resource = new InputStreamResource(new FileInputStream(file));
	    
	    HttpHeaders headers = new HttpHeaders();
	    headers.add("Content-Disposition", String.format("inline; filename=\"" + file.getName() + "\""));
        headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
        headers.add("Pragma", "no-cache");
        headers.add("Expires", "0");
	    return ResponseEntity.ok()
	            .headers(headers)
	            .contentLength(file.length())
	            .contentType(MediaType.parseMediaType("application/octet-stream"))
	            .body(resource);
	}
}
