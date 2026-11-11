
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface ClienteAdmin {
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  endereco: string;
}

interface PedidoAdmin {
  id: number;
  cliente: {
    nome: string;
    email: string;
    telefone: string;
  };
  total: number;
  status: string;
  data: string;
  itens: any[];
}

@Component({
  selector: 'app-clientes-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './clientes-admin.html',
  styleUrl: './clientes-admin.css'
})
export class ClientesAdmin implements OnInit {

  clientes: ClienteAdmin[] = [];
  pedidos: PedidoAdmin[] = [];

  pesquisa = '';
  clienteSelecionado: ClienteAdmin | null = null;

  ngOnInit(): void {
    this.carregarClientes();
    this.carregarPedidos();
  }

  carregarClientes(): void {
    try {
      this.clientes = JSON.parse(
        localStorage.getItem('estetica-clientes-demo') || '[]'
      );
    } catch {
      this.clientes = [];
    }
  }

  carregarPedidos(): void {
    try {
      this.pedidos = JSON.parse(
        localStorage.getItem('estetica-pedidos-demo') || '[]'
      );
    } catch {
      this.pedidos = [];
    }
  }

  get clientesFiltrados(): ClienteAdmin[] {
    const termo = this.pesquisa.trim().toLowerCase();

    if (!termo) {
      return this.clientes;
    }

    return this.clientes.filter(cliente =>
      (cliente.nome || '').toLowerCase().includes(termo) ||
      (cliente.email || '').toLowerCase().includes(termo) ||
      (cliente.cpf || '').includes(termo)
    );
  }

  selecionarCliente(cliente: ClienteAdmin): void {
    this.clienteSelecionado = cliente;
  }

  fecharDetalhes(): void {
    this.clienteSelecionado = null;
  }

  get pedidosDoCliente(): PedidoAdmin[] {
    if (!this.clienteSelecionado) {
      return [];
    }

    return this.pedidos
      .filter(pedido =>
        pedido.cliente?.email?.toLowerCase() ===
        this.clienteSelecionado?.email?.toLowerCase()
      )
      .sort((a, b) =>
        new Date(b.data).getTime() - new Date(a.data).getTime()
      );
  }

  get totalGasto(): number {
    return this.pedidosDoCliente.reduce(
      (total, pedido) => total + Number(pedido.total || 0),
      0
    );
  }

  formatarCPF(cpf: string): string {
    if (!cpf) return '';
    return cpf;
  }
}
