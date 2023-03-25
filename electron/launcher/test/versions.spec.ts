import { expect } from "chai";
import {
  fromNodePlatformToPlatform,
  GameVersionLibraryRule,
  GameVersionLibraryRuleFilter,
} from "../versions";

describe("GameVersionLibraryRuleFilter test", () => {
  it("should accept allow library for all system", () => {
    const rule: GameVersionLibraryRule = {
      action: "allow",
    };
    // For all system
    expect(
      GameVersionLibraryRuleFilter.accept(
        rule,
        fromNodePlatformToPlatform("darwin"),
        "x64"
      )
    ).to.be.true;
  });
});
