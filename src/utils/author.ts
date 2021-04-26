import { MessageEmbedAuthor, MessageEmbedThumbnail } from "discord.js";
import { CommandoClient } from "discord.js-commando";

export const getAuthorData = (
  client: CommandoClient
): { author: MessageEmbedAuthor; thumbnail: MessageEmbedThumbnail } => ({
  author: {
    iconURL: client.user ? client.user.avatarURL() : null,
    name: client.user ? client.user.username : "Dice Boy",
  } as MessageEmbedAuthor,
  thumbnail: {
    proxyURL: client.user ? client.user.avatarURL() : null,
  } as MessageEmbedThumbnail,
});
