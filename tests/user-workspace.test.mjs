import test from "node:test";
import assert from "node:assert/strict";
import {
  workspaceRequest,
  ownClaims,
  rows,
  dateLabel,
} from "../src/features/workspace/workspaceModel.js";
test("report-related requests require explicit report selection", () => {
  for (const resource of ["claims", "matches"]) {
    assert.throws(() => workspaceRequest({ resource }));
    assert.equal(
      workspaceRequest({ resource, id: 42 }),
      `/lost-found/reports/42/${resource}`,
    );
  }
});
test("claims are scoped to the signed-in account without guessing identity", () => {
  const claims = [
    { id: 1, claimantUserId: 7 },
    { id: 2, claimantUserId: 8 },
    { id: 3 },
  ];
  assert.deepEqual(ownClaims(claims, "7"), [claims[0]]);
  assert.deepEqual(ownClaims(claims, null), []);
});
test("profile updates only send backend-supported editable fields", () => {
  assert.deepEqual(
    workspaceRequest({
      resource: "profile",
      action: "save",
      body: {
        username: "Member",
        bio: "Hello",
        email: "change@example.com",
        role: "admin",
      },
    }),
    {
      url: "/users/update-user",
      method: "PUT",
      body: { username: "Member", bio: "Hello" },
    },
  );
});
test("notification paging and read actions match API contract", () => {
  assert.equal(
    workspaceRequest({ resource: "notifications", page: 2 }),
    "/notifications?page=2&size=20",
  );
  assert.deepEqual(
    workspaceRequest({ resource: "notifications", action: "mark-read", id: 8 }),
    { url: "/notifications/8/read", method: "PATCH" },
  );
  assert.throws(() =>
    workspaceRequest({ resource: "notifications", action: "delete", id: 8 }),
  );
});
test("list parsing rejects malformed payloads instead of showing a false empty state", () => {
  assert.deepEqual(rows({ content: [{ id: 1 }] }), [{ id: 1 }]);
  assert.deepEqual(rows({ data: [{ id: 2 }] }), [{ id: 2 }]);
  assert.throws(() => rows({ unexpected: true }));
  assert.equal(dateLabel(null), "—");
});

test("media and profile images resolve to the standardized media uri", async () => {
  const { formatMediaUrl, profileImageUrl, MEDIA_BASE_URI } = await import("../src/features/workspace/profileImage.js");
  assert.equal(MEDIA_BASE_URI, "https://forum-istad-api.cheat.casa/api/v1/media/");
  assert.equal(formatMediaUrl("239feece-654c.jpg"), "https://forum-istad-api.cheat.casa/api/v1/media/239feece-654c.jpg");
  assert.equal(formatMediaUrl("http://localhost:8070/api/v1/239feece-654c.jpg"), "https://forum-istad-api.cheat.casa/api/v1/media/239feece-654c.jpg");
  assert.equal(formatMediaUrl("https://forum-istad-api.cheat.casa/api/v1/media/239feece-654c.jpg"), "https://forum-istad-api.cheat.casa/api/v1/media/239feece-654c.jpg");
  assert.equal(profileImageUrl("profile-images/user123.png"), "https://forum-istad-api.cheat.casa/api/v1/media/user123.png");
  assert.equal(profileImageUrl("blob:http://localhost:5173/preview"), "blob:http://localhost:5173/preview");
  assert.equal(profileImageUrl(null, "fallback.png"), "fallback.png");
});


