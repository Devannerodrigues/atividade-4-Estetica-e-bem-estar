
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ServicoAdmin {
  id: number;
  nome: string;
  descricao: string;
  duracao: number;
  preco: number;
  ativo: boolean;
}

@Component({
  selector: 'app-servicos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './servicos-admin.html',
  styleUrl: './servicos-admin.css'
})
export class ServicosAdmin {
  servicos: ServicoAdmin[] = [
    {
      id: 1,
      nome: 'Limpeza de Pele',
      descricao: 'Limpeza profunda para remover impurezas e cuidar da pele.',
      duracao: 60,
      preco: 80,
      ativo: true
    },
    {
      id: 2,
      nome: 'Hidratação Facial',
      descricao: 'Tratamento para hidratar e revitalizar a pele.',
      duracao: 45,
      preco: 65,
      ativo: true
    },
    {
      id: 3,
      nome: 'Massagem Relaxante',
      descricao: 'Massagem para promover relaxamento e bem-estar.',
      duracao: 60,
      preco: 100,
      ativo: true
    }
  ];

  formularioAberto = false;
  modoEdicao = false;
  mensagem = '';
  proximoId = 4;

  servicoAtual: ServicoAdmin = this.novoServico();

  private novoServico(): ServicoAdmin {
    return {
      id: 0,
      nome: '',
      descricao: '',
      duracao: 60,
      preco: 0,
      ativo: true
    };
  }

  abrirCadastro(): void {
    this.servicoAtual = this.novoServico();
    this.modoEdicao = false;
    this.formularioAberto = true;
    this.mensagem = '';
  }

  editarServico(servico: ServicoAdmin): void {
    this.servicoAtual = { ...servico };
    this.modoEdicao = true;
    this.formularioAberto = true;
    this.mensagem = '';
  }

  salvarServico(): void {
    if (
      !this.servicoAtual.nome.trim() ||
      this.servicoAtual.duracao <= 0 ||
      this.servicoAtual.preco <= 0
    ) {
      this.mensagem = 'Preencha o nome e informe duração e preço maiores que zero.';
      return;
    }

    if (this.modoEdicao) {
      const indice = this.servicos.findIndex(
        servico => servico.id === this.servicoAtual.id
      );

      if (indice !== -1) {
        this.servicos[indice] = { ...this.servicoAtual };
      }

      this.mensagem = 'Serviço atualizado com sucesso.';
    } else {
      this.servicos.push({
        ...this.servicoAtual,
        id: this.proximoId++
      });

      this.mensagem = 'Serviço cadastrado com sucesso.';
    }

    this.formularioAberto = false;
    this.servicoAtual = this.novoServico();
  }

  cancelar(): void {
    this.formularioAberto = false;
    this.servicoAtual = this.novoServico();
    this.mensagem = '';
  }
}
