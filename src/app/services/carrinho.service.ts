
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ItemCarrinho {
  id: number | string;
  nome: string;
  preco: number;
  quantidade: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarrinhoService {
  private readonly chave = 'estetica-bem-estar-carrinho';

  private carregarItens(): ItemCarrinho[] {
    try {
      const dados = localStorage.getItem(this.chave);
      return dados ? JSON.parse(dados) : [];
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
      // O carrinho continua funcionando enquanto a página estiver aberta.
    }
  }

  obterItens(): ItemCarrinho[] {
    return this.itensSubject.value;
  }

  adicionar(produto: Omit<ItemCarrinho, 'quantidade'>): void {
    const itens = [...this.obterItens()];
    const existente = itens.find(item => item.id === produto.id);

    if (existente) {
      existente.quantidade++;
    } else {
      itens.push({ ...produto, quantidade: 1 });
    }

    this.atualizar(itens);
  }

  alterarQuantidade(id: number | string, quantidade: number): void {
    const itens = this.obterItens().map(item =>
      item.id === id
        ? {
            ...item,
            quantidade: Math.max(1, Math.floor(Number(quantidade) || 1))
          }
        : item
    );

    this.atualizar(itens);
  }

  remover(id: number | string): void {
    this.atualizar(
      this.obterItens().filter(item => item.id !== id)
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
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  }
}
