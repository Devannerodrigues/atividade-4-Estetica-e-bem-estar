
import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Produtos } from './pages/produtos/produtos';
import { Servicos } from './pages/servicos/servicos';
import { Contato } from './pages/contato/contato';
import { Carrinho } from './pages/carrinho/carrinho';
import { Cadastro } from './pages/cliente/cadastro/cadastro';
import { Login as ClienteLogin } from './pages/cliente/login/login';
import { AgendamentoComponent } from './pages/agendamento/agendamento';

import { Login } from './pages/admin/login/login';
import { Dashboard } from './pages/admin/dashboard/dashboard';
import { ProdutosAdmin } from './pages/admin/produtos-admin/produtos-admin';
import { ServicosAdmin } from './pages/admin/servicos-admin/servicos-admin';

export const routes: Routes = [
  // Páginas públicas
  { path: '', component: Inicio },
  { path: 'produtos', component: Produtos },
  { path: 'servicos', component: Servicos },
  { path: 'contato', component: Contato },
  { path: 'carrinho', component: Carrinho },
  { path: 'cliente/cadastro', component: Cadastro },
{ path: 'cliente/login', component: ClienteLogin },
{ path: 'agendamento', component: AgendamentoComponent },

  // Área administrativa
  { path: 'admin', redirectTo: 'admin/login', pathMatch: 'full' },
  { path: 'admin/login', component: Login },
  { path: 'admin/dashboard', component: Dashboard },
  { path: 'admin/produtos', component: ProdutosAdmin },
  { path: 'admin/servicos', component: ServicosAdmin },

  // Página não encontrada
  { path: '**', redirectTo: '' }
];
