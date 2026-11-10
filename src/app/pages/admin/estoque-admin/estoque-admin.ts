
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ProdutoEstoque {
  id: number;
  nome: string;
  codigo: string;
  quantidade: number;
  minimo: number;
  categoria: string;
}

@Component({
  selector: 'app-estoque-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './estoque-admin.html',
  styleUrl: './estoque-admin.css'
})
export class EstoqueAdmin {

  pesquisa = '';
  filtro = 'todos';

  produtos: ProdutoEstoque[] = [
    {
      id: 1,
      nome: 'Hidratante Corporal',
      codigo: 'PROD001',
      quantidade: 15,
      minimo: 5,
      categoria: 'Corporal'
    },
    {
      id: 2,
      nome: 'Sérum Facial',
      codigo: 'PROD002',
      quantidade: 2,
      minimo: 5,
      categoria: 'Facial'
    },
    {
      id: 3,
      nome: 'Sabonete Facial',
      codigo: 'PROD003',
      quantidade: 0,
      minimo: 5,
      categoria: 'Facial'
    },
    {
      id: 4,
      nome: 'Protetor Solar',
      codigo: 'PROD004',
      quantidade: 12,
      minimo: 5,
      categoria: 'Facial'
    },
    {
      id: 5,
      nome: 'Óleo Corporal',
      codigo: 'PROD005',
      quantidade: 4,
      minimo: 5,
      categoria: 'Corporal'
    }
  ];

  modalAberto = false;
  tipoMovimentacao: 'entrada' | 'saida' = 'entrada';
  produtoSelecionado: ProdutoEstoque | null = null;
  quantidadeMovimentacao = 1;
  mensagem = '';

  get totalProdutos(): number {
    return this.produtos.length;
  }

  get estoqueBaixo(): number {
    return this.produtos.filter(
      p => p.quantidade > 0 && p.quantidade <= p.minimo
    ).length;
  }

  get esgotados(): number {
    return this.produtos.filter(p => p.quantidade === 0).length;
  }

  get produtosFiltrados(): ProdutoEstoque[] {
    return this.produtos.filter(produto => {

      const termo = this.pesquisa.toLowerCase();

      const correspondePesquisa =
        produto.nome.toLowerCase().includes(termo) ||
        produto.codigo.toLowerCase().includes(termo) ||
        produto.categoria.toLowerCase().includes(termo);

      const correspondeFiltro =
        this.filtro === 'todos' ||
        (this.filtro === 'baixo' &&
          produto.quantidade > 0 &&
          produto.quantidade <= produto.minimo) ||
        (this.filtro === 'esgotado' &&
          produto.quantidade === 0) ||
        (this.filtro === 'disponivel' &&
          produto.quantidade > produto.minimo);

      return correspondePesquisa && correspondeFiltro;
    });
  }

  obterSituacao(produto: ProdutoEstoque): string {
    if (produto.quantidade === 0) {
      return 'Esgotado';
    }

    if (produto.quantidade <= produto.minimo) {
      return 'Estoque baixo';
    }

    return 'Disponível';
  }

  abrirMovimentacao(
    produto: ProdutoEstoque,
    tipo: 'entrada' | 'saida'
  ): void {
    this.produtoSelecionado = produto;
    this.tipoMovimentacao = tipo;
    this.quantidadeMovimentacao = 1;
    this.mensagem = '';
    this.modalAberto = true;
  }

  fecharModal(): void {
    this.modalAberto = false;
    this.produtoSelecionado = null;
    this.mensagem = '';
  }

  confirmarMovimentacao(): void {

    if (!this.produtoSelecionado) {
      return;
    }

    if (
      this.quantidadeMovimentacao <= 0 ||
      !Number.isInteger(Number(this.quantidadeMovimentacao))
    ) {
      this.mensagem = 'Informe uma quantidade inteira válida.';
      return;
    }

    if (
      this.tipoMovimentacao === 'saida' &&
      this.quantidadeMovimentacao > this.produtoSelecionado.quantidade
    ) {
      this.mensagem = 'Quantidade insuficiente no estoque.';
      return;
    }

    if (this.tipoMovimentacao === 'entrada') {
      this.produtoSelecionado.quantidade +=
        Number(this.quantidadeMovimentacao);
    } else {
      this.produtoSelecionado.quantidade -=
        Number(this.quantidadeMovimentacao);
    }

    this.fecharModal();
  }
}
