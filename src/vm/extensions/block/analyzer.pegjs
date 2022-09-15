Expression
  = head:(Function / Input / Ident) 
    tail:(Function / Input / Ident)*
    { return [head].concat(tail) }
  
Function "function"
  = name:String "(" _
    args:(
      head:Expression
      tail:(_ "," _ @Expression)*
      { return [head].concat(tail); }
    )?
    _ ")" 
    { return { type: "function", name, args: args || [] } }

Input "input"
  = "in" name:Integer
  { return { type: "input", name } }

Ident "ident"
  = name:String
  { return { type: "ident", name } }

String "string"
  = _ text:[a-zA-Z]+ { return text.join("") }

Integer "integer"
  = _ [0-9]+ { return parseInt(text(), 10); }

_ "whitespace"
  = [ \t\n\r]*
