
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Agendamento {
  nomeCliente: string;
  email: string;
  servico: string;
  data: string;
  horario: string;
  pagamento: string;
}

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.css'
})
export class AgendamentoComponent {
  nomeCliente = '';
  email = '';
  servico = '';
  data = '';
  horario = '';
  erro = '';
  sucesso = '';

  hoje = this.dataLocal(new Date());

  servicos = [
    { nome: 'Limpeza de Pele', duracao: 60, preco: 80 },
    { nome: 'Hidratação Facial', duracao: 45, preco: 65 },
    { nome: 'Massagem Relaxante', duracao: 60, preco: 100 }
  ];

  horarios = [
    '09:00', '10:00', '11:00',
    '13:00', '14:00', '15:00', '16:00'
  ];

  horariosOcupados: string[] = [];

  private dataLocal(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  get horariosDisponiveis(): string[] {
    if (!this.data) {
      return [];
    }

    try {
      const agendamentos: Agendamento[] = JSON.parse(
        localStorage.getItem('estetica-agendamentos-demo') || '[]'
      );

      const ocupados = agendamentos
        .filter(a => a.data === this.data)
        .map(a => a.horario);

      return this.horarios.filter(
        horario => !ocupados.includes(horario)
      );
    } catch {
      return this.horarios;
    }
  }

  confirmarAgendamento(): void {
    this.erro = '';
    this.sucesso = '';

    if (
      !this.nomeCliente.trim() ||
      !this.email.trim() ||
      !this.servico ||
      !this.data ||
      !this.horario
    ) {
      this.erro = 'Preencha todos os campos para agendar.';
      return;
    }

    if (this.data < this.hoje) {
      this.erro = 'Escolha uma data a partir de hoje.';
      return;
    }

    if (!this.horariosDisponiveis.includes(this.horario)) {
      this.erro = 'Esse horário não está mais disponível. Escolha outro.';
      return;
    }

    const novoAgendamento: Agendamento = {
      nomeCliente: this.nomeCliente.trim(),
      email: this.email.trim().toLowerCase(),
      servico: this.servico,
      data: this.data,
      horario: this.horario,
      pagamento: 'Presencial na clínica'
    };

    try {
      const agendamentos: Agendamento[] = JSON.parse(
        localStorage.getItem('estetica-agendamentos-demo') || '[]'
      );

      agendamentos.push(novoAgendamento);

      localStorage.setItem(
        'estetica-agendamentos-demo',
        JSON.stringify(agendamentos)
      );

      this.sucesso =
        `Agendamento registrado para ${this.data}, às ${this.horario}. ` +
        'O pagamento será realizado presencialmente na clínica.';

      this.servico = '';
      this.data = '';
      this.horario = '';
    } catch {
      this.erro = 'Não foi possível salvar o agendamento neste navegador.';
    }
  }
}
