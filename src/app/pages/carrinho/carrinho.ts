
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import {
  CarrinhoService,
  ItemCarrinho
} from '../../services/carrinho.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css'
})
export class Carrinho {

  itens: ItemCarrinho[] = [];

  constructor(
    public carrinho: CarrinhoService,
    private router: Router
  ) {
    this.carrinho.itens$.subscribe(itens => {
      this.itens = itens;
    });
  }

  alterarQuantidade(
    item: ItemCarrinho,
    quantidade: number
  ): void {
    this.carrinho.alterarQuantidade(
      item.id,
      quantidade,
      item.tipo
    );
  }

  remover(item: ItemCarrinho): void {
    this.carrinho.remover(
      item.id,
      item.tipo
    );
  }

  finalizarCompra(): void {
    if (this.itens.length === 0) {
      return;
    }

    this.router.navigate(['/checkout']);
  }
}
