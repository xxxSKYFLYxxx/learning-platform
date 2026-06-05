/**
 * ЮКасса — российский платёжный шлюз
 * Документация: https://yookassa.ru/developers
 */

const BASE_URL = "https://api.yookassa.ru/v3";

function getAuthHeader() {
  const credentials = Buffer.from(
    `${process.env.YOOKASSA_SHOP_ID}:${process.env.YOOKASSA_SECRET_KEY}`
  ).toString("base64");
  return `Basic ${credentials}`;
}

export interface YooKassaPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  confirmation: { confirmation_url: string };
  metadata: Record<string, string>;
}

export async function createPayment({
  amount,
  description,
  returnUrl,
  metadata,
}: {
  amount: number;
  description: string;
  returnUrl: string;
  metadata: Record<string, string>;
}): Promise<YooKassaPayment> {
  const res = await fetch(`${BASE_URL}/payments`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
      "Idempotence-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      amount: { value: amount.toFixed(2), currency: "RUB" },
      confirmation: { type: "redirect", return_url: returnUrl },
      capture: true,
      description,
      metadata,
      // Поддержка СБП (QR-код), банковских карт, ЮMoney
      payment_method_data: { type: "bank_card" },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ЮКасса: ${res.status} — ${err}`);
  }

  return res.json();
}

export async function getPayment(paymentId: string): Promise<YooKassaPayment> {
  const res = await fetch(`${BASE_URL}/payments/${paymentId}`, {
    headers: { Authorization: getAuthHeader() },
  });
  return res.json();
}

export function verifyWebhookIP(ip: string): boolean {
  // ЮКасса отправляет вебхуки только с этих IP-адресов
  const YOOKASSA_IPS = [
    "185.71.76.0/27",
    "185.71.77.0/27",
    "77.75.153.0/25",
    "77.75.156.11",
    "77.75.156.35",
    "77.75.154.128/25",
    "2a02:5180::/32",
  ];
  // Упрощённая проверка для IPv4
  return YOOKASSA_IPS.some((range) => {
    if (!range.includes("/")) return ip === range;
    const [network] = range.split("/");
    return ip.startsWith(network.split(".").slice(0, 3).join("."));
  });
}
