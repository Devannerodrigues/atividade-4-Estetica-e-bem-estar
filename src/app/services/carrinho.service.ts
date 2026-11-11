
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  id: number | string;
  nome: string;
  preco: number;
  quantidade: number;
  tipo?: 'produto' | 'servico';
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private readonly chave = 'estetica-bem-estar-carrinho';

  private carregarItens(): ItemCarrinho[] {
    try {
      const dados = localStorage.getItem(this.chave);

      if (!dados) return [];

      const itens: ItemCarrinho[] = JSON.parse(dados);

      return itens.map(item => ({
        ...item,
        tipo: item.tipo || 'produto'
      }));
    } catch {
      return [];
    }
  }

  private itensSubject = new BehaviorSubject<ItemCarrinho[]>(
    this.carregarItens()
  );

  itens$ = this.itensSubject.asObservable();

  private atualizar(itens: ItemCarrinho[]): void {
    this.itensSubject.next(itens);

    try {
      localStorage.setItem(this.chave, JSON.stringify(itens));
    } catch {
      console.error('Não foi possível salvar o carrinho.');
    }
  }

  obterItens(): ItemCarrinho[] {
    return this.itensSubject.value;
  }

  adicionar(
    item: Omit<ItemCarrinho, 'quantidade'>
  ): void {
    const tipo = item.tipo || 'produto';

    const itens = [...this.obterItens()];

    const existente = itens.find(
      atual =>
        atual.id === item.id &&
        atual.tipo === tipo
    );

    if (existente) {
      existente.quantidade++;
    } else {
      itens.push({
        ...item,
        tipo,
        quantidade: 1
      });
    }

    this.atualizar(itens);
  }

  alterarQuantidade(
    id: number | string,
    quantidade: number,
    tipo?: 'produto' | 'servico'
  ): void {
    const itens = this.obterItens().map(item =>
      item.id === id && (!tipo || item.tipo === tipo)
        ? {
            ...item,
            quantidade: Math.max(
              1,
              Math.floor(Number(quantidade) || 1)
            )
          }
        : item
    );

    this.atualizar(itens);
  }

  remover(
    id: number | string,
    tipo?: 'produto' | 'servico'
  ): void {
    this.atualizar(
      this.obterItens().filter(
        item =>
          item.id !== id ||
          (tipo && item.tipo !== tipo)
      )
    );
  }

  limpar(): void {
    this.atualizar([]);
  }

  totalItens(): number {
    return this.obterItens().reduce(
      (total, item) => total + item.quantidade,
      0
    );
  }

  valorTotal(): number {
    return this.obterItens().reduce(
      (total, item) =>
        total + item.preco * item.quantidade,
      0
    );
  }
}
