export class Emitter {
  constructor() {
    this.vars = new Set();
    this.modules = new Set();
  }

  emit({ moduleName, program }) {
    console.log({ moduleName, program });

    const codes = program.map((line) => this._emit_obj(line));

    const moduleCodes = this.__declare_modules();

    console.log(this.vars);

    const varCodes = this.__declare_vars();

    return `
\`timescale 1ns / 1ps

${moduleCodes.module.join("\n")}

module ${moduleName} (
  input CLK,
  input [3:0] BTN,
  input [3:0] SW,
  output [3:0] LED
);

  ${moduleCodes.var.join("\n  ")}

  ${varCodes.join("\n  ")}

  ${codes.join("\n  ")}

endmodule`;
  }

  _emit_obj(obj) {
    if (obj.type === "function") {
      const args = obj.args.map((arg) => this._emit_obj(arg));
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
        case "eq":
          return `(${args[0]}) == (${args[1]})`;
        case "neq":
          return `(${args[0]}) != (${args[1]})`;
        case "lt":
          return `(${args[0]}) < (${args[1]})`;
        case "lte":
          return `(${args[0]}) <= (${args[1]})`;
        case "ifelse":
          return `(${args[0]}) ? (${args[1]}) : (${args[2]})`;

        case "blink":
          this.modules.add("Blink");
          const clock = args[0] * 125000000 - 1;
          this.vars.add(JSON.stringify({ type: "Blink", clock }));
          return `blink_${clock}`;
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

      // TODO: 自動生成
      if (index !== null) {
        return `${name}${index}`;
      } else {
        return name;
      }
    }

    if (obj.type === "number") {
      return `${obj.number}`;
    }
  }

  __declare_modules() {
    const varCodes = [];
    const moduleCodes = [];

    this.modules.forEach((value) => {
      switch (value) {
        case "Blink":
          moduleCodes.push(
            `
module Blink (
  input CLK,
  output LED
);

  // default 1sec, max 10sec
  parameter CNT_MAX = 31'd124999999;
  reg [30:0] cnt = 31'd0;
  reg led = 1'd0;

  always @(posedge CLK) begin
    if (cnt == CNT_MAX) begin
      cnt <= 30'd0;
      led <= ~led;
    end
    else begin
      cnt <= cnt + 30'd1;
    end
  end

  assign LED = led;

endmodule`.split("\n")
          );
          // varCodes.push(["wire blink1s;", "Blink1s Blink(CLK, blink1s);"]);
          break;
      }
    });

    return {
      var: varCodes.flatMap((x) => x),
      module: moduleCodes.flatMap((x) => x),
    };
  }

  __declare_vars() {
    const varCodes = [];

    this.vars.forEach((v) => {
      const value = JSON.parse(v);
      switch (value.type) {
        case "Blink":
          varCodes.push([
            `wire blink_${value.clock};`,
            `Blink Blink_${value.clock}(CLK,blink_${value.clock});`,
            `defparam Blink_${value.clock}.CNT_MAX = 31'd${value.clock};`,
          ]);
          break;
      }
    });

    return varCodes.flatMap((x) => x);
  }
}
