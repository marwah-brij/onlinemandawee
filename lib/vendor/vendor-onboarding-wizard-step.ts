import type { VendorOnboardingStep } from "@/domain/vendor/vendor-onboarding-step";
import type { VendorStatus } from "@/domain/vendor/vendor-status";

export function vendorOnboardingResumeStep(
  onboardingStep: VendorOnboardingStep,
  status: VendorStatus,
  submittedAt: string | null
): { step: number; submitted: boolean } {
  if ((status === "PENDING_APPROVAL" && submittedAt) || status === "ACTIVE") {
    return { step: 6, submitted: true };
  }

  if (onboardingStep === "SUBMITTED") {
    return { step: 6, submitted: false };
  }

  switch (onboardingStep) {
    case "ACCOUNT_SETUP":
    case "STORE_INFORMATION":
      return { step: 2, submitted: false };
    case "IDENTITY_VERIFICATION":
      return { step: 3, submitted: false };
    case "ADDRESS_CONTACT":
      return { step: 4, submitted: false };
    case "PAYOUT_INFORMATION":
      return { step: 5, submitted: false };
    case "AGREEMENTS":
      return { step: 6, submitted: false };
    default:
      return { step: 2, submitted: false };
  }
}
