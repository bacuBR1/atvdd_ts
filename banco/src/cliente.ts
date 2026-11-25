// ============================================================
// CLIENTE — tem uma ou mais contas e um canal de notificação
// ============================================================
import type { Conta } from "./conta";
import type { CanalNotificacao } from "./notificacao";

export class Cliente {
  // Encapsulamento: atributos privados, acesso só pelos métodos
  private nome: string;
  private cpf: string;
  private endereco: string;
  private renda: number;
  private contas: Conta[] = []; // associação: 1 cliente -> 1..* contas
  private canal: CanalNotificacao; // associação com a INTERFACE

  constructor(nome: string, cpf: string, endereco: string, renda: number, canal: CanalNotificacao) {
    this.nome = nome;
    this.cpf = cpf;
    this.endereco = endereco;
    this.renda = renda;
    this.canal = canal;
  }

  adicionarConta(conta: Conta): void {
    this.contas.push(conta);
  }

  // O cliente não sabe se é SMS, e-mail ou app: só chama enviar()
  notificar(mensagem: string): void {
    this.canal.enviar(this, mensagem);
  }

  getNome(): string {
    return this.nome;
  }

  getCpf(): string {
    return this.cpf;
  }

  getEndereco(): string {
    return this.endereco;
  }

  getRenda(): number {
    return this.renda;
  }

  getContas(): Conta[] {
    return this.contas;
  }
}
