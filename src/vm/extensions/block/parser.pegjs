Expression
  = (Function / Ident / Number)+

Function "function"
  = name:String "(" _
    args:(
      head:Expression
      tail:(_ "," _ @Expression)*
      { return [head].concat(tail); }
    )?
    _ ")" 
    { return { type: "function", name, args: args ? args.flat() : [] } }

Ident "ident"
  = name:String index:Integer?
  { return { type: "ident", name, index } }

Number "number"
  = number:Integer
  { return { type: "number", number } }

String
  = _ text:[a-zA-Z0-9]+ { return text.join("") }

Integer
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\f\r\n\v]*
