export const parser = (program) => {
    return program.map(line => `${parser_obj(line)};`);
};

const parser_obj = (obj) => {
    if (obj.type === "function") {
        const args = obj.args;
        switch (obj.name) {
            case "assign":
                return `(${parser_obj(args[0])}) = (${parser_obj(args[1])})`;
            case "add":
                return `(${parser_obj(args[0])}) + (${parser_obj(args[1])})`;
            case "sub":
                return `(${parser_obj(args[0])}) - (${parser_obj(args[1])})`;
            case "multi":
                return `(${parser_obj(args[0])}) * (${parser_obj(args[1])})`;
            case "div":
                return `(${parser_obj(args[0])}) / (${parser_obj(args[1])})`;
        }
    }

    if (obj.type === "input") {
        return `_i${obj.name}`;
    }

    if (obj.type === "output") {
        return `_o${obj.name}`;
    }

    if (obj.type === "ident") {
        return `${obj.name}`;
    }

    if (obj.type === "number") {
        return `${obj.number}`;
    }
}
