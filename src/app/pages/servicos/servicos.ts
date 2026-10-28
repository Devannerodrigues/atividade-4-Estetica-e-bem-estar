
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-servicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicos.html',
  styleUrl: './servicos.css'
})
export class Servicos {

  servicos = [
    {
      nome: 'Limpeza de Pele',
      descricao: 'Cuidados especiais para uma pele limpa e saudável.',
      preco: 80.00
    },
    {
      nome: 'Hidratação Facial',
      descricao: 'Tratamento para hidratar e revitalizar a pele.',
      preco: 65.00
    },
    {
      nome: 'Massagem Relaxante',
      descricao: 'Uma experiência de relaxamento e bem-estar.',
      preco: 100.00
    }
  ];

}
