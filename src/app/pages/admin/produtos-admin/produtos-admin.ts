
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProdutoService } from '../../../services/produto';

interface ProdutoAdmin {
  id: number;
  nome: string;
  descricao: string;
  categoria: string;
  preco: number;
  unidade: string;
}

@Component({
  selector: 'app-produtos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './produtos-admin.html',
  styleUrl: './produtos-admin.css'
})
export class ProdutosAdmin implements OnInit {

  produtos: ProdutoAdmin[] = [];

  formularioAberto = false;
  modoEdicao = false;
  mensagem = '';
  carregando = false;
  salvando = false;

  produtoAtual: ProdutoAdmin = this.novoProduto();

  constructor(
    private produtoService: ProdutoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  // PRODUTO VAZIO
  private novoProduto(): ProdutoAdmin {
    return {
      id: 0,
      nome: '',
      descricao: '',
      categoria: 'Cosméticos',
      preco: 0,
      unidade: 'Unidade'
    };
  }

  // LISTAR PRODUTOS DO BANCO
  carregarProdutos(): void {
    this.carregando = true;
    this.mensagem = '';

    this.produtoService.listar().subscribe({
      next: (dados: any[]) => {

        this.produtos = dados.map(p => ({
          id: p.iditem ?? p.Iditem,
          nome:
            p.iditemNavigation?.item1 ??
            p.IditemNavigation?.Item1 ??
            'Produto sem nome',
          descricao:
            p.iditemNavigation?.descricaoItem ??
            p.IditemNavigation?.DescricaoItem ??
            '',
          categoria: 'Cosméticos',
          preco: Number(p.precoVenda ?? p.PrecoVenda ?? 0),
          unidade: p.unidade ?? p.Unidade ?? 'UN'
        }));

        this.carregando = false;
      },

      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);
        this.mensagem = 'Não foi possível carregar os produtos.';
        this.carregando = false;
      }
    });
  }

  // ABRIR CADASTRO
  abrirCadastro(): void {
    this.produtoAtual = this.novoProduto();
    this.modoEdicao = false;
    this.formularioAberto = true;
    this.mensagem = '';
  }

  // EDITAR PRODUTO
  editarProduto(produto: ProdutoAdmin): void {
    this.produtoAtual = { ...produto };
    this.modoEdicao = true;
    this.formularioAberto = true;
    this.mensagem = '';
  }

  // MONTAR DADOS PARA O DTO DO BACKEND
  private montarDTO() {
    const unidade = this.produtoAtual.unidade === 'Unidade'
      ? 'UN'
      : this.produtoAtual.unidade;

    return {
      idCategoria: 1,
      item: this.produtoAtual.nome.trim(),
      descricaoItem: this.produtoAtual.descricao.trim(),
      preco: this.produtoAtual.preco,
      tipoItem: 'P',
      ativoProdutoServico: 'S',
      codigoPreco: 1,
      precoVenda: this.produtoAtual.preco,
      unidade: unidade
    };
  }

  // CADASTRAR OU ATUALIZAR
  salvarProduto(): void {

    if (
      !this.produtoAtual.nome.trim() ||
      !this.produtoAtual.descricao.trim() ||
      !this.produtoAtual.categoria.trim() ||
      !this.produtoAtual.unidade.trim() ||
      !Number.isFinite(this.produtoAtual.preco) ||
      this.produtoAtual.preco <= 0
    ) {
      this.mensagem = 'Preencha todos os campos e informe um preço válido.';
      return;
    }

    this.salvando = true;
    this.mensagem = '';

    const dados = this.montarDTO();

    if (this.modoEdicao) {

      this.produtoService.atualizar(
        this.produtoAtual.id,
        dados
      ).subscribe({

        next: () => {
          this.mensagem = 'Produto atualizado com sucesso!';
          this.finalizarOperacao();
        },

        error: (erro) => {
          console.error('Erro ao atualizar:', erro);
          this.mensagem = 'Não foi possível atualizar o produto.';
          this.salvando = false;
        }

      });

    } else {

      this.produtoService.cadastrar(dados).subscribe({

        next: () => {
          this.mensagem = 'Produto cadastrado com sucesso!';
          this.finalizarOperacao();
        },

        error: (erro) => {
          console.error('Erro ao cadastrar:', erro);
          this.mensagem =
            erro.error?.erro ??
            erro.error?.mensagem ??
            'Não foi possível cadastrar o produto.';
          this.salvando = false;
        }

      });

    }
  }

  // FINALIZAR OPERAÇÃO
  private finalizarOperacao(): void {
    this.salvando = false;
    this.formularioAberto = false;
    this.produtoAtual = this.novoProduto();
    this.carregarProdutos();
  }

  // CANCELAR
  cancelar(): void {
    this.formularioAberto = false;
    this.produtoAtual = this.novoProduto();
    this.mensagem = '';
  }

}
