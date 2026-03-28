import { PingText } from "../src/client";

const pt = new PingText(process.env.PINGTEXT_API_KEY!);

async function main() {
  const message = await pt.messages.send({
    to: "+15551234567",
    body: "Your order #1234 has shipped! Track it here: https://example.com/track/1234",
  });

  console.log("Message sent:", message.id, "Status:", message.status);

  await new Promise((r) => setTimeout(r, 3000));

  const status = await pt.messages.get(message.id);
  console.log("Delivery status:", status.status);
}

main().catch(console.error);
