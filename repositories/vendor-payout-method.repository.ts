import type { PayoutMethodType } from "@/domain/vendor/vendor-types";
import { prisma } from "@/lib/db/prisma";

export class VendorPayoutMethodRepository {
  upsert(input: {
    vendorProfileId: string;
    method: PayoutMethodType;
    accountName: string | null;
    accountNumberOrIban: string | null;
    bankName: string | null;
    stripeEmail: string | null;
  }) {
    return prisma.vendorPayoutMethod.upsert({
      where: {
        vendorProfileId: input.vendorProfileId,
      },
      update: {
        method: input.method,
        accountName: input.accountName,
        accountNumberOrIban: input.accountNumberOrIban,
        bankName: input.bankName,
        stripeEmail: input.stripeEmail,
      },
      create: {
        vendorProfileId: input.vendorProfileId,
        method: input.method,
        accountName: input.accountName,
        accountNumberOrIban: input.accountNumberOrIban,
        bankName: input.bankName,
        stripeEmail: input.stripeEmail,
      },
    });
  }
}
