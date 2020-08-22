package co.edu.udea.caafi.model.user.sipe;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * The Data Transfer Object for SIPE employee's entities.
 *
 * @author Diego Rendón
 */
@Getter
@Setter
@NoArgsConstructor
@Accessors(chain = true)
@XmlRootElement
public class DependenciaSIPE {
  // Variable names should be in spanish to match the Web Service response
  // from OrgSistemasWebServiceClient.
  private String codigoDependencia;
  private String nombreDependencia;
  private String codigoCentroCosto;
  private String nombreCentroCosto;
}
