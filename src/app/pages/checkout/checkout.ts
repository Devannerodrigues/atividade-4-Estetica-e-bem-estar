
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  CarrinhoService,
  ItemCarrinho
} from '../../services/carrinho.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  itens: ItemCarrinho[] = [];

  nome = '';
  email = '';
  telefone = '';
  endereco = '';
  numero = '';
  complemento = '';
  bairro = '';
  cidade = '';
  cep = '';

  formaPagamento = 'pix';

  erro = '';
  pedidoConcluido = false;
  numeroPedido = '';

  constructor(
    public carrinho: CarrinhoService,
    private router: Router
  ) {
    this.itens = this.carrinho.obterItens();

    const clienteSalvo = sessionStorage.getItem(
      'estetica-cliente-logado'
    );

    if (clienteSalvo) {
      try {
        const cliente = JSON.parse(clienteSalvo);
        this.nome = cliente.nome || '';
        this.email = cliente.email || '';
        this.telefone = cliente.telefone || '';
      } catch {
        console.error('Não foi possível carregar os dados do cliente.');
      }
    }
  }

  get produtos(): ItemCarrinho[] {
    return this.itens.filter(
      item => (item.tipo || 'produto') === 'produto'
    );
  }

  get servicos(): ItemCarrinho[] {
    return this.itens.filter(
      item => item.tipo === 'servico'
    );
  }

  get totalProdutos(): number {
    return this.produtos.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  }

  get totalServicos(): number {
    return this.servicos.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  }

  get totalGeral(): number {
    return this.totalProdutos + this.totalServicos;
  }

  finalizarPedido(): void {
    this.erro = '';

    if (this.itens.length === 0) {
      this.erro = 'Seu carrinho está vazio.';
      return;
    }

    if (
      !this.nome.trim() ||
      !this.email.trim() ||
      !this.telefone.trim()
    ) {
      this.erro = 'Preencha seus dados pessoais.';
      return;
    }

    if (this.produtos.length > 0) {
      if (
        !this.endereco.trim() ||
        !this.numero.trim() ||
        !this.bairro.trim() ||
        !this.cidade.trim() ||
        !this.cep.trim()
      ) {
        this.erro = 'Preencha todos os dados de entrega.';
        return;
      }
    }

    if (
      this.produtos.length > 0 &&
      !['pix', 'cartao'].includes(this.formaPagamento)
    ) {
      this.erro = 'Selecione uma forma de pagamento.';
      return;
    }

    try {
      const pedidos = JSON.parse(
        localStorage.getItem('estetica-pedidos-demo') || '[]'
      );

      const novoPedido = {
        id: Date.now(),
        cliente: {
          nome: this.nome.trim(),
          email: this.email.trim(),
          telefone: this.telefone.trim()
        },
        endereco: {
          endereco: this.endereco,
          numero: this.numero,
          complemento: this.complemento,
          bairro: this.bairro,
          cidade: this.cidade,
          cep: this.cep
        },
        itens: this.itens,
        totalProdutos: this.totalProdutos,
        totalServicos: this.totalServicos,
        total: this.totalGeral,
        formaPagamentoProdutos:
          this.produtos.length > 0 ? this.formaPagamento : null,
        pagamentoServicos: 'Presencial na clínica',
        status: 'Pendente',
        data: new Date().toISOString()
      };

      pedidos.push(novoPedido);

      localStorage.setItem(
        'estetica-pedidos-demo',
        JSON.stringify(pedidos)
      );

      this.numeroPedido = String(novoPedido.id);
      this.carrinho.limpar();
      this.itens = [];
      this.pedidoConcluido = true;

    } catch {
      this.erro = 'Não foi possível registrar o pedido.';
    }
  }

  voltarInicio(): void {
    this.router.navigate(['/']);
  }
}
