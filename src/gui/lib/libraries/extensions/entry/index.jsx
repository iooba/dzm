/**
 * This is an extension for Xcratch.
 */

import iconURL from "./entry-icon.png";
import insetIconURL from "./inset-icon.svg";
import translations from "./translations.json";

/**
 * Formatter to translate the messages in this extension.
 * This will be replaced which is used in the React component.
 * @param {object} messageData - data for format-message
 * @returns {string} - translated message for the current locale
 */
let formatMessage = (messageData) => messageData.defaultMessage;

const entry = {
  get name() {
    return formatMessage({
      id: "scratch2verilog.entry.name",
      default: "Scratch to Verilog",
      description: "name of the extension",
    });
  },
  extensionId: "scratch2verilog",
  extensionURL:
    "https://HitsujiRere.github.io/scratch2verilog/dist/scratch2verilog.mjs",
  collaborator: "HitsujiRere",
  iconURL: iconURL,
  insetIconURL: insetIconURL,
  get description() {
    return formatMessage({
      defaultMessage: "an extension for Xcratch",
      description: "Description for this extension",
      id: "scratch2verilog.entry.description",
    });
  },
  featured: true,
  disabled: false,
  bluetoothRequired: false,
  internetConnectionRequired: false,
  helpLink: "https://HitsujiRere.github.io/scratch2verilog/",
  setFormatMessage: (formatter) => {
    formatMessage = formatter;
  },
  translationMap: translations,
};

export { entry }; // loadable-extension needs this line.
export default entry;
