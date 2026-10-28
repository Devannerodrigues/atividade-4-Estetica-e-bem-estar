
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private readonly apiUrl = 'https://localhost:7077/api/ProdutoItem';

  constructor(private http: HttpClient) {}

  listar(): Observable<unknown[]> {
    return this.http.get<unknown[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<unknown> {
    return this.http.get<unknown>(`${this.apiUrl}/${id}`);
  }
}
