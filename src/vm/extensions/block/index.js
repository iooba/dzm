import BlockType from "../../extension-support/block-type";
import ArgumentType from "../../extension-support/argument-type";
import translations from "./translations.json";
import blockIcon from "./block-icon.png";

import * as parser from "./parser";
import { Emitter } from "./emitter";

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = (messageData) => messageData.defaultMessage;

/**
 * Setup format-message for this extension.
 */
const setupTranslations = () => {
  const localeSetup = formatMessage.setup();
  if (localeSetup && localeSetup.translations[localeSetup.locale]) {
    Object.assign(
      localeSetup.translations[localeSetup.locale],
      translations[localeSetup.locale]
    );
  }
};

const EXTENSION_ID = "scratch2verilog";

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL =
  "https://HitsujiRere.github.io/scratch2verilog/dist/scratch2verilog.mjs";

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {
  /**
   * @return {string} - the name of this extension.
   */
  static get EXTENSION_NAME() {
    return formatMessage({
      id: "scratch2verilog.name",
      default: "Scratch to Verilog",
      description: "name of the extension",
    });
  }

  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return EXTENSION_ID;
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL;
  }

  /**
   * Set URL to get this extension.
   * The extensionURL will be changed to the URL of the loading server.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }

  /**
   * Construct a set of blocks for Scratch to Verilog.
   * @param {Runtime} runtime - the Scratch 3.0 runtime.
   */
  constructor(runtime) {
    /**
     * The Scratch 3.0 runtime.
     * @type {Runtime}
     */
    this.runtime = runtime;

    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }
  }

  set_module_name(args) {
    this.moduleName = args.name;
  }

  run_fpga(args) {
    const value = parser.parse(args.value);
    console.log(value);

    console.log(JSON.stringify(value, null, "  "));

    const emitter = new Emitter();
    const program = emitter.emit({
      moduleName: this.moduleName ?? "moduleName",
      program: value,
    });

    console.log(program);

    return navigator.clipboard
      .writeText(program)
      .then(() => {
        console.log("Copied to clipboard.");
        return "Copied to clipboard.";
      })
      .catch(() => {
        console.log("Copy to clipboard failed.");
        return "Copy to clipboard failed.";
      });
  }

  assign(args) {
    return `assign(${args.var}, ${args.expression})`;
  }

  blink1s(args) {
    return `blink(${args.sec})`;
  }

  add(args) {
    return `add(${args.x}, ${args.y})`;
  }

  sub(args) {
    return `sub(${args.x}, ${args.y})`;
  }

  multi(args) {
    return `multi(${args.x}, ${args.y})`;
  }

  div(args) {
    return `div(${args.x}, ${args.y})`;
  }

  and(args) {
    return `and(${args.x}, ${args.y})`;
  }

  or(args) {
    return `or(${args.x}, ${args.y})`;
  }

  xor(args) {
    return `xor(${args.x}, ${args.y})`;
  }

  eq(args) {
    return `eq(${args.x}, ${args.y})`;
  }

  neq(args) {
    return `neq(${args.x}, ${args.y})`;
  }

  lt(args) {
    return `lt(${args.x}, ${args.y})`;
  }

  lte(args) {
    return `lte(${args.x}, ${args.y})`;
  }

  ifelse(args) {
    return `ifelse(${args.cond}, ${args.x}, ${args.y})`;
  }

  led7seg2digit(args) {
    return `led7seg2digit(${args.value})`;
  }

  /**
   * @returns {object} metadata for this extension and its blocks.
   */
  getInfo() {
    setupTranslations();
    return {
      id: ExtensionBlocks.EXTENSION_ID,
      name: ExtensionBlocks.EXTENSION_NAME,
      extensionURL: ExtensionBlocks.extensionURL,
      blockIconURI: blockIcon,
      showStatusButton: false,
      blocks: [
        {
          opcode: "Set Module Name",
          blockType: BlockType.COMMAND,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.SetModuleName",
            default: "モジュール名を [name] に変更する",
            description: "Set module name",
          }),
          func: "set_module_name",
          arguments: {
            name: {
              type: ArgumentType.STRING,
              defaultValue: "moduleName",
            },
          },
        },
        {
          opcode: "Run FPGA",
          blockType: BlockType.COMMAND,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.RunFPGA",
            default: "[value] をVerilogに変換する",
            description: "Run on FPGA",
          }),
          func: "run_fpga",
          arguments: {
            value: {
              type: ArgumentType.STRING,
              defaultValue: "[program]",
            },
          },
        },
        {
          opcode: "Assign",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Assign",
            default: "[var] を [expression] に繋げる",
            description: "Assign",
          }),
          func: "assign",
          arguments: {
            var: {
              type: ArgumentType.STRING,
              defaultValue: "LED0",
            },
            expression: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
          },
        },
        {
          opcode: "LED7Seg2Digit",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.LED7Seg2Digit",
            default: "[value]を7セグメントLEDに繋げる",
            description: "Connect to 7-segment led",
          }),
          func: "led7seg2digit",
          arguments: {
            value: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
          },
        },
        {
          opcode: "Blink1s",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Blink1s",
            default: "[sec] 秒ごとにON/OFF",
            description: "Blink",
          }),
          func: "blink1s",
          arguments: {
            sec: {
              type: ArgumentType.NUMBER,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Add",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Add",
            default: "[x] + [y]",
            description: "x + y",
          }),
          func: "add",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
          },
        },
        {
          opcode: "Sub",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Sub",
            default: "[x] - [y]",
            description: "x - y",
          }),
          func: "sub",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
          },
        },
        {
          opcode: "Multi",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Multi",
            default: "[x] * [y]",
            description: "x * y",
          }),
          func: "multi",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Div",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Div",
            default: "[x] / [y]",
            description: "x / y",
          }),
          func: "div",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "And",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.And",
            default: "[x] & [y]",
            description: "x & y",
          }),
          func: "and",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Or",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Or",
            default: "[x] | [y]",
            description: "x | y",
          }),
          func: "or",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Xor",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Xor",
            default: "[x] ^ [y]",
            description: "x ^ y",
          }),
          func: "xor",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Eq",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Eq",
            default: "[x] == [y]",
            description: "x == y",
          }),
          func: "eq",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Neq",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Neq",
            default: "[x] != [y]",
            description: "x != y",
          }),
          func: "neq",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Lt",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Lt",
            default: "[x] < [y]",
            description: "x < y",
          }),
          func: "lt",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "Lte",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.Lte",
            default: "[x] <= [y]",
            description: "x <= y",
          }),
          func: "lte",
          arguments: {
            x: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "1",
            },
          },
        },
        {
          opcode: "IfElse",
          blockType: BlockType.REPORTER,
          blockAllThreads: false,
          text: formatMessage({
            id: "scratch2verilog.IfElse",
            default: "[cond] なら [x] でないなら　[y]",
            description: "cond ? x : y",
          }),
          func: "ifelse",
          arguments: {
            cond: {
              type: ArgumentType.STRING,
              defaultValue: "true",
            },
            x: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
            y: {
              type: ArgumentType.STRING,
              defaultValue: "0",
            },
          },
        },
      ],
      menus: {},
    };
  }
}

export { ExtensionBlocks as default, ExtensionBlocks as blockClass };
