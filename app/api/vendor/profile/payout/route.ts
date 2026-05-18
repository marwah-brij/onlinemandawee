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
const profilePayoutSchema = z.object({
  method: z.enum(payoutMethodTypes),
  accountName: z.string().trim().max(120).optional(),
  accountNumberOrIban: z.string().trim().max(80).optional(),
  bankName: z.string().trim().max(120).optional(),
  stripeEmail: z.email().max(255).optional(),
});

const vendorProfileService = new VendorProfileService();

export const PATCH = withErrorHandling(
  withRbac(["VENDOR"], async (request, context) => {
    const input = await parseBody(request, profilePayoutSchema);
    const result = await vendorProfileService.updatePayoutMethod(context.auth, input);
    return NextResponse.json({ data: result }, { status: 200 });
  })
);
