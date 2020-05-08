import { AuthService } from './../../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table/table';
import { MessageService, ConfirmationService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService, PessoaFiltro } from './../pessoa.service';

@Component({
  selector: 'app-pessoas-pesquisa',
  templateUrl: './pessoas-pesquisa.component.html',
  styleUrls: ['./pessoas-pesquisa.component.css']
})
export class PessoasPesquisaComponent implements OnInit{

  totalRegistros = 0;
  filtro = new PessoaFiltro();
  pessoas = [];
  @ViewChild('tabelaPessoas', { static: true}) grid: Table;

  constructor(private pessoasService: PessoaService,
              private errorHandler: ErrorHandlerService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private title: Title,
              public auth: AuthService
              ){ }

  ngOnInit(): void {
    /* this.pesquisar(); Não precisa mais desta pesquisa aqui,
    pois ao iniciar o componente, a table do primeNg já
    chama o método aoMudarPagina*/
    this.title.setTitle('Pesquisa de pessoas');
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.pessoasService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.pessoas = resultado.pessoas;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent){
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(pessoa: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(pessoa);
      }
    });
  }

  excluir(pessoa: any) {
    this.pessoasService.excluir(pessoa.codigo)
      .then(response => {
        this.grid.reset();
        this.messageService.add({severity: 'success', detail: 'Pessoa excluída com sucesso!'});
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alterarStatus(pessoa: any) {
    const novoStatus = !pessoa.ativo;

    this.pessoasService.mudarStatus(pessoa.codigo, novoStatus)
      .then(response => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        pessoa.ativo = novoStatus;
        this.messageService.add({severity: 'success', detail: `Pessoa ${acao} com sucesso!`});
      })
      .catch(erro => this.errorHandler.handle(erro));
  }
}
