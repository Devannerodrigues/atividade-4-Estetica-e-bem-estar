
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import {
  Categoria,
  CategoriaService
} from '../../../services/categoria.service';

@Component({
  selector: 'app-categorias-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './categorias-admin.html',
  styleUrl: './categorias-admin.css'
})
export class CategoriasAdmin implements OnInit {

  categorias: Categoria[] = [];

  categoriaAtual: Categoria = {
    categoria: ''
  };
  modoEdicao = false;
  formularioAberto = false;
  carregando = false;
  salvando = false;

  mensagem = '';
  erro = '';

  constructor(
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.listarCategorias();
  }

  listarCategorias(): void {
    this.carregando = true;
    this.erro = '';

    this.categoriaService.listar().subscribe({
next: (dados: Categoria[]) => {        this.categorias = dados;
        this.carregando = false;
      },
error: (erro: any) => {        console.error(erro);
        this.erro = 'Não foi possível carregar as categorias.';
        this.carregando = false;
      }
    });
  }

  abrirCadastro(): void {
    this.categoriaAtual = { categoria: '' };
    this.modoEdicao = false;
    this.formularioAberto = true;
    this.mensagem = '';
    this.erro = '';
  }

  editar(categoria: Categoria): void {
    this.categoriaAtual = { ...categoria };
    this.modoEdicao = true;
    this.formularioAberto = true;
    this.mensagem = '';
    this.erro = '';
  }

  salvar(): void {
    const nome = this.categoriaAtual.categoria.trim();

    if (!nome) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.mensagem = '';

    if (this.modoEdicao && this.categoriaAtual.idcategoria) {

      const id = this.categoriaAtual.idcategoria;

      this.categoriaService.atualizar(id, {
        ...this.categoriaAtual,
        categoria: nome
      }).subscribe({
        next: () => {
          this.mensagem = 'Categoria atualizada com sucesso!';
          this.finalizarOperacao();
        },
        error: (erro) => {
          console.error(erro);
          this.erro = 'Erro ao atualizar categoria.';
          this.salvando = false;
        }
      });

    } else {

      this.categoriaService.cadastrar({
        categoria: nome
      }).subscribe({
        next: () => {
          this.mensagem = 'Categoria cadastrada com sucesso!';
          this.finalizarOperacao();
        },
        error: (erro) => {
          console.error(erro);
          this.erro = 'Erro ao cadastrar categoria.';
          this.salvando = false;
        }
      });
    }
  }

  excluir(categoria: Categoria): void {
    if (!categoria.idcategoria) {
      return;
    }

    const confirmar = confirm(
      `Deseja excluir a categoria "${categoria.categoria}"?`
    );

    if (!confirmar) {
      return;
    }

    this.categoriaService.excluir(categoria.idcategoria).subscribe({
      next: () => {
        this.mensagem = 'Categoria excluída com sucesso!';
        this.listarCategorias();
      },
      error: (erro) => {
        console.error(erro);
        this.erro = 'Não foi possível excluir a categoria. Verifique se existem produtos vinculados.';
      }
    });
  }

  finalizarOperacao(): void {
    this.formularioAberto = false;
    this.salvando = false;
    this.listarCategorias();
  }

  cancelar(): void {
    this.formularioAberto = false;
    this.categoriaAtual = { categoria: '' };
    this.erro = '';
  }
}
