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
  output [3:0] LED,
  output [6:0] LED7SEG,
  output SEL
);
  wire [6:0] LED7SEG;
  wire SEL;

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

        case "blink": {
          const clock = args[0] * 125000000 - 1;
          this.modules.add("Blink");
          this.vars.add(JSON.stringify({ type: "Blink", clock }));
          return `blink_${clock}`;
        }

        case "segment": {
          const value = args[0];
          this.modules.add("LED7Seg2Digit");
          this.vars.add(JSON.stringify({ type: "LED7Seg2Digit", value }));
          return null;
        }

        case "counter": {
          const clock = args[0];
          const index = this.vars.size;
          this.modules.add("Counter");
          this.vars.add(JSON.stringify({ type: "Counter", clock, index }));
          return `counter_${index}`;
        }

        case "pulsar": {
          const value = args[0];
          const index = this.vars.size;
          this.modules.add("Pulsar");
          this.vars.add(JSON.stringify({ type: "Pulsar", value, index }));
          return `pulsar_${index}`;
        }
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
          break;

        case "LED7Seg2Digit":
          moduleCodes.push(
            `
module LED7Seg2Digit (
  input CLK,
  input [6:0] VALUE, 
  output [6:0] LED7SEG,
  output SEL
);
  reg [6:0] LED7SEG;
  reg digit = 0;
  reg [9:0] counter;
  assign SEL = digit;
  always @(posedge CLK) begin
    counter <= counter + 10'b1;
    if (counter == 10'b0) begin
      digit <= ~digit;
    end
    case (digit ? (VALUE / 10) % 10 : VALUE % 10)
      4'd0:  LED7SEG = digit ? 8'b0000000 : 8'b1111110;
      4'd1:  LED7SEG = 8'b0110000;
      4'd2:  LED7SEG = 8'b1101101;
      4'd3:  LED7SEG = 8'b1111001;
      4'd4:  LED7SEG = 8'b0110011;
      4'd5:  LED7SEG = 8'b1011011;
      4'd6:  LED7SEG = 8'b1011111;
      4'd7:  LED7SEG = 8'b1110000;
      4'd8:  LED7SEG = 8'b1111111;
      4'd9:  LED7SEG = 8'b1110011;
    endcase
  end
endmodule`.split("\n")
          );
          break;

        case "Counter":
          moduleCodes.push(
            `
module Counter (
  input CLK,
  output [9:0] VALUE
);
  reg [9:0] VALUE;
  parameter VALUE_MAX = 10'd99;
  always @(posedge CLK) begin
    VALUE <= VALUE + 10'b1;
  end
endmodule`.split("\n")
          );
          break;

        case "Pulsar":
          moduleCodes.push(
            `
module Pulsar (
  input CLK,
  input IN,
  output OUT
);
  reg OUT;
  reg pIN;
  always @(posedge CLK) begin
    OUT <= IN & !pIN;
    pIN <= IN;
  end
endmodule`.split("\n")
          );
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

        case "LED7Seg2Digit":
          varCodes.push([
            `LED7Seg2Digit led7seg2digit(CLK,${value.value},LED7SEG,SEL); `,
          ]);
          break;

        case "Counter":
          varCodes.push([
            `wire [9:0] counter_${value.index};`,
            `Counter Counter_${value.index}(${value.clock},counter_${value.index}); `,
          ]);
          break;

        case "Pulsar":
          varCodes.push([
            `wire pulsar_${value.index};`,
            `Pulsar Pulsar_${value.index}(CLK,${value.value},pulsar_${value.index}); `,
          ]);
          break;
      }
    });

    return varCodes.flatMap((x) => x);
  }
}
