
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cliente-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  senha = '';
  erro = '';

  constructor(private router: Router) {}

  entrar(): void {
    this.erro = '';

    try {
      const clientes = JSON.parse(
        localStorage.getItem('estetica-clientes-demo') || '[]'
      );

      const cliente = clientes.find(
        (item: { email: string; senha: string }) =>
          item.email.toLowerCase() === this.email.trim().toLowerCase() &&
          item.senha === this.senha
      );

      if (!cliente) {
        this.erro = 'E-mail ou senha inválidos.';
        return;
      }

      // Apenas demonstração local; não é uma autenticação segura.
      sessionStorage.setItem(
        'estetica-cliente-logado',
        JSON.stringify({
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone
        })
      );

      this.router.navigate(['/']);
    } catch {
      this.erro = 'Não foi possível entrar. Tente novamente.';
    }
  }
}
