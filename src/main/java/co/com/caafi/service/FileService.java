package co.com.caafi.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {
	
	public static final String UPLOAD_FILE_SERVER = "/mnt/datos_caafi/";
	private final Path rootLocation;

    @Autowired
    public FileService() {
        this.rootLocation = Paths.get(UPLOAD_FILE_SERVER);
    }

	public String save(MultipartFile file) {
		String filename = StringUtils.cleanPath(file.getOriginalFilename() + ".pdf");
        try {
            if (!file.isEmpty() && !filename.contains("..")) {
            		Files.copy(file.getInputStream(), this.rootLocation.resolve(filename), 
            				StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file " + filename, e);
        }
        return filename;
	}

}
