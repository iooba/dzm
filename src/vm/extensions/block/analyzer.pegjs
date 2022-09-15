Expression
  = head:(Function / Input / Ident / Number) 
    tail:(Function / Input / Ident / Number)*
    { return [head].concat(tail) }
  
Function "function"
  = name:String "(" _
    args:(
      head:Expression
      tail:(_ "," _ @Expression)*
      { return [head].concat(tail); }
    )?
    _ ")" 
    { return { type: "function", name, args: args.flat() || [] } }

Input "input"
  = "in" name:Integer
  { return { type: "input", name } }

Ident "ident"
  = name:String
  { return { type: "ident", name } }

Number "number"
  = number:Integer
  { return { type: "number", number } }

String
  = _ text:[a-zA-Z]+ { return text.join("") }

Integer
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
