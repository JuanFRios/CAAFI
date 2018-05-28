package co.com.caafi.service;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;

import java.util.Arrays;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import co.com.caafi.model.Config;
import co.com.caafi.model.ConfigTemplate;
import co.com.caafi.model.Dependency;
import co.com.caafi.model.Form;
import co.com.caafi.model.User;
import co.com.caafi.repository.ConfigRepository;
import co.com.caafi.repository.ConfigTemplateRepository;

@RunWith(SpringRunner.class)
@Import(ConfigService.class)
public class ConfigServiceTest {
    @Autowired
    ConfigService configService;
    @MockBean
    private ConfigRepository configRepository;
    @MockBean
    private ConfigTemplateRepository configTemplateRepository;

    @Test
    public void findByNameTest() {
        Config tem = new Config();
        tem.setName("form1");
        tem.setId("dklsfjpoa");
        tem.setValue(new Object());
        given(configRepository.findByName(anyString())).willReturn(tem);
        Config result = configService.findByName("hola");
        assertEquals("form1", result.getName());
        assertEquals("dklsfjpoa", result.getId());
        assertNotNull(result.getValue());
    }

    @Test
    public void findTemplateConfigByRolTest() {

        User user = new User();
        user.setRole(Arrays.asList("admin"));
        ConfigTemplate tem = new ConfigTemplate();
        tem.setName("form1");
        tem.setId("dklsfjpoa");
        Form form1 = new Form();
        form1.setRole(Arrays.asList("admin", "super"));
        form1.setName("tiene permisos admin");
        Form form2 = new Form();
        form2.setRole(Arrays.asList("student"));

        Dependency dep1 = new Dependency();
        dep1.setRole(Arrays.asList("admin", "super"));
        dep1.setName("tiene permisos admin");
        dep1.setForms(Arrays.asList(form1, form2));
        Dependency dep2 = new Dependency();
        dep2.setRole(Arrays.asList("student"));

        tem.setValue(Arrays.asList(dep1, dep2));

        given(configTemplateRepository.findByName(anyString())).willReturn(tem);
        ConfigTemplate result = configService.findTemplateConfigByRol(user, "hola");
        assertEquals(1, result.getValue().size());
        assertEquals("tiene permisos admin", result.getValue().get(0).getName());
        assertEquals(1, result.getValue().get(0).getForms().size());
        assertEquals("tiene permisos admin", result.getValue().get(0).getForms().get(0).getName());
    }

}
