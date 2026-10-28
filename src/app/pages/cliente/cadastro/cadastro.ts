
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.css'
})
export class Cadastro {
  nome = '';
  email = '';
  telefone = '';
  senha = '';
  confirmarSenha = '';
  erro = '';

  constructor(private router: Router) {}

  cadastrar(): void {
    this.erro = '';

    if (
      !this.nome.trim() ||
      !this.email.trim() ||
      !this.senha ||
      !this.confirmarSenha
    ) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.senha.length < 8) {
      this.erro = 'A senha deve ter pelo menos 8 caracteres.';
      return;
    }

    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não são iguais.';
      return;
    }

    try {
      const clientes = JSON.parse(
        localStorage.getItem('estetica-clientes-demo') || '[]'
      );

      const emailNormalizado = this.email.trim().toLowerCase();

      const existente = clientes.find(
        (cliente: { email: string }) =>
          cliente.email.toLowerCase() === emailNormalizado
      );

      if (existente) {
        this.erro = 'Este e-mail já está cadastrado.';
        return;
      }

      clientes.push({
        nome: this.nome.trim(),
        email: emailNormalizado,
        telefone: this.telefone.trim(),
        senha: this.senha
      });

      localStorage.setItem(
        'estetica-clientes-demo',
        JSON.stringify(clientes)
      );

      alert('Cadastro realizado! Agora você pode entrar na sua conta.');
      this.router.navigate(['/cliente/login']);
    } catch {
      this.erro = 'Não foi possível concluir o cadastro neste navegador.';
    }
  }
}
