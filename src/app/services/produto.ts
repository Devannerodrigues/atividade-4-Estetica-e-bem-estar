
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly apiUrl =
    'https://localhost:7077/api/ProdutoItem';

  constructor(private http: HttpClient) {}

  // LISTAR PRODUTOS
  listar(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // BUSCAR PRODUTO POR ID
  buscarPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // CADASTRAR PRODUTO
  cadastrar(produto: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, produto);
  }

  // ATUALIZAR PRODUTO
  atualizar(id: number, produto: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produto);
  }

}
