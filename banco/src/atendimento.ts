// ============================================================
// ATENDIMENTO — faz as operações e TRATA as exceções
// ============================================================
import { Conta } from "./conta";
import { OperacaoBancariaException, SaldoInsuficienteException, reais } from "./excecoes";

export class Atendimento {
  realizarSaque(conta: Conta, valor: number): void {
    const cliente = conta.getTitular();
    console.log(`\n➡️  Saque de ${reais(valor)} | conta ${conta.getNumero()} | ${cliente.getNome()}`);

    try {
      conta.sacar(valor);
      console.log(`   ✅ Saque realizado! Novo saldo: ${reais(conta.consultarSaldo())}`);
    } catch (erro) {
      // Tratamento específico: saldo insuficiente sugere depósito
      if (erro instanceof SaldoInsuficienteException) {
        console.log(`   ❌ [${erro.getTipo()}] ${erro.message}`);
        console.log(`   💡 Atendente: sugerir depósito de ${reais(erro.getValorFaltante())}.`);
        cliente.notificar(erro.message);
      }
      // Tratamento geral para as outras exceções do banco (polimorfismo)
      else if (erro instanceof OperacaoBancariaException) {
        console.log(`   ❌ [${erro.getTipo()}] ${erro.message}`);
        cliente.notificar(erro.message);
      }
      // Erro que não é do banco: deixa subir
      else {
        throw erro;
      }
    }
  }

  realizarDeposito(conta: Conta, valor: number): void {
    const cliente = conta.getTitular();
    console.log(`\n➡️  Depósito de ${reais(valor)} | conta ${conta.getNumero()} | ${cliente.getNome()}`);

    try {
      conta.depositar(valor);
      console.log(`   ✅ Depósito realizado! Novo saldo: ${reais(conta.consultarSaldo())}`);
    } catch (erro) {
      if (erro instanceof OperacaoBancariaException) {
        console.log(`   ❌ [${erro.getTipo()}] ${erro.message}`);
        cliente.notificar(erro.message);
      } else {
        throw erro;
      }
    }
  }
}
