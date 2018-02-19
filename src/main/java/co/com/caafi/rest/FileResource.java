package co.com.caafi.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
}
