import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent implements OnInit {
  leads: any[] = [];
  loading: boolean = true;
  apiUrl = 'https://cadastro-lead-api.vercel.app/leads';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.carregarLeads();
  }

  carregarLeads() {
    this.loading = true;
    this.http.get(this.apiUrl).subscribe({
      next: (data: any) => {
        this.leads = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar leads:', error);
        this.loading = false;
      }
    });
  }

  deletarLead(id: string) {
    if (!confirm('Tem certeza que deseja deletar este lead?')) return;
    
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        console.log('Lead deletado com sucesso');
        this.carregarLeads();
      },
      error: (error) => {
        console.error('Erro ao deletar:', error);
      }
    });
  }
}