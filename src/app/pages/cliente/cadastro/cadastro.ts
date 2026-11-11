
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
  cpf = '';
  email = '';
  telefone = '';
  endereco = '';
  senha = '';
  confirmarSenha = '';

  erro = '';

  constructor(private router: Router) {}

  validarCpf(cpf: string): boolean {
    const numeros = cpf.replace(/\D/g, '');

    if (numeros.length !== 11 || /^(\d)\1{10}$/.test(numeros)) {
      return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(numeros[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    let primeiroDigito = resto === 10 ? 0 : resto;

    if (primeiroDigito !== Number(numeros[9])) {
      return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(numeros[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;
    const segundoDigito = resto === 10 ? 0 : resto;

    return segundoDigito === Number(numeros[10]);
  }

  cadastrar(): void {
    this.erro = '';

    const emailNormalizado = this.email.trim().toLowerCase();
    const cpfNumeros = this.cpf.replace(/\D/g, '');
    const telefoneNumeros = this.telefone.replace(/\D/g, '');

    if (
      !this.nome.trim() ||
      !this.cpf.trim() ||
      !this.email.trim() ||
      !this.telefone.trim() ||
      !this.endereco.trim() ||
      !this.senha ||
      !this.confirmarSenha
    ) {
      this.erro = 'Preencha todos os campos obrigatórios.';
      return;
    }

    if (this.nome.trim().length < 3) {
      this.erro = 'Informe seu nome completo.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalizado)) {
      this.erro = 'Informe um endereço de e-mail válido.';
      return;
    }

    if (!this.validarCpf(cpfNumeros)) {
      this.erro = 'Informe um CPF válido.';
      return;
    }

    if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
      this.erro = 'Informe um telefone válido com DDD.';
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

      const existente = clientes.find(
        (cliente: any) =>
          cliente.email === emailNormalizado ||
          cliente.cpf === cpfNumeros
      );

      if (existente) {
        this.erro = 'Este e-mail ou CPF já está cadastrado.';
        return;
      }

      // Dados temporários de demonstração.
      // A senha não é armazenada no navegador.
      clientes.push({
        nome: this.nome.trim(),
        cpf: cpfNumeros,
        email: emailNormalizado,
        telefone: telefoneNumeros,
        endereco: this.endereco.trim()
      });

      localStorage.setItem(
        'estetica-clientes-demo',
        JSON.stringify(clientes)
      );

      alert(
        'Dados cadastrados para demonstração! A autenticação será integrada ao backend.'
      );

      this.router.navigate(['/cliente/login']);

    } catch (erro) {
      console.error('Erro ao cadastrar cliente:', erro);
      this.erro = 'Não foi possível concluir o cadastro neste navegador.';
    }
  }
}
