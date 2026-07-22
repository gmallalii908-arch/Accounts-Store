import "server-only";

/** دالة احتياطية خالية بعد التحول الكامل للواتساب المباشر */
export async function sendTelegramMessage(_text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  try {
    const url = `https://api.telegram.org/bot${token.trim()}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: _text,
        parse_mode: "HTML",
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function notifyNewOrderTelegram(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  totalFormatted: string;
  paymentMethod: string;
}): Promise<void> {
  const methodText = order.paymentMethod === "cash" ? "كاش" : "تحويل فوري (إيصال)";
  const msg = `
🚨 <b>طلب جديد في Accounts Store!</b>
🏷️ <b>رقم الطلب:</b> <code>${order.orderNumber}</code>
👤 <b>العميل:</b> ${order.customerName} (${order.customerPhone})
💳 <b>طريقة الدفع:</b> ${methodText}
💰 <b>الإجمالي:</b> ${order.totalFormatted}
  `.trim();

  await sendTelegramMessage(msg);
}

export async function notifyConfirmedOrderTelegram(order: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
}): Promise<void> {
  const msg = `
✅ <b>تم تأكيد الدفع للطلب #${order.orderNumber}!</b>
👤 العميل: ${order.customerName} (${order.customerPhone})
  `.trim();

  await sendTelegramMessage(msg);
}

export async function getTelegramDeliveryLink(orderNumber: string): Promise<string> {
  return `https://t.me/AccountsStoreEgypt`;
}
