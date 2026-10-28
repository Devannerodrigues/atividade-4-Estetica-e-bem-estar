
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
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

    if (!this.email.trim() || !this.senha.trim()) {
      this.erro = 'Preencha o e-mail e a senha.';
      return;
    }

    // Login provisório, apenas para testar a navegação.
    if (
      this.email.trim() === 'admin@esteticabemestar.com' &&
      this.senha === 'admin123'
    ) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.erro = 'E-mail ou senha incorretos.';
    }
  }
}
