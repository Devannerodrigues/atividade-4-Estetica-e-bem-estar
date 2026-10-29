
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../../services/produto';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {

  produtos: any[] = [];
  carregando = true;
  erro = '';
  mensagem = '';

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.produtoService.listar().subscribe({
      next: (dados: any[]) => {
        console.log('Dados recebidos da API:', dados);
        this.produtos = Array.isArray(dados) ? dados : [];
        this.carregando = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar produtos:', erro);

        this.erro =
          'Não foi possível carregar os produtos. Verifique se o backend está funcionando.';

        this.carregando = false;
      }
    });
  }

  obterNome(produto: any): string {
    return (
      produto?.iditemNavigation?.item ??
      produto?.IditemNavigation?.Item ??
      produto?.item ??
      produto?.Item ??
      'Produto sem nome'
    );
  }

  obterDescricao(produto: any): string {
    return (
      produto?.iditemNavigation?.descricaoItem ??
      produto?.IditemNavigation?.DescricaoItem ??
      produto?.descricaoItem ??
      produto?.DescricaoItem ??
      'Sem descrição disponível.'
    );
  }

  obterPreco(produto: any): number {
    const preco =
      produto?.precoVenda ??
      produto?.PrecoVenda ??
      produto?.preco_venda ??
      produto?.preco ??
      produto?.Preco ??
      0;

    return Number(preco);
  }

  obterUnidade(produto: any): string {
    return (
      produto?.unidade ??
      produto?.Unidade ??
      'UN'
    );
  }

  obterId(produto: any): number | string {
    return (
      produto?.idproduto ??
      produto?.Idproduto ??
      produto?.idProduto ??
      produto?.iditem ??
      produto?.Iditem ??
      produto?.id ??
      produto?.Id ??
      ''
    );
  }

  adicionarAoCarrinho(produto: any): void {
    const id = this.obterId(produto);
    const nome = this.obterNome(produto);
    const preco = this.obterPreco(produto);

    if (id === '' || preco <= 0 || !Number.isFinite(preco)) {
      this.mensagem =
        'Não foi possível adicionar este produto. Confira o identificador e o preço.';
      return;
    }

    this.carrinhoService.adicionar({
      id,
      nome,
      preco
    });

    this.mensagem = `${nome} foi adicionado ao carrinho!`;

    console.log('Carrinho atualizado:', this.carrinhoService.obterItens());
  }
}
