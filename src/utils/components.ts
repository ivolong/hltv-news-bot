import { ButtonStyle } from "discord.js";

export const inviteButton = (label: string = "Add to your server") => {
  return {
    type: 2,
    style: ButtonStyle.Link,
    label,
    url: `https://discord.com/oauth2/authorize?client_id=${process.env.DISCORD_CLIENT_ID}`,
  };
};

export const supportServerButton = () => {
  return {
    type: 2,
    style: ButtonStyle.Link,
    label: "Join our server",
    url: "https://discord.gg/dE3NFqTzEx",
  };
};

export const supportButton = () => {
  return {
    type: 2,
    style: ButtonStyle.Link,
    label: "❤️ Support me",
    url: "https://ko-fi.com/ivolong",
  };
};
