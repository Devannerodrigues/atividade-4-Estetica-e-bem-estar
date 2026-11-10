
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServicoApi {
  id: number;
  nome: string;
  descricao: string;
  duracaoMinutos: number;
  preco: number;
  ativo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private apiUrl = 'https://localhost:7077/api/Servico';

  constructor(private http: HttpClient) {}

  listar(): Observable<ServicoApi[]> {
    return this.http.get<ServicoApi[]>(this.apiUrl);
  }

  cadastrar(servico: Omit<ServicoApi, 'id'>): Observable<ServicoApi> {
    return this.http.post<ServicoApi>(this.apiUrl, servico);
  }

  atualizar(
    id: number,
    servico: Omit<ServicoApi, 'id'>
  ): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, servico);
  }
}
