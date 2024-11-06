CodeMirror.defineMode("z80", function() {
    // Expresiones regulares
    const mnemonics = /\b(?:ld|push|pop|ex|exx|fx|ldi|ldir|ldd|lddr|cpi|cpir|cpd|cpdr|add|adc|sub|sbc|and|or|xor|cp|inc|dec|daa|cpl|neg|ccf|scf|nop|halt|di|ei|im|rlca|rla|rrca|rra|rlc|rl|rrc|rr|sla|sra|srl|rld|rrd|bit|set|res|jp|jr|djnz|call|ret|reti|retn|rst|in|ini|inir|ind|indr|out|outi|outir|outd|otdr)\b/i;
    const registers = /\b(?:a|b|c|d|e|h|l|f|af|bc|de|hl|ix|iy|sp|pc|i|r|iff1|iff2|s|z|y|h|x|p|n|c|s)\b/i;
    const numbers = /\b(?:\d+|[0-9A-F]+H?|0x[0-9A-Fa-f]+|0b[01]+)\b/i;
    const comments = /;.*/;



    return {
      token: function(stream) {
        if (stream.eatSpace()) return null;

        // Comentarios
        if (stream.match(comments)) {
          return "comment";
        }

        // Mnemónicos
        if (stream.match(mnemonics)) {
            return "mnemonic";
          }

        // Registros
        if (stream.match(registers)) {
          return "register";
        }

        // Números
        if (stream.match(numbers)) {
          return "number";
        }

        // Si no se reconoce el token
        stream.next();
        return null;
      }
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

ciclo1:
	LD E,0H
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