import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl = 'http://localhost:8080/lancamentos';

  constructor(private http: HttpClient) { }

  pesquisar(): Promise<any> {
    const headers = new HttpHeaders().append('Authorization', 'Basic senhaBase64');
    return this.http.get(`${this.lancamentosUrl}?resumo`, { headers })
      .toPromise()
      .then(response => response['content']);
  }

}
