package co.com.caafi.repository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Repository;

import co.com.caafi.model.MARESStudent;
import co.com.caafi.model.Role;
import co.com.caafi.model.SIPEEmployee;
import co.com.caafi.model.User;
import co.edu.udea.exception.OrgSistemasSecurityException;
import co.edu.udea.wsClient.OrgSistemasWebServiceClient;

@Repository
@PropertySource("classpath:udea.properties")
@Profile("pdn")
public class UserRepositoryImpl implements UserRepository {

	@Value("${TOKEN_PDN}")
	String token;
	@Value("${CLAVE_PUBLICA}")
	String publicKey;
	@Value("${SERVICIO_VALIDAR_USUARIO}")
	String serviceName;
	@Value("${SERVICIO_SIPE}")
	String serviceNameSipe;
	@Value("${SIPE_PARM_CC}")
	String paramSipeCC;
	@Value("${MARES_PARM_CC}")
	String paramMARESCC;
	@Value("${SERVICIO_MARES}")
	String serviceNameMares;
	@Autowired
	public JavaMailSender emailSender;

	public User getUser(String name, String password) {
		try {
			String doc;
			User user = null;
			OrgSistemasWebServiceClient wsClient;

			wsClient = new OrgSistemasWebServiceClient(publicKey);
			wsClient.addParam("usuario", name);
			wsClient.addParam("clave", password);
			doc = wsClient.obtenerString(serviceName, token).trim();

			// consulta empleado SIPE
			List<SIPEEmployee> employeeList;
			wsClient.addParam(paramSipeCC, doc);
			employeeList = wsClient.obtenerBean(serviceNameSipe, token, SIPEEmployee.class);
			int lastRecordIndex = employeeList.size() - 1;
			if (!employeeList.isEmpty() && employeeList.get(lastRecordIndex) != null) {
				SIPEEmployee employee = (SIPEEmployee) employeeList.get(lastRecordIndex);
				user = new User();
				user.setPass(password);
				user.setName(employee.getNombre());
				user.setUserName(name);
				user.setDocument(doc);
				user.setRole(Role.EMPLOYEE);
				return user;
			}
			//
			// // consulta estudiante Mares
			wsClient.addParam(paramMARESCC, doc);
			List<MARESStudent> studentList;
			studentList = wsClient.obtenerBean(serviceNameMares, token, MARESStudent.class);
			lastRecordIndex = studentList.size() - 1;
			if (!studentList.isEmpty() && studentList.get(lastRecordIndex) != null) {
				MARESStudent student = (MARESStudent) studentList.get(lastRecordIndex);
				user = new User();
				user.setPass(password);
				user.setName(student.getNombre());
				user.setUserName(name);
				user.setDocument(doc);
				user.setRole(Role.STUDENT);
			}
			return user;
		} catch (OrgSistemasSecurityException | Exception ex) {
			SimpleMailMessage message = new SimpleMailMessage();
			message.setTo("castroscarlos1@gmail.com");
			message.setSubject("Error Caafi");
			message.setText(ex.getMessage());
			emailSender.send(message);
			return null;
		}

	}

}
