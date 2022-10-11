import BlockType from '../../extension-support/block-type';
import ArgumentType from '../../extension-support/argument-type';
import Cast from '../../util/cast';
import translations from './translations.json';
import blockIcon from './block-icon.png';

import * as analyzer from "./analyzer";
import { Parser } from "./parser";

/**
 * Formatter which is used for translation.
 * This will be replaced which is used in the runtime.
 * @param {object} messageData - format-message object
 * @returns {string} - message for the locale
 */
let formatMessage = messageData => messageData.defaultMessage;

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

const EXTENSION_ID = 'myExtension';

/**
 * URL to get this extension as a module.
 * When it was loaded as a module, 'extensionURL' will be replaced a URL which is retrieved from.
 * @type {string}
 */
let extensionURL = 'https://HitsujiRere.github.io/xcx-my-extension/dist/myExtension.mjs';

/**
 * Scratch 3.0 blocks for example of Xcratch.
 */
class ExtensionBlocks {

    /**
     * @return {string} - the name of this extension.
     */
    static get EXTENSION_NAME () {
        return formatMessage({
            id: 'myExtension.name',
            default: 'My Extension',
            description: 'name of the extension'
        });
    }

    /**
     * @return {string} - the ID of this extension.
     */
    static get EXTENSION_ID () {
        return EXTENSION_ID;
    }

    /**
     * URL to get this extension.
     * @type {string}
     */
    static get extensionURL () {
        return extensionURL;
    }

    /**
     * Set URL to get this extension.
     * The extensionURL will be changed to the URL of the loading server.
     * @param {string} url - URL
     */
    static set extensionURL (url) {
        extensionURL = url;
    }

    /**
     * Construct a set of blocks for My Extension.
     * @param {Runtime} runtime - the Scratch 3.0 runtime.
     */
    constructor (runtime) {
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

    run_fpga(args) {
        const value = analyzer.parse(args.value);
        console.log(value);

        console.log(JSON.stringify(value, null, "  "));

        const parser = new Parser();
        const program = parser.parse(value);
        console.log(program);
        console.log(parser.vars);
    }

    output(args) {
        return 0;
    }

    assign(args) {
        return `assign(${args.var}, ${args.expression})`;
    }

    add (args) {
        return `add(${args.x}, ${args.y})`;
    }

    sub (args) {
        return `sub(${args.x}, ${args.y})`;
    }

    multi(args) {
        return `multi(${args.x}, ${args.y})`;
    }

    div(args) {
        return `div(${args.x}, ${args.y})`;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        setupTranslations();
        return {
            id: ExtensionBlocks.EXTENSION_ID,
            name: ExtensionBlocks.EXTENSION_NAME,
            extensionURL: ExtensionBlocks.extensionURL,
            blockIconURI: blockIcon,
            showStatusButton: false,
            blocks: [
                {
                    opcode: 'Run FPGA',
                    blockType: BlockType.COMMAND,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.RunFPGA',
                        default: 'Run FPGA [value]',
                        description: 'Run on FPGA'
                    }),
                    func: 'run_fpga',
                    arguments: {
                        value: {
                            type: ArgumentType.STRING,
                            defaultValue: '[program]'
                        },
                    }
                },
                {
                    opcode: 'Output',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.Output',
                        default: 'Output [index]',
                        description: 'Output block'
                    }),
                    func: 'output',
                    arguments: {
                        index: {
                            type: ArgumentType.NUMBER,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'Assign',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.Assign',
                        default: 'Assign [var] = [expression]',
                        description: 'Assign'
                    }),
                    func: 'assign',
                    arguments: {
                        var: {
                            type: ArgumentType.STRING,
                            defaultValue: 'out1'
                        },
                        expression: {
                            type: ArgumentType.STRING,
                            defaultValue: '0'
                        },
                    }
                },
                {
                    opcode: 'Add',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.Add',
                        default: '[x] + [y]',
                        description: 'x + y'
                    }),
                    func: 'add',
                    arguments: {
                        x: {
                            type: ArgumentType.STRING,
                            defaultValue: '0',
                        },
                        y: {
                            type: ArgumentType.STRING,
                            defaultValue: '0',
                        }
                    }
                },
                {
                    opcode: 'Sub',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.Sub',
                        default: '[x] - [y]',
                        description: 'x - y'
                    }),
                    func: 'sub',
                    arguments: {
                        x: {
                            type: ArgumentType.STRING,
                            defaultValue: '0',
                        },
                        y: {
                            type: ArgumentType.STRING,
                            defaultValue: '0',
                        }
                    }
                },
                {
                    opcode: 'Multi',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.Multi',
                        default: '[x] * [y]',
                        description: 'x * y'
                    }),
                    func: 'multi',
                    arguments: {
                        x: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },
                        y: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        }
                    }
                },
                {
                    opcode: 'Div',
                    blockType: BlockType.REPORTER,
                    blockAllThreads: false,
                    text: formatMessage({
                        id: 'myExtension.Div',
                        default: '[x] / [y]',
                        description: 'x / y'
                    }),
                    func: 'div',
                    arguments: {
                        x: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        },
                        y: {
                            type: ArgumentType.STRING,
                            defaultValue: '1'
                        }
                    }
                },
            ],
            menus: {
            }
        };
    }
}

export {
    ExtensionBlocks as default,
    ExtensionBlocks as blockClass
};
