
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos {

  termoPesquisa = '';
  categoriaSelecionada = '';
  mensagem = '';

  servicoSelecionado: any = null;

  categorias = [
    'Facial',
    'Corporal'
  ];

  servicos = [
    {
      id: 1,
      nome: 'Limpeza de Pele',
      descricao: 'Cuidados especiais para uma pele limpa e saudável.',
      preco: 80.00,
      categoria: 'Facial'
    },
    {
      id: 2,
      nome: 'Hidratação Facial',
      descricao: 'Tratamento para hidratar e revitalizar a pele.',
      preco: 65.00,
      categoria: 'Facial'
    },
    {
      id: 3,
      nome: 'Massagem Relaxante',
      descricao: 'Uma experiência de relaxamento e bem-estar.',
      preco: 100.00,
      categoria: 'Corporal'
    }
  ];

  constructor(
    private carrinhoService: CarrinhoService
  ) {}

  get servicosFiltrados(): any[] {
    const pesquisa = this.termoPesquisa.trim().toLowerCase();

    return this.servicos.filter(servico => {
      const correspondePesquisa =
        servico.nome.toLowerCase().includes(pesquisa) ||
        servico.descricao.toLowerCase().includes(pesquisa);

      const correspondeCategoria =
        !this.categoriaSelecionada ||
        servico.categoria === this.categoriaSelecionada;

      return correspondePesquisa && correspondeCategoria;
    });
  }

  limparFiltros(): void {
    this.termoPesquisa = '';
    this.categoriaSelecionada = '';
  }

  verDetalhes(servico: any): void {
    this.servicoSelecionado = servico;
  }

  fecharDetalhes(): void {
    this.servicoSelecionado = null;
  }

  adicionarAoCarrinho(servico: any): void {
    this.carrinhoService.adicionar({
      id: servico.id,
      nome: servico.nome,
      preco: servico.preco
    });

    this.mensagem = `${servico.nome} foi adicionado ao carrinho!`;
  }

}
