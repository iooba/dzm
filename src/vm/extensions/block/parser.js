export class Parser {
  constructor() {
    this.vars = new Set();
  }

  parse(program) {
    return `
\`timescale 1ns / 1ps

module moduleName (
  input [3:0] BTN,
  input [3:0] SW,
  output [3:0] LED
);

${program.map((line) => this._parse_obj(line)).join("\n")}

endmodule`;
  }

  _parse_obj(obj) {
    if (obj.type === "function") {
      const args = obj.args.map((arg) => this._parse_obj(arg));
      switch (obj.name) {
        case "assign":
          return `assign ${args[0]} = ${args[1]};`;
        case "add":
          return `(${args[0]}) + (${args[1]})`;
        case "sub":
          return `(${args[0]}) - (${args[1]})`;
        case "multi":
          return `(${args[0]}) * (${args[1]})`;
        case "div":
          return `(${args[0]}) / (${args[1]})`;
        case "and":
          return `(${args[0]}) & (${args[1]})`;
        case "or":
          return `(${args[0]}) | (${args[1]})`;
        case "xor":
          return `(${args[0]}) ^ (${args[1]})`;
      }
    }

    if (obj.type === "ident") {
      const name = obj.name;
      const index = obj.index;

      if (["LED", "BTN", "SW"].includes(name)) {
        if (index !== null) {
          return `${name}[${index}]`;
        } else {
          return name;
        }
      }

      this.vars.add(`${name}${index}`);
      return `${name}${index}`;
    }

    if (obj.type === "number") {
      return `${obj.number}`;
    }
  }
}
