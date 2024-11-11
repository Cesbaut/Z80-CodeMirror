CodeMirror.defineMode("z80_multi_order", function() {
    // Expresiones regulares para cada tipo de token
    const directiva = /\b(?:ORG|END|MACRO|IF|ELSE|ENDIF)\b/i;
    const mnemonic = /\b(?:ld|push|pop|ex|inc|dec|jp|jr|call|ret|nop)\b/i;
    const registro = /\b(?:a|b|c|d|e|h|l|ix|iy|sp|pc)\b/i;
    const coma = /,/;
    const numero = /\b\d+\b/;
    const comentarios = /;.*/;
  
    // Definir los diferentes flujos posibles
    function startState() {
      return {
        flow: "flow1", // Empezamos con el primer flujo
        step: "directiva" // Primer estado del primer flujo
      };
    }
  
    function switchFlow(state) {
      // Cambia entre flujos al encontrar tokens que no cumplen el flujo actual
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
      if (stream.eatSpace()) return null; // Ignorar espacios
  
      // Comentarios (independientes del flujo o el orden)
      if (stream.match(comentarios)) {
        return "comment";
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
          state.step = "directiva"; // Reiniciar para el siguiente set
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
          state.step = "mnemonic"; // Reiniciar para el siguiente set
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
          state.step = "directiva"; // Reiniciar para el siguiente set
          return "register";
        }
      }
  
      // Si el token está fuera de orden, cambiar flujo
      switchFlow(state);
      stream.next(); // Avanza un carácter para evitar bucles
      return "error"; // Marca como error si no cumple el orden de ningún flujo
    }
  
    return {
      startState: startState,
      token: token
    };
  });
  
  // Inicializar el editor de CodeMirror con el modo "z80_multi_order"
  const editor = CodeMirror(document.getElementById("editor"), {
    mode: "z80_multi_order",
    theme: "default",
    lineNumbers: true,
    tabSize: 4
  });
  