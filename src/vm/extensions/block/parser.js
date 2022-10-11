export class Parser {
    constructor() {
        this.vars = {
            in: new Set(),
            out: new Set(),
            ident: new Set(),
        };
    }

    parse(program) {
        return program.map(line => `${this._parse_obj(line)};`);
    }

    _parse_obj(obj) {
        if (obj.type === "function") {
            const args = obj.args;
            switch (obj.name) {
                case "assign":
                    return `(${this._parse_obj(args[0])}) = (${this._parse_obj(args[1])})`;
                case "add":
                    return `(${this._parse_obj(args[0])}) + (${this._parse_obj(args[1])})`;
                case "sub":
                    return `(${this._parse_obj(args[0])}) - (${this._parse_obj(args[1])})`;
                case "multi":
                    return `(${this._parse_obj(args[0])}) * (${this._parse_obj(args[1])})`;
                case "div":
                    return `(${this._parse_obj(args[0])}) / (${this._parse_obj(args[1])})`;
            }
        }
    
        if (obj.type === "input") {
            this.vars.in.add(`i${obj.name}`);
            return `i${obj.name}`;
        }
    
        if (obj.type === "output") {
            this.vars.out.add(`o${obj.name}`);
            return `o${obj.name}`;
        }
    
        if (obj.type === "ident") {
            this.vars.ident.add(`${obj.name}`);
            return `${obj.name}`;
        }
    
        if (obj.type === "number") {
            return `${obj.number}`;
        }
    }
}
