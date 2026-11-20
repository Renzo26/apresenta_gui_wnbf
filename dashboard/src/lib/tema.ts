// Fora do "use client": o layout (servidor) precisa do texto do script, não de uma referência de cliente.
export const CHAVE_TEMA = "dash-tema";
/** Roda antes da pintura: aplica o tema salvo (escuro por padrão), sem piscar. */
export const SCRIPT_TEMA = `(function(){try{var t=localStorage.getItem("${CHAVE_TEMA}");if(t==="light"||t==="dark")document.documentElement.dataset.tema=t}catch(e){}})()`;
