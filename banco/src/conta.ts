// ============================================================
// CONTA — saque, depósito e consulta de saldo
// ============================================================
import type { Cliente } from "./cliente";
import {
  ValorInvalidoException,
  ContaBloqueadaException,
  SaldoInsuficienteException,
  LimiteDiarioExcedidoException,
} from "./excecoes";

export class Conta {
  private numero: string;
  private agencia: string;
  private dataAbertura: Date;
  private saldo: number = 0; // privado: ninguém mexe no saldo "na mão"
  private bloqueada: boolean = false;
  private limiteDiario: number;
  private sacadoHoje: number = 0;
  private titular: Cliente; // associação: toda conta tem 1 titular

  constructor(numero: string, agencia: string, titular: Cliente, limiteDiario: number) {
    this.numero = numero;
    this.agencia = agencia;
    this.titular = titular;
    this.limiteDiario = limiteDiario;
    this.dataAbertura = new Date();
    titular.adicionarConta(this); // liga os dois lados da associação
  }

  /** @throws ValorInvalidoException */
  depositar(valor: number): void {
    if (valor <= 0) {
      throw new ValorInvalidoException(valor);
    }
    this.saldo += valor;
  }

  /**
   * Regras de negócio do saque (na ordem combinada com a Sra. Marta).
   * @throws ValorInvalidoException | ContaBloqueadaException |
   *         SaldoInsuficienteException | LimiteDiarioExcedidoException
   */
  sacar(valor: number): void {
    if (valor <= 0) {
      throw new ValorInvalidoException(valor);
    }
    if (this.bloqueada) {
      throw new ContaBloqueadaException(this.numero);
    }
    if (valor > this.saldo) {
      throw new SaldoInsuficienteException(this.saldo, valor);
    }
    if (this.sacadoHoje + valor > this.limiteDiario) {
      throw new LimiteDiarioExcedidoException(this.limiteDiario, this.limiteDiario - this.sacadoHoje);
    }
    // Deu tudo certo: saca e atualiza o saldo
    this.saldo -= valor;
    this.sacadoHoje += valor;
  }

  consultarSaldo(): number {
    return this.saldo;
  }

  bloquear(): void {
    this.bloqueada = true;
  }

  desbloquear(): void {
    this.bloqueada = false;
  }

  getNumero(): string {
    return this.numero;
  }

  getAgencia(): string {
    return this.agencia;
  }

  getDataAbertura(): Date {
    return this.dataAbertura;
  }

  getTitular(): Cliente {
    return this.titular;
  }
}
