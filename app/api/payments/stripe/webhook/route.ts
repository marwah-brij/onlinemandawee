import { NextResponse } from "next/server";

import { env } from "@/config/env";
import { withErrorHandling } from "@/middlewares/with-error-handling";
import { parsePaymentWebhookInput } from "@/lib/payments/parse-payment-webhook-input";
import { PaymentWebhookService } from "@/services/payment-webhook.service";
import { paymentWebhookSchema } from "@/validators/payment.validator";

const paymentWebhookService = new PaymentWebhookService();

export const POST = withErrorHandling(async (request) => {
  const input = await parsePaymentWebhookInput(
    request,
    env.STRIPE_WEBHOOK_SECRET,
    paymentWebhookSchema
  );
  const result = await paymentWebhookService.process("STRIPE", input);

  return NextResponse.json({ data: result }, { status: 200 });
});
