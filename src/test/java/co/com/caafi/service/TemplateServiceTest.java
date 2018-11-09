package co.com.caafi.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.anyString;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.junit4.SpringRunner;

import co.com.caafi.model.template.Template;
import co.com.caafi.repository.TemplateRepository;

@RunWith(SpringRunner.class)
@Import(TemplateService.class)
public class TemplateServiceTest {
    @Autowired
    TemplateService templateService;
    @MockBean
    TemplateRepository templateRepository;

    /*
    @Test
    public void findByNameTest() {
        Template tem = new Template();
        tem.setName("form1");
        tem.setId("dklsfjpoa");
        List<Template> list = new ArrayList<>(Arrays.asList(tem));
        given(templateRepository.findByName(anyString())).willReturn(list);
        Template result = templateService.findByName("hola");
        assertEquals("form1", result.getName());
        assertEquals("dklsfjpoa", result.getId());
    }

    @Test
    public void findAllTest() {
        Template tem = new Template();
        tem.setName("form1");
        tem.setId("dklsfjpoa");
        List<Template> list = new ArrayList<>(Arrays.asList(tem));
        given(templateRepository.findAll()).willReturn(list);
        assertEquals(1, templateService.findAll().size());
    }
    */

}
