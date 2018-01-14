import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  NavigationExtras
} from '@angular/router';
import { LoginData } from '../../common/loginData';
import { Location } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { ERRORES_FORMULARIOS, MENSAJES_VALIDACION } from './validacion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  formIncioSesion: FormGroup;
  nombre_usuario: string;
  clave: string;
  erroresFormulario = ERRORES_FORMULARIOS;
  mensajesValidacion = MENSAJES_VALIDACION;
  errMess: string;
  cargando = false;
  data:LoginData;

  constructor(private loginService: LoginService,
   private location: Location,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public router: Router) {
    this.crearFormulario();}

  ngOnInit() {
  }


 crearFormulario(): void {
    this.formIncioSesion = this.fb.group({
      nombre_usuario: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      clave: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    });

    this.formIncioSesion.valueChanges
      .subscribe(data => this.onValueChanged(data));

    this.onValueChanged();
  }

  /**
   * Método encargado de validar si el valor ingresado a un input
   * contiene errores.
   * El ? indica que el parámetro es opcional
   * @param data : opcional
   */
  onValueChanged(data?: any) {
    // Si el formulario no ha sido creado retorna nada
    if (!this.formIncioSesion) { return; }
    const form = this.formIncioSesion;

    // tslint:disable-next-line:forin
    for (const campo in this.erroresFormulario) {
      // Nos encargamos de resetear el error para volver a identificar si hay
      this.erroresFormulario[campo] = '';
      // Obtenemos el input del formulario por el nombre
      const control = form.get(campo);
      // Si control no es null, hubo cambios y no es valido
      if (control && control.dirty && !control.valid) {
        // Buscamos los mensajes de error para el input
        const messages = this.mensajesValidacion[campo];
        // recorremos el arreglo de errores del input
        // tslint:disable-next-line:forin
        for (const key in control.errors) {
          // Se concatenan los mensajes de errores
          this.erroresFormulario[campo] += messages[key] + ' ';

        }
      }
    }

  }

  onSubmit() {
    this.cargando = true;
 this.nombre_usuario = this.formIncioSesion.get('nombre_usuario').value;
    this.clave = this.formIncioSesion.get('clave').value;
    
    console.log(this.nombre_usuario);
   this.data= new LoginData("admin","123455");
   
   console.log(this.data);
    this.loginService.login(this.data)
      .subscribe(usuario => {
        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default

        // Set our navigation extras object
        // that passes on our global query params and fragment
        let navigationExtras: NavigationExtras = {
          queryParamsHandling: 'preserve',
          preserveFragment: true
        };

        // Redirect the user
        this.router.navigate(["/formularios"], navigationExtras);
      }, error => {
        if (error.codigoError = 404) {
          this.errMess = "Usuario o contraseña inválidos.";
        }
        // Volvemos el formulario a su estado original
        this.formIncioSesion.reset();
        this.cargando = false;
      });

  }


}
