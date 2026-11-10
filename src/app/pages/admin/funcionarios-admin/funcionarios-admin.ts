
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  cargo: string;
  admissao: string;
  ativo: boolean;
}

@Component({
  selector: 'app-funcionarios-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './funcionarios-admin.html',
  styleUrl: './funcionarios-admin.css'
})
export class FuncionariosAdmin {

  pesquisa = '';
  filtro = 'todos';

  modalAberto = false;
  modoEdicao = false;

  mensagem = '';

  funcionarios: Funcionario[] = [
    {
      id: 1,
      nome: 'Maria Oliveira',
      cpf: '123.456.789-00',
      telefone: '(79) 99999-1111',
      email: 'maria@email.com',
      cargo: 'Esteticista',
      admissao: '2025-02-10',
      ativo: true
    },
    {
      id: 2,
      nome: 'Ana Santos',
      cpf: '987.654.321-00',
      telefone: '(79) 99999-2222',
      email: 'ana@email.com',
      cargo: 'Recepcionista',
      admissao: '2025-04-15',
      ativo: true
    },
    {
      id: 3,
      nome: 'Juliana Costa',
      cpf: '456.789.123-00',
      telefone: '(79) 99999-3333',
      email: 'juliana@email.com',
      cargo: 'Gerente',
      admissao: '2024-08-20',
      ativo: false
    }
  ];

  funcionarioAtual: Funcionario = this.novoFuncionario();

  novoFuncionario(): Funcionario {
    return {
      id: 0,
      nome: '',
      cpf: '',
      telefone: '',
      email: '',
      cargo: '',
      admissao: '',
      ativo: true
    };
  }

  get totalFuncionarios(): number {
    return this.funcionarios.length;
  }

  get ativos(): number {
    return this.funcionarios.filter(f => f.ativo).length;
  }

  get inativos(): number {
    return this.funcionarios.filter(f => !f.ativo).length;
  }

  get funcionariosFiltrados(): Funcionario[] {
    const termo = this.pesquisa.toLowerCase();

    return this.funcionarios.filter(f => {

      const correspondePesquisa =
        f.nome.toLowerCase().includes(termo) ||
        f.cpf.includes(termo) ||
        f.cargo.toLowerCase().includes(termo);

      const correspondeFiltro =
        this.filtro === 'todos' ||
        (this.filtro === 'ativos' && f.ativo) ||
        (this.filtro === 'inativos' && !f.ativo);

      return correspondePesquisa && correspondeFiltro;
    });
  }

  abrirCadastro(): void {
    this.modoEdicao = false;
    this.funcionarioAtual = this.novoFuncionario();
    this.mensagem = '';
    this.modalAberto = true;
  }

  editarFuncionario(funcionario: Funcionario): void {
    this.modoEdicao = true;
    this.funcionarioAtual = { ...funcionario };
    this.mensagem = '';
    this.modalAberto = true;
  }

  salvarFuncionario(): void {

    if (
      !this.funcionarioAtual.nome.trim() ||
      !this.funcionarioAtual.cpf.trim() ||
      !this.funcionarioAtual.telefone.trim() ||
      !this.funcionarioAtual.email.trim() ||
      !this.funcionarioAtual.cargo ||
      !this.funcionarioAtual.admissao
    ) {
      this.mensagem = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.modoEdicao) {

      const indice = this.funcionarios.findIndex(
        f => f.id === this.funcionarioAtual.id
      );

      if (indice !== -1) {
        this.funcionarios[indice] = {
          ...this.funcionarioAtual
        };
      }

    } else {

      this.funcionarioAtual.id =
        Math.max(0, ...this.funcionarios.map(f => f.id)) + 1;

      this.funcionarios.push({
        ...this.funcionarioAtual
      });
    }

    this.fecharModal();
  }

  alternarSituacao(funcionario: Funcionario): void {
    funcionario.ativo = !funcionario.ativo;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.mensagem = '';
  }
}
