
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { ServicoService, ServicoApi } from '../../../services/servico';

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
export class ServicosAdmin implements OnInit {

  servicos: ServicoAdmin[] = [];

  formularioAberto = false;
  modoEdicao = false;
  mensagem = '';

  carregando = false;
  salvando = false;

  servicoAtual: ServicoAdmin = this.novoServico();

  constructor(private servicoService: ServicoService) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

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

  carregarServicos(): void {
    this.carregando = true;

    this.servicoService.listar().subscribe({
      next: (dados: ServicoApi[]) => {
        this.servicos = dados.map(item => ({
          id: item.id,
          nome: item.nome,
          descricao: item.descricao,
          duracao: item.duracaoMinutos,
          preco: item.preco,
          ativo: item.ativo
        }));

        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar serviços:', erro);

        this.mensagem =
          erro.error?.mensagem ||
          'Não foi possível carregar os serviços. Verifique a API.';

        this.carregando = false;
      }
    });
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
      this.servicoAtual.nome.trim().length > 40 ||
      this.servicoAtual.duracao <= 0 ||
      this.servicoAtual.preco <= 0
    ) {
      this.mensagem =
        'Informe nome com até 40 caracteres, duração e preço maiores que zero.';
      return;
    }

    const dados = {
      nome: this.servicoAtual.nome.trim(),
      descricao: this.servicoAtual.descricao,
      duracaoMinutos: this.servicoAtual.duracao,
      preco: this.servicoAtual.preco,
      ativo: this.servicoAtual.ativo
    };

    this.salvando = true;
    this.mensagem = '';

    if (this.modoEdicao) {
      this.servicoService
        .atualizar(this.servicoAtual.id, dados)
        .subscribe({
          next: () => {
            this.finalizarSalvamento('Serviço atualizado com sucesso!');
          },
          error: (erro) => this.tratarErro(erro)
        });
    } else {
      this.servicoService.cadastrar(dados).subscribe({
        next: () => {
          this.finalizarSalvamento('Serviço cadastrado com sucesso!');
        },
        error: (erro) => this.tratarErro(erro)
      });
    }
  }

  private finalizarSalvamento(mensagem: string): void {
    this.salvando = false;
    this.formularioAberto = false;
    this.servicoAtual = this.novoServico();
    this.mensagem = mensagem;

    this.carregarServicos();
  }

  private tratarErro(erro: any): void {
    console.error('Erro ao salvar serviço:', erro);

    this.salvando = false;

    this.mensagem =
      erro.error?.mensagem ||
      erro.error?.title ||
      'Erro ao salvar serviço. Confira a conexão com o Back-end.';
  }

  cancelar(): void {
    this.formularioAberto = false;
    this.servicoAtual = this.novoServico();
    this.mensagem = '';
  }
}
