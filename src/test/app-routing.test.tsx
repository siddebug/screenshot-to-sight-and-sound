import { describe, expect, it } from "vitest";
import { CLINICAL_SPECIALTIES, COURIER_CONFIGS } from "../data/mockData";

describe("Medicate Core Domain Models", () => {
  it("provides clinical specialties with explicit homeopathy vs allopathy triage boundaries", () => {
    expect(CLINICAL_SPECIALTIES.length).toBe(11);
    CLINICAL_SPECIALTIES.forEach((specialty) => {
      expect(specialty.name).toBeTruthy();
      expect(specialty.helps.length).toBeGreaterThan(0);
      expect(specialty.refer.length).toBeGreaterThan(0);
    });
  });

  it("configures direct URL interpolation for supported couriers", () => {
    expect(COURIER_CONFIGS.bluedart.getUrl("TEST123AWB")).toContain("TEST123AWB");
    expect(COURIER_CONFIGS.delhivery.getUrl("TEST123AWB")).toContain("TEST123AWB");
    expect(COURIER_CONFIGS.dtdc.getUrl("TEST123AWB")).toContain("TEST123AWB");
    expect(COURIER_CONFIGS.dhl.getUrl("TEST123AWB")).toContain("TEST123AWB");
    expect(COURIER_CONFIGS.fedex.getUrl("TEST123AWB")).toContain("TEST123AWB");
  });
});
