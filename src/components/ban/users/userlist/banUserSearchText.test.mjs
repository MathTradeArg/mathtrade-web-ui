import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { banUserSearchText } from "./banUserSearchText.js";

/** Same shape useBanUserList maps API users into for the table. */
function mapBanUserRow({ id, first_name, last_name, location }) {
  return {
    id,
    first_name,
    name: `${first_name} ${last_name}`,
    last_name,
    location: location?.name || "-",
  };
}

function matches(user, query) {
  return banUserSearchText(user)
    .toLowerCase()
    .includes(query.toLowerCase());
}

describe("banUserSearchText", () => {
  const xavier = mapBanUserRow({
    id: 137,
    first_name: "Xavier",
    last_name: "Ciliento",
    location: { name: "AMBA" },
  });

  it("finds Xavier Ciliento by first name, last name, or full name", () => {
    assert.equal(banUserSearchText(xavier), "Xavier Ciliento");
    assert.equal(matches(xavier, "xavier"), true);
    assert.equal(matches(xavier, "ciliento"), true);
    assert.equal(matches(xavier, "xavier ciliento"), true);
  });

  it("does not match on first name when only last_name is searched (old bug shape)", () => {
    const legacyRow = { id: 137, name: "Xavier Ciliento", last_name: "Ciliento" };
    const buggyHaystack = `${legacyRow.first_name || ""} ${legacyRow.last_name || ""}`;
    assert.equal(buggyHaystack.toLowerCase().includes("xavier"), false);
    assert.equal(matches(legacyRow, "xavier"), true);
  });
});
