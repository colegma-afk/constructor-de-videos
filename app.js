const el = (id) => document.getElementById(id);

// El material visual usa video_source="pexels": el motor busca automáticamente
// clips de stock reales según las palabras clave que genera del guion, server-
// side. Sirve para cualquier asignatura (a diferencia de un banco fijo de
// clips genéricos, que se probó primero con la biblioteca de la NASA y
// resultó irrelevante fuera de ciencias).

// Mismos 7 perfiles y textos del Automatizador de Adecuaciones Curriculares
// de Brain Schooling (ADAPT_PROFILES en app.js de ese proyecto), para que el
// docente reciba la misma lógica DUA/PIE ya validada ahí, ahora aplicada a
// la generación del guion narrado en vez de a una lección de texto.
const PERFILES_DUA = {
  dua: { nombre: "DUA general", icono: "🌐",
    desc: "Diseño Universal para el Aprendizaje: múltiples formas de representar, expresar y comprometerse.",
    estrategias: ["Presentar la información de forma clara y en pasos.", "Activar conocimientos previos y dar ejemplos cercanos.", "Fraccionar el contenido en partes claras.", "Cerrar con una síntesis de lo esencial."],
    objetivos: ["Mantener el objetivo de aprendizaje del nivel.", "Reforzar los conceptos esenciales de la lección."],
    evaluacion: ["Permitir distintos medios de respuesta (oral, escrito, gráfico).", "Usar criterios de logro claros conocidos de antemano."],
    apoyos: ["Subtítulos siempre activados", "Guion disponible como texto", "Ritmo de narración moderado"] },
  tdah: { nombre: "TDAH · Déficit atencional", icono: "⚡",
    desc: "Dificultades de atención sostenida, impulsividad e hiperactividad.",
    estrategias: ["Segmentar el contenido en bloques cortos con una idea por vez.", "Resaltar verbalmente las ideas clave.", "Dar instrucciones breves y concretas, de a una.", "Reforzar positivamente los logros."],
    objetivos: ["Priorizar 2-3 ideas centrales del video.", "Reducir la carga de contenido simultáneo."],
    evaluacion: ["Evaluaciones más breves o por partes.", "Recordar consignas y dar tiempo extra.", "Evitar penalizar la ortografía en pruebas de contenido."],
    apoyos: ["Video corto (duración forzada a 'corta')", "Idea principal repetida al cierre", "Ubicación libre de distractores al ver el video"] },
  tea: { nombre: "TEA · Espectro autista", icono: "🧠",
    desc: "Diferencias en comunicación social y necesidad de estructura y anticipación.",
    estrategias: ["Anticipar la secuencia del video ('primero, luego, al final').", "Usar lenguaje literal y directo, evitando dobles sentidos e ironías.", "Evitar sorpresas o cambios abruptos de tema.", "Mantener una estructura predecible."],
    objetivos: ["Conservar el objetivo, explicitando cada paso.", "Definir con claridad qué se espera lograr."],
    evaluacion: ["Instrucciones explícitas y ejemplos del formato esperado.", "Entornos predecibles y sin sorpresas.", "Aceptar formas alternativas de expresión."],
    apoyos: ["Estructura anunciada al inicio del video", "Lenguaje literal, sin dobles sentidos", "Subtítulos siempre activados"] },
  dislexia: { nombre: "Dislexia", icono: "📖",
    desc: "Dificultad específica en la lectura y decodificación de palabras.",
    estrategias: ["Priorizar la narración en voz alta por sobre la lectura de subtítulos.", "Narrar más lento y con pausas claras entre ideas.", "Evitar oraciones largas o subordinadas complejas.", "Reforzar oralmente, no solo por texto en pantalla."],
    objetivos: ["Mantener el objetivo; adecuar el acceso a la lectura.", "Valorar la comprensión por sobre la fluidez lectora."],
    evaluacion: ["Leer las preguntas en voz alta o dar audio.", "No descontar por errores ortográficos.", "Permitir respuestas orales."],
    apoyos: ["Narración más lenta (ritmo reducido)", "Oraciones cortas y directas", "Subtítulos como apoyo, no como única vía"] },
  di: { nombre: "Discapacidad intelectual", icono: "💡",
    desc: "Requiere lenguaje sencillo (lectura fácil) y aprendizajes funcionales.",
    estrategias: ["Usar frases cortas y vocabulario simple (lectura fácil).", "Presentar una idea concreta por vez con ejemplos cotidianos.", "Repetir y reforzar la idea principal.", "Relacionar el contenido con la vida diaria."],
    objetivos: ["Priorizar los aprendizajes esenciales y funcionales.", "Adecuar el objetivo si es necesario (PACI)."],
    evaluacion: ["Evaluar los contenidos priorizados con apoyos.", "Usar preguntas concretas y material visual.", "Valorar el progreso individual."],
    apoyos: ["Narración más lenta (ritmo reducido)", "Vocabulario simple y ejemplos cotidianos", "Idea principal repetida"] },
  discalculia: { nombre: "Discalculia", icono: "🔢",
    desc: "Dificultad específica con los números y el razonamiento matemático.",
    estrategias: ["Descomponer los procedimientos en pasos numerados y narrados.", "Dar ejemplos resueltos, uno a la vez, antes de generalizar.", "Usar analogías concretas para representar cantidades.", "Repetir el resultado clave al final de cada paso."],
    objetivos: ["Mantener el objetivo, reforzando el procedimiento paso a paso.", "Priorizar la comprensión sobre el cálculo mental."],
    evaluacion: ["Aceptar el uso de tablas y calculadora.", "Valorar el procedimiento, no solo el resultado.", "Dar más tiempo."],
    apoyos: ["Pasos numerados narrados en orden", "Ejemplos concretos antes de generalizar", "Ritmo de narración reducido"] },
  altas: { nombre: "Altas capacidades / talento", icono: "🚀",
    desc: "Aprendizaje rápido que requiere profundización y desafío.",
    estrategias: ["Incluir preguntas de extensión y profundización.", "Conectar el tema con problemas reales y complejos.", "Evitar la repetición innecesaria de lo obvio.", "Cerrar con un desafío o pregunta abierta para investigar."],
    objetivos: ["Ampliar y enriquecer el objetivo del nivel.", "Agregar metas de mayor complejidad."],
    evaluacion: ["Valorar la creatividad y el pensamiento crítico.", "Proponer productos originales.", "Permitir avanzar a su ritmo."],
    apoyos: ["Pregunta de cierre para profundizar", "Conexión con problemas reales", "Video algo más extenso permitido"] },
};

const btnGenerar = el("btnGenerar");
const estadoVacio = el("estadoVacio");
const progresoWrap = el("progresoWrap");
const progresoTexto = el("progresoTexto");
const barraFill = el("barraFill");
const errorWrap = el("errorWrap");
const errorTexto = el("errorTexto");
const videoWrap = el("videoWrap");
const videoPlayer = el("videoPlayer");
const descargarLink = el("descargarLink");
const fichaWrap = el("fichaWrap");
const fichaAdecuacion = el("fichaAdecuacion");
const fichaPedagogica = el("fichaPedagogica");

let pollTimer = null;
let tareaEnCurso = null; // { taskId, apiBase } de la generación activa, o null
let generacionActual = 0; // evita que una ficha pedagógica tardía de una
                            // generación anterior se dibuje sobre una nueva

// Solo oculta/muestra los paneles de ESTADO (vacío/progreso/error/video), que
// son mutuamente excluyentes. NO toca pollTimer/tareaEnCurso: se llama en
// cada actualización de progreso (cada 3s mientras el video se genera), y si
// cancelara el temporizador aquí se cancelaría a sí mismo en cada tick.
// Las fichas (adecuación/pedagógica) tienen su propio ciclo de vida: viven
// mientras el video se genera y persisten aunque falle, así que no se tocan
// acá — solo se limpian al arrancar una generación nueva (limpiarFichas()).
function resetResultPanel() {
  estadoVacio.hidden = true;
  progresoWrap.hidden = true;
  errorWrap.hidden = true;
  videoWrap.hidden = true;
}

function limpiarFichas() {
  fichaWrap.hidden = true;
  fichaAdecuacion.hidden = true;
  fichaAdecuacion.innerHTML = "";
  fichaPedagogica.hidden = true;
  fichaPedagogica.innerHTML = "";
}

function detenerPolling() {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
  tareaEnCurso = null;
}

function mostrarProgreso(texto, porcentaje) {
  resetResultPanel();
  progresoWrap.hidden = false;
  progresoTexto.textContent = texto;
  barraFill.style.width = `${Math.max(0, Math.min(100, porcentaje))}%`;
}

function mostrarError(mensaje) {
  resetResultPanel();
  errorWrap.hidden = false;
  errorTexto.textContent = mensaje;
}

function mostrarVideo(url, perfilKey) {
  resetResultPanel();
  videoWrap.hidden = false;
  videoPlayer.src = url;
  descargarLink.href = url;
  if (perfilKey && PERFILES_DUA[perfilKey]) {
    renderFichaAdecuacion(PERFILES_DUA[perfilKey]);
  }
}

function listaHtml(items) {
  return `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
}

function renderFichaAdecuacion(p) {
  fichaWrap.hidden = false;
  fichaAdecuacion.hidden = false;
  fichaAdecuacion.innerHTML = `
    <h3>${p.icono} Ficha de adecuación · ${p.nombre}</h3>
    <p>${p.desc}</p>
    <h4>Estrategias aplicadas al guion</h4>
    ${listaHtml(p.estrategias)}
    <h4>Objetivos de aprendizaje</h4>
    ${listaHtml(p.objetivos)}
    <h4>Evaluación adaptada sugerida</h4>
    ${listaHtml(p.evaluacion)}
    <h4>Apoyos aplicados en este video</h4>
    ${listaHtml(p.apoyos)}
    <p class="ficha-nota">Sugerencia automática de referencia (mismo criterio del Automatizador de Adecuaciones de Brain Schooling). Las adecuaciones de objetivos (PACI) deben ser definidas por el equipo PIE y la familia.</p>
  `;
}

function resolverUrl(apiBase, ruta) {
  if (!ruta) return ruta;
  if (ruta.startsWith("http://") || ruta.startsWith("https://")) return ruta;
  return `${apiBase.replace(/\/$/, "")}/${ruta.replace(/^\//, "")}`;
}

async function generarVideo() {
  const tema = el("tema").value.trim();
  if (!tema) {
    mostrarError("Escribe un tema o prompt para el video.");
    return;
  }

  const objetivo = el("objetivo").value.trim();
  const perfilKey = el("perfilDua").value;
  const perfil = perfilKey ? PERFILES_DUA[perfilKey] : null;
  const apiBase = el("apiUrl").value.trim().replace(/\/$/, "");
  const body = {
    video_subject: tema,
    video_language: el("idioma").value,
    video_aspect: el("orientacion").value,
    voice_name: el("voz").value,
    subtitle_enabled: el("subtitulos").checked,
    paragraph_number: Number(el("duracion").value),
    video_source: "pexels",
    // Sin esto el motor mezcla los clips al azar, sin relación con qué se
    // está narrando en cada momento — con esto los busca y ordena según la
    // secuencia real del guion, más coherente para contenido educativo.
    match_materials_to_script: true,
    // Default del motor es 2 threads para codificar; la mayoría de las Mac
    // modernas tienen más núcleos disponibles, así que esto acelera el
    // renderizado sin afectar calidad ni coherencia.
    n_threads: 4,
    // El motor recodifica cada segmento de clip individualmente antes de
    // unirlos (uno por uno, en serie) — con el default de 5s, un guion de
    // ~1 minuto necesita 15+ segmentos separados, y esa es la etapa más
    // lenta de todo el proceso. Con segmentos de 10s se necesita la mitad,
    // cortando esa etapa a más o menos la mitad del tiempo.
    video_clip_duration: 10,
  };

  const promptPartes = [];
  if (objetivo) {
    promptPartes.push(
      `Objetivo de aprendizaje: el estudiante debe poder ${objetivo}. ` +
      `Escribe el guion del video enfocado en lograr ese objetivo, no solo en informar.`
    );
  }
  if (perfil) {
    promptPartes.push(
      `Adapta el guion para un estudiante con perfil "${perfil.nombre}" siguiendo estas ` +
      `estrategias: ${perfil.estrategias.join(" ")}`
    );
  }
  if (promptPartes.length) {
    body.video_script_prompt = promptPartes.join(" ");
  }

  // Ajustes de acceso que sí puede aplicar el motor de video (ritmo de
  // narración y duración), en línea con los "apoyos sugeridos" de cada
  // perfil en Brain Schooling. El guion en sí se adapta vía prompt arriba.
  if (perfilKey === "tdah") {
    body.paragraph_number = 1; // fuerza video corto, un bloque de ideas
  } else if (["dislexia", "di", "discalculia", "tea"].includes(perfilKey)) {
    body.voice_rate = 0.85; // narración más lenta y clara
  }

  detenerPolling();
  limpiarFichas();
  btnGenerar.disabled = true;

  mostrarProgreso("Enviando solicitud al motor de video…", 8);

  let taskId;
  try {
    const resp = await fetch(`${apiBase}/api/v1/videos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const detalle = await resp.text();
      throw new Error(`El servidor respondió ${resp.status}: ${detalle}`);
    }
    const data = await resp.json();
    taskId = data?.data?.task_id;
    if (!taskId) throw new Error("La respuesta no incluyó un task_id.");
  } catch (err) {
    btnGenerar.disabled = false;
    mostrarError(
      `No se pudo conectar con el motor de video en ${apiBase}. ` +
      `Verifica que el servidor MoneyPrinterTurbo esté corriendo. Detalle: ${err.message}`
    );
    return;
  }

  mostrarProgreso("Generando guion, buscando material y renderizando…", 10);
  tareaEnCurso = { taskId, apiBase, perfilKey };

  pollTimer = setInterval(revisarEstadoActual, 3000);

  // Pedido independiente al motor de IA para la ficha pedagógica. No bloquea
  // el video: si falla o tarda, el video se muestra igual sin la ficha.
  generacionActual += 1;
  const miGeneracion = generacionActual;
  solicitarFichaPedagogica(apiBase, tema, objetivo).then((ficha) => {
    if (ficha && miGeneracion === generacionActual) renderFichaPedagogica(ficha);
  });
}

// El endpoint /api/v1/scripts del motor limpia la respuesta del modelo con
// una regex que borra todo lo que quede entre el primer "(" o "[" y el
// último ")" o "]" del texto completo — pensado para narración simple, no
// para datos estructurados (un solo paréntesis en cualquier oración destruye
// una respuesta JSON de varios campos). Por eso la ficha pedagógica usa un
// endpoint propio en el motor, /api/v1/lesson-plan, que reutiliza el mismo
// patrón "JSON limpio vía _generate_response" que ya usa la generación de
// metadata social, sin pasar por ese post-procesado.
async function solicitarFichaPedagogica(apiBase, tema, objetivo) {
  const body = { video_subject: tema, objective: objetivo, language: "es" };
  try {
    const resp = await fetch(`${apiBase}/api/v1/lesson-plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    const plan = data?.data;
    if (!plan || !plan.titulo) return null;
    return {
      titulo: plan.titulo,
      objetivo: plan.objetivo,
      oa: plan.oa,
      habilidades: plan.habilidades || [],
      conocimientosPrevios: plan.conocimientos_previos,
      introduccion: plan.introduccion,
      desarrollo: plan.desarrollo,
      ejemplos: plan.ejemplos || [],
      actividades: plan.actividades || [],
      preguntas: plan.preguntas || [],
      evaluacion: plan.evaluacion,
      cierre: plan.cierre,
      resumen: plan.resumen,
      tarea: plan.tarea,
    };
  } catch (err) {
    return null;
  }
}

function renderFichaPedagogica(ficha) {
  fichaWrap.hidden = false;
  fichaPedagogica.hidden = false;
  const bloque = (titulo, contenido) => {
    if (!contenido || (Array.isArray(contenido) && !contenido.length)) return "";
    const cuerpo = Array.isArray(contenido) ? listaHtml(contenido) : `<p>${contenido}</p>`;
    return `<h4>${titulo}</h4>${cuerpo}`;
  };
  fichaPedagogica.innerHTML = `
    <h3>📋 Ficha pedagógica${ficha.titulo ? ` · ${ficha.titulo}` : ""}</h3>
    ${bloque("Objetivo de aprendizaje", ficha.objetivo)}
    ${bloque("Objetivo de Aprendizaje (OA)", ficha.oa)}
    ${bloque("Habilidades", ficha.habilidades)}
    ${bloque("Conocimientos previos", ficha.conocimientosPrevios)}
    ${bloque("Introducción", ficha.introduccion)}
    ${bloque("Desarrollo", ficha.desarrollo)}
    ${bloque("Ejemplos", ficha.ejemplos)}
    ${bloque("Actividades sugeridas", ficha.actividades)}
    ${bloque("Preguntas para el curso", ficha.preguntas)}
    ${bloque("Evaluación formativa", ficha.evaluacion)}
    ${bloque("Cierre", ficha.cierre)}
    ${bloque("Resumen", ficha.resumen)}
    ${bloque("Tarea", ficha.tarea)}
    <p class="ficha-nota">Generada por IA a partir del mismo tema del video. Revísala antes de usarla en clase.</p>
  `;
}

async function revisarEstadoActual() {
  if (!tareaEnCurso) return;
  const { taskId, apiBase, perfilKey } = tareaEnCurso;
  try {
    const resp = await fetch(`${apiBase}/api/v1/tasks/${taskId}`);
    if (!resp.ok) throw new Error(`estado ${resp.status}`);
    const data = await resp.json();
    const task = data?.data;
    if (!task) return;

    const progreso = task.progress ?? 0;
    const state = task.state;

    if (state === 1) {
      detenerPolling();
      btnGenerar.disabled = false;
      // IMPORTANTE: usar `videos` (final-1.mp4) — es el archivo terminado, con
      // narración y subtítulos incrustados. `combined_videos` (combined-1.mp4)
      // es el intermedio: solo los clips pegados, SIN audio y SIN subtítulos.
      // Priorizar combined_videos mostraba el video mudo y sin texto.
      const video = task.videos?.[0] ?? task.combined_videos?.[0];
      if (video) {
        mostrarVideo(resolverUrl(apiBase, video), perfilKey);
      } else {
        mostrarError("El video terminó de procesar pero no se encontró el archivo final.");
      }
    } else if (state === -1) {
      detenerPolling();
      btnGenerar.disabled = false;
      const etapa = task.failed_stage ? ` (etapa: ${task.failed_stage})` : "";
      mostrarError((task.error || "La generación del video falló.") + etapa);
    } else {
      mostrarProgreso("Generando guion, buscando material y renderizando…", progreso || 10);
    }
  } catch (err) {
    // Silenciamos errores puntuales de polling; seguimos intentando.
  }
}

// Los navegadores pausan setInterval en pestañas en segundo plano. Al volver
// a la pestaña, forzamos una revisión inmediata para no quedar "pegados" en
// Generando... si la tarea ya terminó (o falló) mientras no se miraba.
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && tareaEnCurso) {
    revisarEstadoActual();
  }
});

btnGenerar.addEventListener("click", generarVideo);

// ---- Banco de temas (textos escolares MINEDUC + sitios educativos) ----

function initBancoTemas() {
  const selNivel = el("bancoNivel");
  const selMateria = el("bancoMateria");
  const selTema = el("bancoTema");
  const btnUsar = el("btnUsarTema");
  const nombresNivel = {
    parvularia: "Educación Parvularia",
    basica: "Educación Básica",
    media: "Enseñanza Media",
  };

  Object.keys(BANCO_TEMAS)
    .filter((k) => k !== "recursos_externos")
    .forEach((nivelKey) => {
      Object.keys(BANCO_TEMAS[nivelKey]).forEach((curso) => {
        const opt = document.createElement("option");
        opt.value = `${nivelKey}|${curso}`;
        opt.textContent = `${nombresNivel[nivelKey] || nivelKey} — ${curso}`;
        selNivel.appendChild(opt);
      });
    });

  selNivel.addEventListener("change", () => {
    selMateria.innerHTML = "";
    selTema.innerHTML = "";
    selTema.disabled = true;
    btnUsar.disabled = true;

    const [nivelKey, curso] = selNivel.value.split("|");
    if (!nivelKey) {
      selMateria.disabled = true;
      selMateria.innerHTML = '<option value="">Elige un nivel primero…</option>';
      return;
    }

    selMateria.disabled = false;
    selMateria.innerHTML = '<option value="">Elige una materia…</option>';
    Object.keys(BANCO_TEMAS[nivelKey][curso]).forEach((materia) => {
      const opt = document.createElement("option");
      opt.value = materia;
      opt.textContent = materia;
      selMateria.appendChild(opt);
    });
  });

  selMateria.addEventListener("change", () => {
    const [nivelKey, curso] = selNivel.value.split("|");
    const materia = selMateria.value;
    selTema.innerHTML = "";
    if (!materia) {
      selTema.disabled = true;
      btnUsar.disabled = true;
      selTema.innerHTML = '<option value="">Elige una materia primero…</option>';
      return;
    }
    selTema.disabled = false;
    btnUsar.disabled = false;
    BANCO_TEMAS[nivelKey][curso][materia].forEach((tema) => {
      const opt = document.createElement("option");
      opt.value = tema;
      opt.textContent = tema;
      selTema.appendChild(opt);
    });
  });

  btnUsar.addEventListener("click", () => {
    const [nivelKey, curso] = selNivel.value.split("|");
    const materia = selMateria.value;
    const tema = selTema.value;
    if (!tema) return;
    const nivelLabel = nombresNivel[nivelKey] || nivelKey;
    el("tema").value = `${tema} (${materia}, ${curso} — ${nivelLabel})`;
  });

  const contenedorRecursos = el("recursosExternos");
  (BANCO_TEMAS.recursos_externos || []).forEach((sitio) => {
    const a = document.createElement("a");
    a.href = sitio.url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.title = sitio.cobertura;
    a.textContent = sitio.nombre;
    contenedorRecursos.appendChild(a);
  });
}

initBancoTemas();

// ---- Perfil de adecuación DUA (Automatizador de Brain Schooling) ----

function initPerfilesDua() {
  const sel = el("perfilDua");
  const desc = el("perfilDuaDesc");

  Object.entries(PERFILES_DUA).forEach(([key, p]) => {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = `${p.icono} ${p.nombre}`;
    sel.appendChild(opt);
  });

  sel.addEventListener("change", () => {
    const p = PERFILES_DUA[sel.value];
    if (!p) {
      desc.hidden = true;
      return;
    }
    desc.hidden = false;
    desc.textContent = `${p.icono} ${p.desc}`;
  });
}

initPerfilesDua();

// ---- Recordar la URL del motor (localhost o el servidor en Render) ----

const APIURL_STORAGE_KEY = "constructorVideos.apiUrl";

function initApiUrl() {
  const input = el("apiUrl");
  const guardada = localStorage.getItem(APIURL_STORAGE_KEY);
  if (guardada) input.value = guardada;
  input.addEventListener("change", () => {
    localStorage.setItem(APIURL_STORAGE_KEY, input.value.trim());
  });
}

initApiUrl();
