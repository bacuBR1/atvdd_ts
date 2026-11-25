// ============================================================
// EXCEÇÕES — cada tipo de falha do saque tem sua própria classe
// ============================================================

// Formata um número como dinheiro: 150 -> "R$ 150,00"
export function reais(valor: number): string {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

// Classe ABSTRATA (abstração + herança): não dá pra criar um
// "erro genérico de operação", só os tipos específicos abaixo.
export abstract class OperacaoBancariaException extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = this.constructor.name;
  }

  // Cada exceção diz o seu tipo (polimorfismo).
  // Assim o atendente sabe se é bloqueio, falta de dinheiro etc.
  abstract getTipo(): string;
}

// Valor <= 0 (ex.: saque de -50 ou de 0)
export class ValorInvalidoException extends OperacaoBancariaException {
  private valor: number;

  constructor(valor: number) {
    super(`Valor inválido: ${reais(valor)}. O valor deve ser maior que zero.`);
    this.valor = valor;
  }

  getValor(): number {
    return this.valor;
  }

  getTipo(): string {
    return "VALOR INVÁLIDO";
  }
}

// Conta bloqueada (ex.: suspeita de fraude)
export class ContaBloqueadaException extends OperacaoBancariaException {
  private numeroConta: string;

  constructor(numeroConta: string) {
    super(`A conta ${numeroConta} está bloqueada. Procure a cooperativa.`);
    this.numeroConta = numeroConta;
  }

  getNumeroConta(): string {
    return this.numeroConta;
  }

  getTipo(): string {
    return "CONTA BLOQUEADA";
  }
}

// Valor maior que o saldo — informa QUANTO FALTA
export class SaldoInsuficienteException extends OperacaoBancariaException {
  private valorFaltante: number;

  constructor(saldo: number, valorPedido: number) {
    const falta = valorPedido - saldo;
    super(`Saldo insuficiente. Saldo atual: ${reais(saldo)}. Faltam ${reais(falta)}.`);
    this.valorFaltante = falta;
  }

  getValorFaltante(): number {
    return this.valorFaltante;
  }

  getTipo(): string {
    return "SALDO INSUFICIENTE";
  }
}

// Soma dos saques do dia passou do limite diário
export class LimiteDiarioExcedidoException extends OperacaoBancariaException {
  private limiteDiario: number;
  private disponivelHoje: number;

  constructor(limiteDiario: number, disponivelHoje: number) {
    super(
      `Limite diário de ${reais(limiteDiario)} excedido. ` +
        `Você ainda pode sacar ${reais(disponivelHoje)} hoje.`
    );
    this.limiteDiario = limiteDiario;
    this.disponivelHoje = disponivelHoje;
  }

  getLimiteDiario(): number {
    return this.limiteDiario;
  }

  getDisponivelHoje(): number {
    return this.disponivelHoje;
  }

  getTipo(): string {
    return "LIMITE DIÁRIO EXCEDIDO";
  }
}
