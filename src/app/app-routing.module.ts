import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './core/pagina-nao-encontrada.component';

const routes: Routes = [
  /*Com a propriedade abaixo, eu digo que se não for colocado nada
  na url, é para ir para a página de lançamentos.*/
  { path: '', redirectTo: 'lancamentos', pathMatch: 'full'},
  { path: 'pagina-nao-encontrada', component: PaginaNaoEncontradaComponent},
  /*Abaixo qualquer rota não mapeada será direcionada para página
  não encontrada*/
  { path: '**', redirectTo: 'pagina-nao-encontrada'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
