
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css'
})
export class Pedidos implements OnInit {
  pedidos: any[] = [];
  emailCliente = '';
  erro = '';
  pedidoExpandido: number | null = null;

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    const clienteSalvo = sessionStorage.getItem(
      'estetica-cliente-logado'
    );

    if (!clienteSalvo) {
      this.erro = 'Faça login para consultar seus pedidos.';
      return;
    }

    try {
      const cliente = JSON.parse(clienteSalvo);
      this.emailCliente = (cliente.email || '').trim().toLowerCase();

      if (!this.emailCliente) {
        this.erro = 'Não foi possível identificar sua conta.';
        return;
      }

      const pedidosSalvos = JSON.parse(
        localStorage.getItem('estetica-pedidos-demo') || '[]'
      );

      if (!Array.isArray(pedidosSalvos)) {
        this.erro = 'Não foi possível carregar seus pedidos.';
        return;
      }

      this.pedidos = pedidosSalvos
        .filter((pedido: any) =>
          (pedido.cliente?.email || '').trim().toLowerCase() ===
          this.emailCliente
        )
        .sort((a: any, b: any) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );

    } catch {
      this.erro = 'Ocorreu um erro ao consultar seus pedidos.';
    }
  }

  alternarDetalhes(id: number): void {
    this.pedidoExpandido =
      this.pedidoExpandido === id ? null : id;
  }

  obterFormaPagamento(pedido: any): string {
    if (pedido.totalProdutos > 0) {
      return pedido.formaPagamentoProdutos === 'pix'
        ? 'Pix'
        : pedido.formaPagamentoProdutos === 'cartao'
          ? 'Cartão'
          : 'Não informado';
    }

    return pedido.pagamentoServicos || 'Presencial na clínica';
  }

  atualizarHistorico(): void {
    this.erro = '';
    this.carregarPedidos();
  }
}
