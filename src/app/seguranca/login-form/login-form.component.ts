import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  constructor(private auth: AuthService) { }
  teste: AuthService;

  ngOnInit(): void {
    this.teste = this.auth;
  }

  login(usuario: string, senha: string) {
    this.auth.login(usuario, senha);
  }

}
