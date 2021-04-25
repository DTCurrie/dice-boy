// Generated from discord.js-menu@2.3.1/index.js

declare module "discord.js-menu" {
  import { EventEmitter } from "events";

  export class Menu extends EventEmitter {
    /**
     * Creates a menu.
     * @param {import('discord.js').TextChannel} channel The text channel you want to send the menu in.
     * @param {String} userID The ID of the user you want to let control the menu.
     * @param {Object[]} pages An array of page objects with a name, content MessageEmbed and a set of reactions with page names which lead to said pages.
     * @param {String} pages.name The page's name, used as a destination for reactions.
     * @param {import('discord.js').MessageEmbed} pages.content The page's embed content.
     * @param {Object.<string, string | function>} pages.reactions The reaction options that the page has.
     * @param {Number} ms The number of milliseconds the menu will collect reactions for before it stops to save resources. (seconds * 1000)
     *
     * @remarks
     * Blacklisted page names are: `first, last, previous, next, stop, delete`.
     * These names perform special functions and should only be used as reaction destinations.
     */
    constructor(
      channel: import("discord.js").TextChannel,
      userID: string,
      pages: {
        name: string;
        content: import("discord.js").MessageEmbed;
        reactions: Record<
          string,
          string | (() => unknown) | (() => Promise<unknown>)
        >;
      }[],
      ms?: number
    );
    channel: import("discord.js").TextChannel;
    userID: string;
    ms: number;
    /**
     * List of pages available to the Menu.
     * @type {Page[]}
     */
    pages: Page[];
    /**
     * The page the Menu is currently displaying in chat.
     * @type {Page}
     */
    currentPage: Page;
    /**
     * The index of the Pages array we're currently on.
     * @type {Number}
     */
    pageIndex: number;
    /**
     * Send the Menu and begin listening for reactions.
     */
    start(): void;
    menu: import("discord.js").Message;
    /**
     * Stop listening for new reactions.
     */
    stop(): void;
    /**
     * Delete the menu message.
     */
    delete(): void;
    /**
     * Remove all reactions from the menu message.
     */
    clearReactions(): Promise<void | import("discord.js").Message>;
    /**
     * Jump to a new page in the Menu.
     * @param {Number} page The index of the page the Menu should jump to.
     */
    setPage(page?: number): void;
    /**
     * React to the new page with all of it's defined reactions
     */
    addReactions(): void;
    /**
     * Start a reaction collector and switch pages where required.
     */
    awaitReactions(): void;
    reactionCollector: import("discord.js").ReactionCollector;
  }

  /**
   * A page object that the menu can display.
   */
  class Page {
    /**
     * Creates a menu page.
     * @param {string} name The name of this page, used as a destination for reactions.
     * @param {import('discord.js').MessageEmbed} content The MessageEmbed content of this page.
     * @param {Object.<string, string | function>} reactions The reactions that'll be added to this page.
     * @param {number} index The index of this page in the Menu
     */
    constructor(
      name: string,
      content: import("discord.js").MessageEmbed,
      reactions: Record<
        string,
        string | (() => unknown) | (() => Promise<unknown>)
      >,
      index: number
    );
    name: string;
    content: import("discord.js").MessageEmbed;
    reactions: Record<
      string,
      string | (() => unknown) | (() => Promise<unknown>)
    >;
    index: number;
  }
}
