
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../../services/produto';
import { CarrinhoService } from '../../services/carrinho.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.html',
  styleUrl: './produtos.css'
})
export class Produtos implements OnInit {

  produtos: any[] = [];
  carregando = true;
  erro = '';
  mensagem = '';

  // Filtros
  termoPesquisa = '';
  categoriaSelecionada = '';
  tipoSelecionado = '';

  categorias: { id: string; nome: string }[] = [];
  tiposDisponiveis: string[] = [];

  constructor(
    private produtoService: ProdutoService,
    private carrinhoService: CarrinhoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
  }
   produtoSelecionado: any = null;
  carregarProdutos(): void {
    this.carregando = true;
    this.erro = '';

    this.produtoService.listar().subscribe({
      next: (dados: any[]) => {
        console.log('DADOS DA API:', dados);

        this.produtos = Array.isArray(dados) ? dados : [];

        this.carregarCategorias();
        this.carregarTipos();

        this.carregando = false;
        this.cdr.detectChanges();
      },

      error: (erro: any) => {
        console.error('ERRO NA API:', erro);
        this.erro = 'Não foi possível carregar os produtos.';
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  obterItem(produto: any): any {
    return produto?.iditemNavigation ??
      produto?.IditemNavigation ??
      produto;
  }

  obterNome(produto: any): string {
    const item = this.obterItem(produto);

    return item?.item ??
      item?.Item ??
      item?.item1 ??
      item?.Item1 ??
      'Produto sem nome';
  }

  obterDescricao(produto: any): string {
    const item = this.obterItem(produto);

    return item?.descricaoItem ??
      item?.DescricaoItem ??
      'Sem descrição disponível.';
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
    return produto?.unidade ??
      produto?.Unidade ??
      'UN';
  }

  obterId(produto: any): number | string {
    return produto?.idproduto ??
      produto?.Idproduto ??
      produto?.idProduto ??
      produto?.iditem ??
      produto?.Iditem ??
      produto?.id ??
      produto?.Id ??
      '';
  }

  obterCategoriaId(produto: any): string {
    const item = this.obterItem(produto);

    return String(
      item?.idcategoria ??
      item?.Idcategoria ??
      produto?.idcategoria ??
      produto?.Idcategoria ??
      ''
    );
  }

  obterCategoriaNome(produto: any): string {
    const item = this.obterItem(produto);

    return item?.categoria?.categoria ??
      item?.Categoria?.Categoria ??
      `Categoria ${this.obterCategoriaId(produto)}`;
  }

  obterTipo(produto: any): string {
    const item = this.obterItem(produto);

    return String(
      item?.tipoItem ??
      item?.TipoItem ??
      ''
    ).toUpperCase();
  }

  produtoAtivo(produto: any): boolean {
    const item = this.obterItem(produto);

    const ativo =
      item?.ativoProdutoServico ??
      item?.AtivoProdutoServico;

    if (ativo == null || ativo === '') {
      return true;
    }

    return ['S', 'SIM', 'TRUE', '1'].includes(
      String(ativo).toUpperCase()
    );
  }

  carregarCategorias(): void {
    const mapa = new Map<string, string>();

    this.produtos.forEach(produto => {
      const id = this.obterCategoriaId(produto);

      if (id) {
        mapa.set(id, this.obterCategoriaNome(produto));
      }
    });

    this.categorias = Array.from(mapa, ([id, nome]) => ({
      id,
      nome
    }));
  }

  carregarTipos(): void {
    this.tiposDisponiveis = [
      ...new Set(
        this.produtos
          .map(produto => this.obterTipo(produto))
          .filter(tipo => tipo !== '')
      )
    ];
  }

  get produtosFiltrados(): any[] {
    const pesquisa = this.termoPesquisa
      .trim()
      .toLowerCase();

    return this.produtos.filter(produto => {
      const nome = this.obterNome(produto).toLowerCase();
      const descricao = this.obterDescricao(produto).toLowerCase();

      const correspondePesquisa =
        !pesquisa ||
        nome.includes(pesquisa) ||
        descricao.includes(pesquisa);

      const correspondeCategoria =
        !this.categoriaSelecionada ||
        this.obterCategoriaId(produto) === this.categoriaSelecionada;

      const correspondeTipo =
        !this.tipoSelecionado ||
        this.obterTipo(produto) === this.tipoSelecionado;

      return this.produtoAtivo(produto) &&
        correspondePesquisa &&
        correspondeCategoria &&
        correspondeTipo;
    });
  }

  limparFiltros(): void {
    this.termoPesquisa = '';
    this.categoriaSelecionada = '';
    this.tipoSelecionado = '';
  }
   verDetalhes(produto: any): void {
  this.produtoSelecionado = produto;
}

  fecharDetalhes(): void {
  this.produtoSelecionado = null;
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

    console.log(
      'Carrinho atualizado:',
      this.carrinhoService.obterItens()
    );
    
  }
}
