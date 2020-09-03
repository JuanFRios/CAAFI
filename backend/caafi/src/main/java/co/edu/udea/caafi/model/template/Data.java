package co.edu.udea.caafi.model.template;

import co.edu.udea.caafi.model.facultad.Dependencia;
import co.edu.udea.caafi.model.facultad.Unidad;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

/**
 * Entidad para gestión de la data de las plantillas
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
public class Data {

  /** Identificador del dato */
  @Id
  private String id;

  /** Contenido de la data */
  private Object data;

  @DBRef
  private Template template;

  @DBRef
  private Unidad unidad;

  @CreatedBy
  private String createdBy;

  @CreatedDate
  private LocalDateTime createdDate;

  @LastModifiedBy
  private String lastModifiedBy;

  @LastModifiedDate
  private LocalDateTime lastModifiedDate;

  private String deletedBy;

  private LocalDateTime deletedDate;
}
