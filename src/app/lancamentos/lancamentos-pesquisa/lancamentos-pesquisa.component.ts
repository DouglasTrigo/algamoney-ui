import { AuthService } from './../../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table/table';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from './../lancamento.service';

@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css']
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos = [];
  //Aqui estou referenciando a tabela do HTML através da marcação #tabela
  @ViewChild('tabela', {static: true}) grid: Table;

  constructor(private lancamentoService: LancamentoService,
              private messageService: MessageService,
              private confirmation: ConfirmationService,
              private errorHandler: ErrorHandlerService,
              private title: Title,
              public auth: AuthService
              ){ }

  ngOnInit(): void {
    /* this.pesquisar(); Não precisa mais desta pesquisa aqui,
    pois ao iniciar o componente, a table do primeNg já
    chama o método aoMudarPagina*/
    this.title.setTitle('Pesquisa de lançamentos');
  }

  pesquisar(pagina = 0){
    this.filtro.pagina = pagina;
    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent){
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any){
    this.lancamentoService.excluir(lancamento.codigo)
    .then(() => {
      /*Neste ponto eu chamo o método reset(), ao fazer isso,
      ele vai voltar para a primeira página e em seguida
      disparar a pesquisa*/
      this.grid.reset();
      this.messageService.add({severity:'success', detail:'Lançamento excluído com sucesso!'});
    })
    .catch(erro => this.errorHandler.handle(erro));
  }
}
