import { NextResponse } from "next/server";
import { z } from "zod";

import { payoutMethodTypes } from "@/domain/vendor/vendor-types";
import { withErrorHandling } from "@/middlewares/with-error-handling";
import { withRbac } from "@/middlewares/with-rbac";
import { VendorProfileService } from "@/services/vendor-profile.service";
import { parseBody } from "@/validators/request";

/**
 * Accepts all payout fields simultaneously so bank details and
 * digital wallet email can both be stored in one save.
 * Field-level required validation is handled on the client;
 * here we just ensure the types are correct and nothing overflows.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profilePayoutSchema = z
  .object({
    method: z.enum(payoutMethodTypes),
    accountName: z.string().trim().max(120).optional(),
    accountNumberOrIban: z.string().trim().max(80).optional(),
    bankName: z.string().trim().max(120).optional(),
    // Empty string = clear this field; non-empty must be a valid email.
    stripeEmail: z
      .string()
      .max(255)
      .refine((v) => v === "" || EMAIL_RE.test(v), {
        message: "Enter a valid PayPal or Stripe email address",
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    // Preferred method's own fields are required.
    if (val.method === "BANK") {
      if (!val.accountName?.trim()) {
        ctx.addIssue({ code: "custom", path: ["accountName"], message: "Account holder name is required for bank payout" });
      }
      if (!val.accountNumberOrIban?.trim()) {
        ctx.addIssue({ code: "custom", path: ["accountNumberOrIban"], message: "Account number or IBAN is required for bank payout" });
      }
      if (!val.bankName?.trim()) {
        ctx.addIssue({ code: "custom", path: ["bankName"], message: "Bank name is required for bank payout" });
      }
    }
    if (val.method === "STRIPE") {
      if (!val.stripeEmail?.trim()) {
        ctx.addIssue({ code: "custom", path: ["stripeEmail"], message: "PayPal or Stripe email is required when it is the preferred method" });
      }
    }
  });

const vendorProfileService = new VendorProfileService();

export const PATCH = withErrorHandling(
  withRbac(["VENDOR"], async (request, context) => {
    const input = await parseBody(request, profilePayoutSchema);
    const result = await vendorProfileService.updatePayoutMethod(context.auth, input);
    return NextResponse.json({ data: result }, { status: 200 });
  })
);
