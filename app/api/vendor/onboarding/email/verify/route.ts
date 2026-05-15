import { NextResponse } from "next/server";

import { withErrorHandling } from "@/middlewares/with-error-handling";
import { VendorEmailOtpService } from "@/services/vendor-email-otp.service";
import { vendorEmailVerifyCodeSchema } from "@/validators/vendor.validator";
import { parseBody } from "@/validators/request";

const service = new VendorEmailOtpService();

export const POST = withErrorHandling(async (request) => {
  const input = await parseBody(request, vendorEmailVerifyCodeSchema);
  const result = await service.verifyCode(input.email, input.code);
  return NextResponse.json({ data: result }, { status: 200 });
});
