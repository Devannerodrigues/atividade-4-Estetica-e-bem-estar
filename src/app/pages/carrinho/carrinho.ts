
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarrinhoService, ItemCarrinho } from '../../services/carrinho.service';
@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {
  itens: ItemCarrinho[] = [];

  constructor(public carrinho: CarrinhoService) {
    this.carrinho.itens$.subscribe(itens => {
      this.itens = itens;
    });
  }

  alterarQuantidade(item: ItemCarrinho, quantidade: number): void {
    this.carrinho.alterarQuantidade(item.id, quantidade);
  }

  remover(item: ItemCarrinho): void {
    this.carrinho.remover(item.id);
  }

  finalizarCompra(): void {
    if (this.itens.length === 0) {
      return;
    }

    // A próxima etapa implementará a finalização da compra.
    alert('Carrinho pronto! A finalização da compra será implementada na próxima etapa.');
  }
}
