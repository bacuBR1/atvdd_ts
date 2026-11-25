// ============================================================
// INTERFACE — o "contrato" de todo canal de notificação
// ============================================================
import type { Cliente } from "./cliente";

// Todo canal sabe enviar uma mensagem para um cliente.
// O resto do sistema só conhece ESTE contrato.
export interface CanalNotificacao {
  enviar(cliente: Cliente, mensagem: string): void;
}

// SMS: mensagem curtinha (corta em 60 caracteres)
export class NotificacaoSMS implements CanalNotificacao {
  enviar(cliente: Cliente, mensagem: string): void {
    let texto = mensagem;
    if (texto.length > 60) {
      texto = texto.substring(0, 57) + "...";
    }
    console.log(`   📱 [SMS para ${cliente.getNome()}] ${texto}`);
  }
}

// E-mail: pode ser mais longo, com saudação e assinatura
export class NotificacaoEmail implements CanalNotificacao {
  enviar(cliente: Cliente, mensagem: string): void {
    console.log(`   📧 [E-MAIL para ${cliente.getNome()}]`);
    console.log(`      Assunto: Aviso da sua cooperativa`);
    console.log(`      Olá, ${cliente.getNome()}!`);
    console.log(`      ${mensagem}`);
    console.log(`      Atenciosamente, Cooperativa de Crédito.`);
  }
}

// Notificação no aplicativo: imediata
export class NotificacaoApp implements CanalNotificacao {
  enviar(cliente: Cliente, mensagem: string): void {
    console.log(`   🔔 [APP - agora - ${cliente.getNome()}] ${mensagem}`);
  }
}

// "E se amanhã eu quiser mandar por WhatsApp?"
// Só criamos mais uma classe que segue o contrato. Nada mais muda!
export class NotificacaoWhatsApp implements CanalNotificacao {
  enviar(cliente: Cliente, mensagem: string): void {
    console.log(`   💬 [WhatsApp para ${cliente.getNome()}] ${mensagem}`);
  }
}
