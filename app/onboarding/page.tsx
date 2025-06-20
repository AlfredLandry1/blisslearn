"use client";

import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { OnboardingGuard } from "@/components/auth/OnboardingGuard";

export default function OnboardingPage() {
  return (
    <OnboardingGuard requireOnboarding={true}>
      <OnboardingWizard />
    </OnboardingGuard>
  );
} 