import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  oauthTokenUrl = 'http://localhost:8080/oauth/token';
  jwtPayload: any;

  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService
    ) {
      this.carregarToken();
    }

  login(usuario: string, senha: string): Promise<void> {

    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAYW5ndWxAcjA=');

    const body = `username=${usuario}&password=${senha}&grant_type=password`;

    return this.http.post(this.oauthTokenUrl, body,
        { headers , withCredentials: true /*Com esta opção como true,
        estou dizendo que quero armazenar os Cookies.
        No caso o refresh_token vem no Cookie, por isso
        eu preciso sinalizar para ele armazenar.*/})
      .toPromise()
      .then(response => {
        this.amazenarToken(response['access_token']);
      })
      .catch(response => {
        const responseError = response.error;
        if (response.status === 400
            && responseError.error === 'invalid_grant') {
              return Promise.reject('Usuário ou senha inválida');
        }
        return Promise.reject(response);
      });
  }

  obterNovoAccessToken(): Promise<void> {
    const headers = new HttpHeaders()
      .append('Content-Type', 'application/x-www-form-urlencoded')
      .append('Authorization', 'Basic YW5ndWxhcjpAYW5ndWxAcjA=');

    const body = 'grant_type=refresh_token';

    return this.http.post(this.oauthTokenUrl, body,
        { headers , withCredentials: true})
      .toPromise()
      .then(response => {
        this.amazenarToken(response['access_token']);
        console.log('Novo access token criado!');
        return Promise.resolve(null);
      })
      .catch(erro => {
        console.log('Erro ao renovar token.', erro);
        return Promise.resolve(null);
      });
  }

  temPermissao(permissao: string) {
    return this.jwtPayload && this.jwtPayload.authorities.includes(permissao);
  }

  isAccessTokenInvalido() {
    const token = localStorage.getItem('token');
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  private amazenarToken(token: string) {
    this.jwtPayload = this.jwtHelper.decodeToken(token);
    localStorage.setItem('token', token);
  }

  private carregarToken() {
    const token = localStorage.getItem('token');

    if (token) {
      this.amazenarToken(token);
    }
  }
}
