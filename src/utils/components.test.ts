import { ButtonStyle } from "discord.js";
import { describe, expect, it } from "vitest";

import { inviteButton, supportButton, supportServerButton } from "./components";

describe("components", () => {
  it("creates an invite button with the default label", () => {
    expect(inviteButton()).toStrictEqual({
      type: 2,
      style: ButtonStyle.Link,
      label: "Add to your server",
      url: "https://discord.com/oauth2/authorize?client_id=undefined",
    });
  });

  it("creates an invite button with a custom label", () => {
    const customLabel = "Add me again";
    expect(inviteButton(customLabel).label).toBe(customLabel);
  });

  it("creates support buttons", () => {
    expect(supportServerButton()).toStrictEqual({
      type: 2,
      style: ButtonStyle.Link,
      label: "Join our server",
      url: "https://discord.gg/dE3NFqTzEx",
    });
    expect(supportButton()).toStrictEqual({
      type: 2,
      style: ButtonStyle.Link,
      label: "❤️ Support me",
      url: "https://ko-fi.com/ivolong",
    });
  });
});
