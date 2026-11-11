
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './pedidos-admin.html',
  styleUrl: './pedidos-admin.css'
})
export class PedidosAdmin implements OnInit {
  pedidos: any[] = [];
  filtroStatus = 'Todos';
  pedidoExpandido: number | null = null;
  mensagem = '';

  statusDisponiveis = [
    'Pendente',
    'Em preparação',
    'Enviado',
    'Concluído',
    'Cancelado'
  ];

  ngOnInit(): void {
    this.carregarPedidos();
  }

  carregarPedidos(): void {
    try {
      const dados = JSON.parse(
        localStorage.getItem('estetica-pedidos-demo') || '[]'
      );

      this.pedidos = Array.isArray(dados)
        ? dados.sort((a: any, b: any) =>
            new Date(b.data).getTime() - new Date(a.data).getTime()
          )
        : [];
    } catch {
      this.pedidos = [];
      this.mensagem = 'Não foi possível carregar os pedidos.';
    }
  }

  get pedidosFiltrados(): any[] {
    if (this.filtroStatus === 'Todos') {
      return this.pedidos;
    }

    return this.pedidos.filter(
      pedido => pedido.status === this.filtroStatus
    );
  }

  alternarDetalhes(id: number): void {
    this.pedidoExpandido =
      this.pedidoExpandido === id ? null : id;
  }

  alterarStatus(pedido: any, novoStatus: string): void {
    if (!this.statusDisponiveis.includes(novoStatus)) {
      return;
    }

    try {
      pedido.status = novoStatus;

      localStorage.setItem(
        'estetica-pedidos-demo',
        JSON.stringify(this.pedidos)
      );

      this.mensagem = `Pedido #${pedido.id} atualizado para ${novoStatus}.`;
    } catch {
      this.mensagem = 'Não foi possível atualizar o pedido.';
      this.carregarPedidos();
    }
  }

  obterFormaPagamento(pedido: any): string {
    if (pedido.totalProdutos > 0) {
      if (pedido.formaPagamentoProdutos === 'pix') {
        return 'Pix';
      }

      if (pedido.formaPagamentoProdutos === 'cartao') {
        return 'Cartão';
      }

      return 'Não informado';
    }

    return pedido.pagamentoServicos || 'Presencial na clínica';
  }
}
