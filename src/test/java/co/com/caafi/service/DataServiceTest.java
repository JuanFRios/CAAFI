package co.com.caafi.service;

import static org.junit.Assert.assertEquals;
import static org.mockito.BDDMockito.given;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyString;

import java.util.ArrayList;
import java.util.Arrays;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.test.context.junit4.SpringRunner;

import co.com.caafi.model.template.FormData;
import co.com.caafi.repository.DataRepository;

@RunWith(SpringRunner.class)
@Import(DataService.class)
public class DataServiceTest {
    @Autowired
    DataService dataService;
    @MockBean
    DataRepository dataRepository;

    @MockBean
    MongoTemplate mongoTemplate;

    @Test
    public void findByIdTest() {
        FormData form = new FormData();
        form.setId("12345");
        form.setTemplate("form1");
        form.setData(new Object());
        given(dataRepository.findById(anyString())).willReturn(form);
        FormData result = dataService.findById("12345");
        assertEquals("form1", result.getTemplate());
        assertEquals("12345", result.getId());
    }

    @Test
    public void findAllTest() {
        FormData form = new FormData();
        form.setId("12345");
        form.setTemplate("form1");
        form.setData(new Object());
        given(dataRepository.findAll()).willReturn(new ArrayList<>(Arrays.asList(form)));
        assertEquals(1, dataService.findAll().size());
    }

    @Test
    public void findByTemplateTest() {
        FormData form = new FormData();
        form.setId("12345");
        form.setTemplate("form1");
        form.setData(new Object());
        given(dataRepository.findByTemplateAndOriginAndDeleted(anyString(), anyString(), false, any())).willReturn(new ArrayList<>(Arrays.asList(form)));
        assertEquals(1, dataService.findByTemplate("prueba", "prueba").size());
    }


}
