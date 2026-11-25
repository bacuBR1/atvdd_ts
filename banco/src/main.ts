// ============================================================
// MAIN — instancia os objetos e testa cada situação (2+ exemplos)
// ============================================================
import { Cliente } from "./cliente";
import { Conta } from "./conta";
import { Atendimento } from "./atendimento";
import {
  CanalNotificacao,
  NotificacaoSMS,
  NotificacaoEmail,
  NotificacaoApp,
  NotificacaoWhatsApp,
} from "./notificacao";
import { reais } from "./excecoes";

function titulo(texto: string): void {
  console.log("\n" + "=".repeat(60));
  console.log(texto);
  console.log("=".repeat(60));
}

// ---------- Canais de notificação (interface) ----------
const sms = new NotificacaoSMS();
const email = new NotificacaoEmail();
const app = new NotificacaoApp();
const whatsapp = new NotificacaoWhatsApp();

// ---------- Clientes (cada um com seu canal) ----------
const ana = new Cliente("Ana Souza", "111.111.111-11", "Rua A, 10", 3000, sms);
const bruno = new Cliente("Bruno Lima", "222.222.222-22", "Rua B, 20", 4500, email);
const carla = new Cliente("Carla Dias", "333.333.333-33", "Rua C, 30", 2500, app);
const daniel = new Cliente("Daniel Rocha", "444.444.444-44", "Rua D, 40", 5000, whatsapp);

// ---------- Contas (associação: cliente tem 1..* contas) ----------
const contaAna1 = new Conta("1001-1", "0001", ana, 500);
const contaAna2 = new Conta("1001-2", "0001", ana, 300);
const contaBruno1 = new Conta("2002-1", "0001", bruno, 1000);
const contaBruno2 = new Conta("2002-2", "0002", bruno, 200);
const contaCarla = new Conta("3003-1", "0002", carla, 400);
const contaDaniel = new Conta("4004-1", "0002", daniel, 600);

const atendimento = new Atendimento();

titulo("1) ASSOCIAÇÃO: clientes com uma ou mais contas");
for (const cliente of [ana, bruno, carla, daniel]) {
  const numeros = cliente.getContas().map((c) => c.getNumero()).join(", ");
  console.log(`${cliente.getNome()} tem ${cliente.getContas().length} conta(s): ${numeros}`);
}

titulo("2) DEPÓSITOS válidos");
atendimento.realizarDeposito(contaAna1, 1000);
atendimento.realizarDeposito(contaAna2, 100);
atendimento.realizarDeposito(contaBruno1, 2000);
atendimento.realizarDeposito(contaBruno2, 50);
atendimento.realizarDeposito(contaCarla, 800);
atendimento.realizarDeposito(contaDaniel, 1500);

titulo("3) SAQUES com sucesso");
atendimento.realizarSaque(contaAna1, 200);
atendimento.realizarSaque(contaBruno1, 300);

titulo("4) ERRO: valor inválido");
atendimento.realizarSaque(contaCarla, -50); // aumentaria o saldo no sistema antigo!
atendimento.realizarSaque(contaBruno1, 0);
atendimento.realizarDeposito(contaDaniel, -10); // depósito também é barrado

titulo("5) ERRO: conta bloqueada (suspeita de fraude)");
contaDaniel.bloquear();
contaCarla.bloquear();
atendimento.realizarSaque(contaDaniel, 100);
atendimento.realizarSaque(contaCarla, 50);
contaCarla.desbloquear(); // depois de verificado, desbloqueia

titulo("6) ERRO: saldo insuficiente (informa quanto falta)");
atendimento.realizarSaque(contaAna2, 150); // exemplo da Sra. Marta: tem 100, quer 150
atendimento.realizarSaque(contaBruno2, 80);

titulo("7) ERRO: limite diário excedido");
atendimento.realizarSaque(contaAna1, 400); // já sacou 200 hoje, limite 500
atendimento.realizarSaque(contaCarla, 300);
atendimento.realizarSaque(contaCarla, 200); // 300 + 200 > 400

titulo("8) INTERFACE: mesma mensagem, 4 canais diferentes ");
const canais: CanalNotificacao[] = [sms, email, app, whatsapp];
for (const canal of canais) {
  canal.enviar(ana, "Sua cooperativa agora tem atendimento digital! Baixe o app e confira as novidades.");
}

titulo("Saldos finais");
for (const cliente of [ana, bruno, carla, daniel]) {
  for (const conta of cliente.getContas()) {
    console.log(`${cliente.getNome().padEnd(14)} conta ${conta.getNumero()}: ${reais(conta.consultarSaldo())}`);
  }
}
