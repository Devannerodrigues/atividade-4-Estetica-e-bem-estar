
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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
export class ProdutosAdmin {
  produtos: ProdutoAdmin[] = [
    {
      id: 1,
      nome: 'Hidratante Corporal',
      descricao: 'Hidratação e cuidado diário para a pele.',
      categoria: 'Cosméticos',
      preco: 49.90,
      unidade: 'Unidade'
    },
    {
      id: 2,
      nome: 'Sérum Facial',
      descricao: 'Produto para cuidados faciais.',
      categoria: 'Cosméticos',
      preco: 65.00,
      unidade: 'Unidade'
    }
  ];

  formularioAberto = false;
  modoEdicao = false;
  mensagem = '';
  proximoId = 3;

  produtoAtual: ProdutoAdmin = this.novoProduto();

  private novoProduto(): ProdutoAdmin {
    return {
      id: 0,
      nome: '',
      descricao: '',
      categoria: '',
      preco: 0,
      unidade: 'Unidade'
    };
  }

  abrirCadastro(): void {
    this.produtoAtual = this.novoProduto();
    this.modoEdicao = false;
    this.formularioAberto = true;
    this.mensagem = '';
  }

  editarProduto(produto: ProdutoAdmin): void {
    this.produtoAtual = { ...produto };
    this.modoEdicao = true;
    this.formularioAberto = true;
    this.mensagem = '';
  }

  salvarProduto(): void {
    if (
      !this.produtoAtual.nome.trim() ||
      !this.produtoAtual.categoria.trim() ||
      !this.produtoAtual.unidade.trim() ||
      this.produtoAtual.preco <= 0
    ) {
      this.mensagem = 'Preencha os campos obrigatórios e informe um preço maior que zero.';
      return;
    }

    if (this.modoEdicao) {
      const indice = this.produtos.findIndex(
        produto => produto.id === this.produtoAtual.id
      );

      if (indice !== -1) {
        this.produtos[indice] = { ...this.produtoAtual };
      }

      this.mensagem = 'Produto atualizado com sucesso.';
    } else {
      this.produtos.push({
        ...this.produtoAtual,
        id: this.proximoId++
      });

      this.mensagem = 'Produto cadastrado com sucesso.';
    }

    this.formularioAberto = false;
    this.produtoAtual = this.novoProduto();
  }

  cancelar(): void {
    this.formularioAberto = false;
    this.produtoAtual = this.novoProduto();
    this.mensagem = '';
  }
}
