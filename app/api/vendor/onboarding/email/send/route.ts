import { NextResponse } from "next/server";

import { withErrorHandling } from "@/middlewares/with-error-handling";
import { VendorEmailOtpService } from "@/services/vendor-email-otp.service";
import { vendorEmailSendCodeSchema } from "@/validators/vendor.validator";
import { parseBody } from "@/validators/request";

const service = new VendorEmailOtpService();

export const POST = withErrorHandling(async (request) => {
  const input = await parseBody(request, vendorEmailSendCodeSchema);
  const result = await service.sendCode(input.email);
  return NextResponse.json({ data: result }, { status: 200 });
});
