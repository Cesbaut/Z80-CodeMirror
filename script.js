CodeMirror.defineMode("z80", function() {
  // Expresiones regulares
  const mnemonic = /\b(?:ld|push|pop|ex|exx|fx|ldi|ldir|ldd|lddr|cpi|cpir|cpd|cpdr|add|adc|sub|sbc|and|or|xor|cp|inc|dec|daa|cpl|neg|ccf|scf|nop|halt|di|ei|im|rlca|rla|rrca|rra|rlc|rl|rrc|rr|sla|sra|srl|rld|rrd|bit|set|res|jp|jr|djnz|call|ret|reti|retn|rst|in|ini|inir|ind|indr|out|outi|outir|outd|otdr)\b/i;
  const registro = /\b(?:a|b|c|d|e|h|l|af|bc|de|hl|ix|iy|sp|pc|i|r|iff1|iff2|s|z|y|h|x|p|n|c|s)\b/i;
  const numero = /\b(?:[0-9A-F]+H|\d+|0x[0-9A-Fa-f]+|0b[01]+)\b/i; // Modificado para capturar correctamente valores hexadecimales como 00H
  const comentarios = /;.*/;
  const directiva = /\b(?:CPU|DB|DWL|DWM|DDL|DDM|DQL|DQM|DR|DRD|DRL|DFS|END|EQU|IF|IFDENF|IFNDEF|ELSE|ELIF|END|INC|MACRO|ORG|STRUCT|UNION|PROC)\b/i;
  const coma = /,/;
  const etiquetas = /^[a-zA-Z_]\w*:/; // Modificado para que capture etiquetas correctamente

  function startState() {
    return {
      flow: "flow1",
      step: "directiva" 
    };
  }

  function switchFlow(state) {
    if (state.flow === "flow1") {
      state.flow = "flow2";
      state.step = "mnemonic";
    } else if (state.flow === "flow2") {
      state.flow = "flow3";
      state.step = "directiva";
    } else {
      state.flow = "flow1";
      state.step = "directiva";
    }
  }

  function token(stream, state) {
    if (stream.eatSpace()) return null; 

    if (stream.match(comentarios)) {
      return "comment";
    }
    if (stream.match(etiquetas)) {
      return "etiquetas";
    }

    // Flujo 1: directiva → mnemónico → registro → coma
    if (state.flow === "flow1") {
      if (state.step === "directiva" && stream.match(directiva)) {
        state.step = "mnemonic";
        return "directiva";
      }
      if (state.step === "mnemonic" && stream.match(mnemonic)) {
        state.step = "registro";
        return "mnemonic";
      }
      if (state.step === "registro" && stream.match(registro)) {
        state.step = "coma";
        return "register";
      }
      if (state.step === "coma" && stream.match(coma)) {
        state.step = "directiva";
        return "operator";
      }
    }

    // Flujo 2: mnemonic → registro → coma → número
    if (state.flow === "flow2") {
      if (state.step === "mnemonic" && stream.match(mnemonic)) {
        state.step = "registro";
        return "mnemonic";
      }
      if (state.step === "registro" && stream.match(registro)) {
        state.step = "coma";
        return "register";
      }
      if (state.step === "coma" && stream.match(coma)) {
        state.step = "numero";
        return "operator";
      }
      if (state.step === "numero" && stream.match(numero)) {
        state.step = "mnemonic"; 
        return "number";
      }
    }

    // Flujo 3: directiva → número → coma → mnemónico → registro
    if (state.flow === "flow3") {
      if (state.step === "directiva" && stream.match(directiva)) {
        state.step = "numero";
        return "directiva";
      }
      if (state.step === "numero" && stream.match(numero)) {
        state.step = "coma";
        return "number";
      }
      if (state.step === "coma" && stream.match(coma)) {
        state.step = "mnemonic";
        return "operator";
      }
      if (state.step === "mnemonic" && stream.match(mnemonic)) {
        state.step = "registro";
        return "mnemonic";
      }
      if (state.step === "registro" && stream.match(registro)) {
        state.step = "directiva"; 
        return "register";
      }
    }

    switchFlow(state);
    stream.next(); 
    return "error"; 
  }

  return {
    startState: startState,
    token: token
  };
});


  const editor = CodeMirror(document.getElementById("editor"), {
    mode: "z80",
    theme: "default",
    lineNumbers: true,
    tabSize: 4
  });

//Codigo de ejemplo
  editor.setValue(`;BUBBLE SORT
;Bautista Castilla Cesar

LD A, (00F0H)
LD D, A; ELEMENTOS n
LD B,0; INCREMENTO I

LD IY, 0100H
CPU LD A,
ciclo1:
	LD E,00H
	LD IX, 0100H
    LD C,0; DECREMENTO J
    INC B
ciclo2:
	
	INC C
    LD A, (IX+1)
    LD H,(IX+0)
    CP H
    JP P,no
	LD L, H
    LD (IX+0),A
    LD (IX+1),L
    LD E,01H
    
no:
	INC IX
    LD A,D
    SUB B
    DEC A
    CP C
    JP P,ciclo2
    LD A,0
    CP E
    JP P, salto1
	INC IY
    LD A,D
    CP B
    JP P,ciclo1
    
    
salto1:
	HALT`)