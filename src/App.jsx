import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, Play, Pause, Download, X, Plus, Trash2, Loader2, Film, Circle,
  Upload, Image as ImageIcon, ChevronLeft, ChevronRight, ArrowLeft,
  Sparkles, Calendar as CalendarIcon, LayoutGrid, MessageCircle, Info,
} from "lucide-react";

// =====================================================================
// CONSTANTES GENERALES
// =====================================================================

const ACCENTS = [
  { name: "Esmeralda", value: "#10b981" },
  { name: "Cian", value: "#06b6d4" },
  { name: "Ámbar", value: "#f59e0b" },
  { name: "Coral", value: "#f43f5e" },
  { name: "Violeta", value: "#8b5cf6" },
];

// Formatos/medidas disponibles para imagen y video.
const FORMATS = {
  story: { w: 1080, h: 1920, label: "9:16 · Historia / Reel" },
  post: { w: 1080, h: 1080, label: "1:1 · Post cuadrado" },
  portrait: { w: 1080, h: 1350, label: "4:5 · Post vertical" },
};

const CATEGORY_STYLES = {
  festiva: { label: "Fecha festiva", color: "#10b981" },
  espectaculo: { label: "Espectáculo", color: "#8b5cf6" },
  deportivo: { label: "Deportivo", color: "#0ea5e9" },
};

const CONTENT_TYPE_STYLES = {
  educativo: { label: "Educativo", cls: "text-sky-400 bg-sky-500/10" },
  inspiracional: { label: "Inspiracional", cls: "text-violet-400 bg-violet-500/10" },
  entretenimiento: { label: "Entretenimiento", cls: "text-amber-400 bg-amber-500/10" },
  promocional: { label: "Promocional", cls: "text-emerald-400 bg-emerald-500/10" },
};

// Videos de prueba (contenido genérico de librerías públicas, solo para
// probar el diseño de la placa cuando todavía no elegiste un video real).
const SAMPLE_VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
];

// Ejemplos rápidos para arrancar (con contenido para placa promocional).
const EXAMPLES = [
  {
    name: "Fórmula 1 · San Pablo",
    video: SAMPLE_VIDEOS[0],
    photoQuery: "Formula 1 racing track",
    badge: "3 FECHAS INCLUIDAS",
    title: "FÓRMULA 1\nSAN PABLO 2026",
    bullets: ["Entrada sector G", "Traslado hotel ↔ circuito (3 días)", "Asistencia al viajero incluida"],
    priceLabel: "Precio en base doble",
    price: "USD 2.100",
    accent: "#f43f5e",
  },
  {
    name: "Playas · Cancún",
    video: SAMPLE_VIDEOS[1],
    photoQuery: "Cancun beach turquoise water",
    badge: "TODO INCLUIDO",
    title: "CANCÚN\n7 NOCHES",
    bullets: ["Vuelos ida y vuelta", "Hotel 5★ frente al mar", "Desayuno, almuerzo y cena"],
    priceLabel: "Precio por persona en base doble",
    price: "USD 1.350",
    accent: "#06b6d4",
  },
  {
    name: "Nieve · Bariloche",
    video: SAMPLE_VIDEOS[2],
    photoQuery: "Bariloche snow mountain",
    badge: "TEMPORADA ALTA",
    title: "BARILOCHE\nSKI WEEK",
    bullets: ["Traslados aeropuerto y a la pista", "Pase de esquí 5 días", "Alojamiento con desayuno"],
    priceLabel: "Precio en base doble",
    price: "USD 980",
    accent: "#8b5cf6",
  },
  {
    name: "Crucero · Caribe",
    video: SAMPLE_VIDEOS[3],
    photoQuery: "Caribbean cruise ship",
    badge: "4 ESCALAS",
    title: "CRUCERO\nPOR EL CARIBE",
    bullets: ["Camarote con balcón", "Todas las comidas a bordo", "Excursión incluida en 2 escalas"],
    priceLabel: "Precio por persona",
    price: "USD 1.690",
    accent: "#f59e0b",
  },
];

// Hash simple y determinístico, usado para elegir siempre el mismo
// video/foto/color de forma consistente para una misma idea.
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

function idea(contentType, dayName, format, ideaText, script, cierre, destinations, badge, title, bullets, priceLabel = "", price = "") {
  return { contentType, dayName, format, idea: ideaText, script, cierre, destinations, badge, title, bullets, priceLabel, price };
}

// =====================================================================
// CALENDARIO DE FECHAS FESTIVAS DE URUGUAY, con 4 ideas ya escritas por
// fecha. ESTRUCTURA de partida: agregá/editá/borrá fechas acá abajo.
// =====================================================================
const URUGUAY_CALENDAR = {
  Enero: [
    {
      day: "1",
      label: "Año Nuevo",
      ideas: [
        idea("educativo", "Año Nuevo", "Carrusel",
          "Checklist de documentación antes de viajar apenas arranca el año.",
          ["Slide 1: 'Antes de viajar en 2026, revisá esto ✅'", "Slide 2-4: pasaporte, seguro de viaje, reserva confirmada", "Slide 5: 'Guardá este post'"],
          "Guardá esta checklist antes de tu próximo viaje ✅",
          ["Punta del Este", "Bariloche"], "CHECKLIST VIAJERO", "EMPEZÁ EL AÑO\nBIEN PREPARADO",
          ["Pasaporte vigente (mín. 6 meses)", "Seguro de viaje contratado", "Reserva de alojamiento confirmada"]),
        idea("inspiracional", "Año Nuevo", "Reel",
          "Reflexión sobre empezar el año con una meta de viaje cumplida.",
          ["Clip de amanecer o brindis", "Texto: 'Este año, elegí vivirlo viajando'"],
          "Este año, elegí vivirlo viajando 🥂✈️",
          [], "NUEVO AÑO, NUEVOS DESTINOS", "2026\nEL AÑO DE VIAJAR",
          ["Cada viaje es una historia nueva", "El mejor propósito: conocer más mundo", "Empezá a planificarlo hoy"]),
        idea("entretenimiento", "Año Nuevo", "Reel",
          "Trivia: '¿Adivinás qué destino recibe más turistas en Año Nuevo?'",
          ["Mostrar 3 pistas visuales de destinos", "Pregunta: '¿cuál es?'", "Revelar la respuesta"],
          "Dejanos tu respuesta en los comentarios 👇",
          ["Punta del Este", "Río de Janeiro", "Bariloche"], "ADIVINÁ EL DESTINO", "¿DÓNDE SE FESTEJA\nMEJOR EL AÑO NUEVO?",
          ["Pista 1: playas y fuegos artificiales", "Pista 2: miles de turistas", "Pista 3: comienza con P"]),
        idea("promocional", "Año Nuevo", "Post",
          "Escapada de Año Nuevo para cerrar el año a pura fiesta.",
          ["Mostrar destino de fiesta", "Resaltar beneficios del paquete", "Cerrar con precio y CTA"],
          "Consultanos y reservá tu lugar para fin de año 🎆",
          ["Punta del Este"], "ESCAPADA DE FIN DE AÑO", "AÑO NUEVO\nEN PUNTA DEL ESTE",
          ["Alojamiento 3 noches", "Traslados incluidos", "Cena de fin de año"], "Precio por persona en base doble", "USD 450"),
      ],
    },
    {
      day: "6",
      label: "Día de Reyes",
      ideas: [
        idea("educativo", "Día de Reyes", "Carrusel",
          "3 destinos ideales para viajar en familia con niños chicos en enero.",
          ["Slide 1: 'Viajar con niños en enero: 3 destinos que sí o sí'", "Slide 2-4: un destino por slide con un tip cada uno"],
          "Guardá este post para armar el viaje familiar 👨‍👩‍👧",
          ["Piriápolis", "Bariloche", "Orlando"], "PARA VIAJAR EN FAMILIA", "DESTINOS PARA\nNIÑOS EN ENERO",
          ["Actividades pensadas para chicos", "Alojamiento familiar", "Trayectos cortos, ideales con niños"]),
        idea("inspiracional", "Día de Reyes", "Reel",
          "El mejor regalo no se envuelve, se vive: reflexión sobre regalar experiencias.",
          ["Clip de una familia abriendo 'regalo' que es un pasaje", "Texto: 'El mejor regalo no se envuelve'"],
          "El mejor regalo no se envuelve, se vive 🎁✈️",
          [], "REGALÁ EXPERIENCIAS", "EL MEJOR REGALO\nES UN VIAJE",
          ["Los juguetes se rompen, los recuerdos no", "Un viaje en familia vale más que un objeto", "Regalá tiempo juntos"]),
        idea("entretenimiento", "Día de Reyes", "Reel",
          "Juego: '¿Qué destino le regalarías a cada signo/personalidad?'",
          ["Mostrar 3 personalidades distintas", "Asignar un destino a cada una con humor"],
          "¿Cuál te tocó a vos? Contanos 👇",
          ["Piriápolis", "Bariloche", "Punta del Este"], "JUGÁ CON NOSOTROS", "¿QUÉ DESTINO TE\nREGALARÍAN LOS REYES?",
          ["Para el aventurero: montaña", "Para el relajado: playa", "Para el curioso: ciudad nueva"]),
        idea("promocional", "Día de Reyes", "Post",
          "Paquete familiar para cerrar las vacaciones de enero por todo lo alto.",
          ["Mostrar destino familiar", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Consultanos por este plan en familia 📩",
          ["Piriápolis"], "PLAN EN FAMILIA", "VACACIONES EN\nFAMILIA · ENERO",
          ["Hotel con pileta", "Media pensión incluida", "Actividades para chicos"], "Precio por persona en base doble", "USD 380"),
      ],
    },
  ],
  Febrero: [
    {
      day: "Variable",
      label: "Carnaval (lunes y martes)",
      ideas: [
        idea("educativo", "Carnaval", "Carrusel",
          "Qué llevar y cómo prepararte para vivir el Carnaval uruguayo.",
          ["Slide 1: 'Vas a Carnaval? Llevá esto'", "Slide 2-4: protector solar, calzado cómodo, efectivo"],
          "Guardá esta lista antes de salir a los tablados 🎭",
          ["Montevideo"], "GUÍA DE CARNAVAL", "CÓMO VIVIR EL\nCARNAVAL URUGUAYO",
          ["Protector solar y gorro", "Calzado cómodo para caminar", "Efectivo para los tablados"]),
        idea("inspiracional", "Carnaval", "Reel",
          "Reflexión sobre la alegría y tradición popular del Carnaval.",
          ["Clip de murgas y color", "Texto sobre la fiesta más larga del mundo"],
          "El Carnaval más largo del mundo se vive así 🎉",
          [], "TRADICIÓN Y COLOR", "CARNAVAL\nSE VIVE UNA VEZ AL AÑO",
          ["Murgas, candombe y color", "Una fiesta que une generaciones", "Una tradición única en el mundo"]),
        idea("entretenimiento", "Carnaval", "Reel",
          "Trivia: '¿Sabías cuántos días dura el Carnaval uruguayo?'",
          ["Pregunta con 3 opciones", "Revelar el dato real (es el más largo del mundo)"],
          "¿La sabías? Contanos en los comentarios 👇",
          ["Montevideo"], "TRIVIA DE CARNAVAL", "¿CUÁNTO DURA EL\nCARNAVAL EN URUGUAY?",
          ["Opción A: 3 días", "Opción B: 40 días", "Opción C: 15 días"]),
        idea("promocional", "Carnaval", "Post",
          "Paquete para vivir el Carnaval en Montevideo o Río de Janeiro.",
          ["Mostrar destino de carnaval", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu lugar para el Carnaval 🎊",
          ["Montevideo", "Río de Janeiro"], "VIVÍ EL CARNAVAL", "CARNAVAL 2026\nEN MOVIMIENTO",
          ["Entradas a tablados/desfile", "Alojamiento incluido", "Traslados incluidos"], "Precio por persona", "USD 520"),
      ],
    },
  ],
  Marzo: [
    {
      day: "19",
      label: "Día de San José",
      ideas: [
        idea("educativo", "Día de San José", "Carrusel",
          "Checklist para aprovechar un fin de semana largo cerca de casa.",
          ["Slide 1: 'Fin de semana largo: no lo desperdicies'", "Slide 2-4: reservar con anticipación, elegir destino corto, armar valija liviana"],
          "Guardá esta checklist para tu próxima escapada corta 🧳",
          ["Colonia del Sacramento", "Punta del Este"], "ESCAPADA CORTA", "APROVECHÁ EL\nFIN DE SEMANA LARGO",
          ["Reservá con anticipación", "Elegí un destino a menos de 3 horas", "Armá una valija liviana"]),
        idea("inspiracional", "Día de San José", "Reel",
          "Reflexión sobre lo valioso de las escapadas cortas.",
          ["Clip de una pareja/amigos en un pueblo pintoresco", "Texto sobre desconectar cerca de casa"],
          "No hace falta ir lejos para desconectar 🌤️",
          [], "CERCA TAMBIÉN ES VIAJAR", "A VECES, LO MEJOR\nESTÁ CERCA",
          ["No hace falta cruzar el océano", "Un fin de semana alcanza para renovar energías", "Descubrí lo que tenés cerca"]),
        idea("entretenimiento", "Día de San José", "Reel",
          "Trivia: '¿Adivinás el pueblo a menos de 3 horas de Montevideo?'",
          ["Mostrar 3 pistas de un pueblo cercano", "Revelar cuál es"],
          "¿Lo adivinaste? Contanos 👇",
          ["Colonia del Sacramento"], "ADIVINÁ EL PUEBLO", "¿CONOCÉS ESTE\nPUEBLO URUGUAYO?",
          ["Pista 1: patrimonio de la humanidad", "Pista 2: calles empedradas", "Pista 3: está sobre el río"]),
        idea("promocional", "Día de San José", "Post",
          "Escapada de fin de semana largo a un destino cercano.",
          ["Mostrar el destino", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu escapada de fin de semana 🚗",
          ["Colonia del Sacramento"], "ESCAPADA DE FIN DE SEMANA", "COLONIA\nEN UN FIN DE SEMANA",
          ["Alojamiento 2 noches", "Traslado incluido", "City tour incluido"], "Precio por persona en base doble", "USD 190"),
      ],
    },
  ],
  Abril: [
    {
      day: "Variable",
      label: "Semana Santa / Viernes Santo",
      ideas: [
        idea("educativo", "Semana Santa", "Carrusel",
          "Checklist para planificar la Semana de Turismo con anticipación.",
          ["Slide 1: 'Semana de Turismo: planificala ya'", "Slide 2-4: reservar con tiempo, elegir destino, revisar el clima"],
          "Guardá esta checklist para tu Semana de Turismo 🗓️",
          ["Punta del Diablo", "Buenos Aires"], "CHECKLIST SEMANA SANTA", "PLANIFICÁ TU\nSEMANA DE TURISMO",
          ["Reservá con anticipación (se llena rápido)", "Elegí el destino según el clima de abril", "Confirmá los feriados exactos del año"]),
        idea("inspiracional", "Semana Santa", "Reel",
          "Reflexión sobre reencuentros familiares en la Semana de Turismo.",
          ["Clip de una familia reunida viajando", "Texto sobre el valor de estar juntos"],
          "La Semana de Turismo es para estar juntos 🤍",
          [], "REENCUENTROS", "UNA SEMANA PARA\nESTAR EN FAMILIA",
          ["El tiempo en familia no tiene precio", "Una semana para desconectar del año", "Armá recuerdos, no solo planes"]),
        idea("entretenimiento", "Semana Santa", "Reel",
          "Juego: 'Adiviná el destino ideal para Semana Santa'",
          ["Mostrar 3 pistas de un destino de temporada baja", "Revelar cuál es"],
          "¿Lo adivinaste? Escribilo en los comentarios 👇",
          ["Punta del Diablo", "Buenos Aires"], "ADIVINÁ EL DESTINO", "¿A DÓNDE IRÍAS\nEN SEMANA SANTA?",
          ["Pista 1: playa tranquila y bohemia", "Pista 2: en la costa este", "Pista 3: ideal para desconectar"]),
        idea("promocional", "Semana Santa", "Post",
          "Escapada de Semana de Turismo con salida grupal.",
          ["Mostrar el destino elegido", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Todavía hay lugares para la Semana de Turismo 🙌",
          ["Punta del Diablo"], "SEMANA DE TURISMO", "PUNTA DEL DIABLO\nSEMANA SANTA",
          ["Alojamiento 4 noches", "Traslados ida y vuelta", "Desayuno incluido"], "Precio por persona en base doble", "USD 340"),
      ],
    },
  ],
  Mayo: [
    {
      day: "1",
      label: "Día del Trabajador",
      ideas: [
        idea("educativo", "Día del Trabajador", "Carrusel",
          "Checklist para aprovechar el feriado y descansar de verdad.",
          ["Slide 1: 'Te ganaste un descanso'", "Slide 2-4: desconectar el celular, elegir un lugar sin apuro, avisar con tiempo en el trabajo"],
          "Guardate este post para tu próximo descanso 🙌",
          ["Termas del Daymán", "Piriápolis"], "MERECÉS DESCANSAR", "CÓMO DESCANSAR\nDE VERDAD",
          ["Elegí un destino sin apuro", "Avisá con tiempo en el trabajo", "Desconectá el celular un rato"]),
        idea("inspiracional", "Día del Trabajador", "Reel",
          "Reflexión sobre el descanso como parte del trabajo bien hecho.",
          ["Clip de alguien relajado en termas o playa", "Texto sobre el valor del descanso"],
          "Descansar también es parte del trabajo bien hecho 💆",
          [], "TE LO MERECÉS", "UN AÑO DE\nESFUERZO MERECE UN DESCANSO",
          ["El descanso no es un lujo, es necesario", "Recargar energías también rinde", "Regalate una pausa"]),
        idea("entretenimiento", "Día del Trabajador", "Reel",
          "Trivia: '¿Cuál de estos destinos tiene aguas termales?'",
          ["Mostrar 3 opciones de destinos", "Revelar cuál tiene termas"],
          "¿Acertaste? Contanos 👇",
          ["Termas del Daymán", "Bariloche", "Piriápolis"], "ADIVINÁ CUÁL ES", "¿CUÁL TIENE\nAGUAS TERMALES?",
          ["Opción A: Piriápolis", "Opción B: Termas del Daymán", "Opción C: Bariloche"]),
        idea("promocional", "Día del Trabajador", "Post",
          "Escapada de descanso a las termas por el feriado largo.",
          ["Mostrar destino de termas", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Te ganaste este descanso, reservalo 🙌",
          ["Termas del Daymán"], "ESCAPADA DE DESCANSO", "TERMAS DEL DAYMÁN\nFIN DE SEMANA",
          ["Alojamiento con acceso a termas", "Traslados incluidos", "Desayuno incluido"], "Precio por persona en base doble", "USD 210"),
      ],
    },
    {
      day: "18",
      label: "Batalla de las Piedras",
      ideas: [
        idea("educativo", "Batalla de las Piedras", "Carrusel",
          "Turismo histórico: sitios para conocer los orígenes de Uruguay.",
          ["Slide 1: 'Conocé la historia uruguaya viajando'", "Slide 2-4: un sitio histórico por slide"],
          "Guardá este recorrido histórico 🇺🇾",
          ["Las Piedras", "Colonia del Sacramento"], "TURISMO HISTÓRICO", "LUGARES PARA\nCONOCER NUESTRA HISTORIA",
          ["Monumento a la Batalla de las Piedras", "Barrio histórico de Colonia", "Museos históricos de Montevideo"]),
        idea("inspiracional", "Batalla de las Piedras", "Reel",
          "Reflexión sobre el orgullo de conocer las raíces propias viajando.",
          ["Clip de monumentos y banderas", "Texto sobre valorar la propia historia"],
          "Conocer nuestra historia también es viajar 🇺🇾",
          [], "RAÍCES", "CONOCER NUESTRAS\nRAÍCES, VIAJANDO",
          ["Valorar de dónde venimos", "La historia se recorre, no solo se lee", "Un orgullo que se puede visitar"]),
        idea("entretenimiento", "Batalla de las Piedras", "Reel",
          "Trivia: '¿En qué año fue la Batalla de las Piedras?'",
          ["Pregunta con 3 opciones de año", "Revelar el año correcto (1811)"],
          "¿La sabías? Contanos 👇",
          ["Las Piedras"], "TRIVIA HISTÓRICA", "¿EN QUÉ AÑO FUE\nLA BATALLA?",
          ["Opción A: 1811", "Opción B: 1825", "Opción C: 1830"]),
        idea("promocional", "Batalla de las Piedras", "Post",
          "Tour histórico por Uruguay para el feriado.",
          ["Mostrar sitios históricos", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu recorrido histórico 🇺🇾",
          ["Colonia del Sacramento"], "TOUR HISTÓRICO", "RECORRIDO\nPATRIA URUGUAYA",
          ["Guía especializado incluido", "Traslados incluidos", "Entradas a museos incluidas"], "Precio por persona", "USD 95"),
      ],
    },
    {
      day: "2do domingo",
      label: "Día de la Madre",
      ideas: [
        idea("educativo", "Día de la Madre", "Carrusel",
          "Ideas de regalo-experiencia para el Día de la Madre.",
          ["Slide 1: 'No sabés qué regalarle a mamá?'", "Slide 2-4: spa, escapada de un día, viaje juntos"],
          "Guardá estas ideas antes del Día de la Madre 💐",
          ["Termas del Daymán", "Punta del Este"], "IDEAS DE REGALO", "QUÉ REGALARLE\nA MAMÁ",
          ["Día de spa y relax", "Escapada de un día juntas", "Un viaje para compartir"]),
        idea("inspiracional", "Día de la Madre", "Reel",
          "Historia de una familia que viajó junto a su mamá y lo que significó.",
          ["Clip de una mamá e hijos viajando juntos", "Texto: 'El mejor regalo, tiempo juntos'"],
          "El mejor regalo para mamá es tiempo juntos 🤍",
          [], "PARA MAMÁ", "EL REGALO QUE\nSE RECUERDA SIEMPRE",
          ["Un viaje se recuerda toda la vida", "Mucho más que un objeto", "Tiempo de calidad en familia"]),
        idea("entretenimiento", "Día de la Madre", "Reel",
          "Juego: '¿Qué tipo de viaje le regalarías a tu mamá?'",
          ["Mostrar 3 estilos de mamá con humor", "Asignar un destino a cada estilo"],
          "¿Cuál es tu mamá? Contanos 👇",
          ["Termas del Daymán", "Punta del Este"], "JUGÁ CON NOSOTROS", "¿QUÉ VIAJE LE\nREGALARÍAS A MAMÁ?",
          ["La relajada: termas", "La aventurera: montaña", "La social: ciudad con vida nocturna"]),
        idea("promocional", "Día de la Madre", "Post",
          "Paquete especial de spa y relax para regalar el Día de la Madre.",
          ["Mostrar destino de spa/relax", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Regalale una escapada a mamá 💐",
          ["Termas del Daymán"], "REGALO PARA MAMÁ", "ESCAPADA DE SPA\nPARA MAMÁ",
          ["1 noche con acceso a termas", "Tratamiento de spa incluido", "Desayuno incluido"], "Precio por persona", "USD 150"),
      ],
    },
    {
      day: "25",
      label: "Disolución de la Junta Gubernativa",
      ideas: [
        idea("educativo", "25 de Mayo", "Carrusel",
          "Turismo histórico y patrimonial para conocer en un feriado.",
          ["Slide 1: 'Un feriado, mucha historia'", "Slide 2-4: sitios patrimoniales para visitar"],
          "Guardá este recorrido para el feriado 🏛️",
          ["Montevideo", "Colonia del Sacramento"], "TURISMO PATRIMONIAL", "SITIOS PARA\nCONOCER EN EL FERIADO",
          ["Casco histórico de Montevideo", "Barrio histórico de Colonia", "Museos patrimoniales"]),
        idea("inspiracional", "25 de Mayo", "Reel",
          "Reflexión sobre aprovechar los feriados para conocer el propio país.",
          ["Clip de lugares históricos uruguayos", "Texto sobre redescubrir lo local"],
          "A veces lo más lindo está a la vuelta de casa 🇺🇾",
          [], "REDESCUBRÍ URUGUAY", "NO HACE FALTA\nIR LEJOS PARA VIAJAR",
          ["Uruguay tiene mucho para descubrir", "Un feriado alcanza para sorprenderte", "Turismo local también es viajar"]),
        idea("entretenimiento", "25 de Mayo", "Reel",
          "Trivia sobre patrimonio histórico uruguayo.",
          ["Pregunta con 3 opciones sobre patrimonio", "Revelar la respuesta correcta"],
          "¿La sabías? Contanos 👇",
          ["Colonia del Sacramento"], "TRIVIA PATRIMONIO", "¿QUÉ CIUDAD ES\nPATRIMONIO DE LA HUMANIDAD?",
          ["Opción A: Colonia del Sacramento", "Opción B: Salto", "Opción C: Rocha"]),
        idea("promocional", "25 de Mayo", "Post",
          "Escapada de un feriado para descubrir el patrimonio uruguayo.",
          ["Mostrar destino patrimonial", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu escapada patrimonial 🏛️",
          ["Colonia del Sacramento"], "ESCAPADA PATRIMONIAL", "UN DÍA EN\nCOLONIA DEL SACRAMENTO",
          ["Traslado ida y vuelta", "Guía turístico incluido", "Almuerzo incluido"], "Precio por persona", "USD 85"),
      ],
    },
  ],
  Junio: [
    {
      day: "5",
      label: "Día Mundial del Medio Ambiente",
      ideas: [
        idea("educativo", "Día Mundial del Medio Ambiente", "Reel",
          "3 destinos para reconectar con la naturaleza de forma responsable.",
          ["Clip 1: Costa Rica — selva y biodiversidad", "Clip 2: Patagonia — glaciares y trekking responsable", "Clip 3: Galápagos — fauna única y turismo regulado"],
          "Viajar también puede ser cuidar el planeta 🌱",
          ["Costa Rica", "Patagonia", "Galápagos"], "TURISMO SUSTENTABLE", "DESTINOS PARA\nRECONECTAR",
          ["Reservas naturales protegidas", "Guías locales certificados", "Alojamientos eco-friendly"]),
        idea("inspiracional", "Día Mundial del Medio Ambiente", "Reel",
          "Reflexión sobre viajar con respeto por el planeta.",
          ["Clip de paisajes naturales intactos", "Texto sobre viajar dejando huella positiva"],
          "El mejor souvenir es no dejar huella 🌍",
          [], "VIAJAR CON CONCIENCIA", "CUIDAR EL PLANETA\nTAMBIÉN ES VIAJAR",
          ["Elegí destinos y proveedores responsables", "Cada decisión de viaje importa", "Disfrutar la naturaleza sin dañarla"]),
        idea("entretenimiento", "Día Mundial del Medio Ambiente", "Reel",
          "Trivia: '¿Cuál de estos destinos tiene turismo regulado por su fauna única?'",
          ["Mostrar 3 destinos naturales", "Revelar cuál es Galápagos y por qué"],
          "¿Lo sabías? Contanos 👇",
          ["Galápagos", "Costa Rica", "Patagonia"], "ADIVINÁ CUÁL ES", "¿DÓNDE EL TURISMO\nESTÁ REGULADO?",
          ["Pista 1: islas únicas en el mundo", "Pista 2: cupos limitados por día", "Pista 3: en el Pacífico"]),
        idea("promocional", "Día Mundial del Medio Ambiente", "Post",
          "Paquete a Costa Rica con foco en ecoturismo.",
          ["Mostrar selva y biodiversidad", "Resaltar beneficios sustentables", "Cerrar con precio y CTA"],
          "Reservá tu viaje sustentable 🌱",
          ["Costa Rica"], "ECOTURISMO", "COSTA RICA\nEXPERIENCIA SUSTENTABLE",
          ["Alojamiento eco-friendly", "Excursiones con guías certificados", "Compensación de huella de carbono"], "Precio por persona en base doble", "USD 1.890"),
      ],
    },
    {
      day: "20",
      label: "Día de la Bandera",
      ideas: [
        idea("educativo", "Día de la Bandera", "Carrusel",
          "Lugares para conocer los símbolos patrios uruguayos.",
          ["Slide 1: 'Conocé la historia de nuestra bandera'", "Slide 2-4: monumentos y museos patrios"],
          "Guardá este recorrido patriótico 🇺🇾",
          ["Montevideo"], "SÍMBOLOS PATRIOS", "LUGARES PARA\nCONOCER NUESTRA BANDERA",
          ["Plaza Independencia", "Museo Histórico Nacional", "Fortaleza del Cerro"]),
        idea("inspiracional", "Día de la Bandera", "Reel",
          "Reflexión sobre el orgullo de lo propio.",
          ["Clip de la bandera uruguaya flameando", "Texto sobre identidad y pertenencia"],
          "Nuestra bandera, nuestra identidad 🇺🇾",
          [], "ORGULLO URUGUAYO", "LO NUESTRO\nTAMBIÉN SE VISITA",
          ["Cada símbolo tiene una historia", "Conocer el país propio también enorgullece", "Identidad que se puede recorrer"]),
        idea("entretenimiento", "Día de la Bandera", "Reel",
          "Trivia: '¿Quién diseñó la bandera uruguaya?'",
          ["Pregunta con 3 opciones", "Revelar la respuesta correcta"],
          "¿La sabías? Contanos 👇",
          ["Montevideo"], "TRIVIA PATRIA", "¿QUIÉN CREÓ\nNUESTRA BANDERA?",
          ["Opción A: Joaquín Suárez", "Opción B: José Artigas", "Opción C: José Gervasio"]),
        idea("promocional", "Día de la Bandera", "Post",
          "City tour patriótico por Montevideo.",
          ["Mostrar sitios patrios de Montevideo", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu city tour patriótico 🇺🇾",
          ["Montevideo"], "CITY TOUR PATRIO", "MONTEVIDEO\nRUTA DE LA BANDERA",
          ["Guía especializado incluido", "Traslados incluidos", "Entradas a museos incluidas"], "Precio por persona", "USD 60"),
      ],
    },
  ],
  Julio: [
    {
      day: "9",
      label: "Independencia Nacional",
      ideas: [
        idea("educativo", "Independencia Nacional", "Carrusel",
          "Checklist para armar tu escapada del feriado de Independencia.",
          ["Slide 1: 'Feriado largo: planificalo ya'", "Slide 2-4: reservar con tiempo, revisar el clima de julio, elegir destino"],
          "Guardá esta checklist para el feriado 🇺🇾",
          ["Bariloche", "Buenos Aires"], "CHECKLIST FERIADO", "PLANIFICÁ TU\nFERIADO DE JULIO",
          ["Reservá con anticipación", "Revisá el clima de invierno", "Elegí destino de nieve o ciudad"]),
        idea("inspiracional", "Independencia Nacional", "Reel",
          "Reflexión sobre la libertad de elegir cómo y a dónde viajar.",
          ["Clip de paisajes de invierno o ciudad", "Texto sobre libertad y viaje"],
          "La libertad también se viaja ✈️🇺🇾",
          [], "LIBERTAD DE VIAJAR", "CELEBRÁ LA\nINDEPENDENCIA VIAJANDO",
          ["Elegir a dónde ir es un privilegio", "Cada viaje, una decisión libre", "Aprovechá el feriado a tu manera"]),
        idea("entretenimiento", "Independencia Nacional", "Reel",
          "Trivia: '¿En qué año se declaró la independencia de Uruguay?'",
          ["Pregunta con 3 opciones de año", "Revelar el año correcto (1825)"],
          "¿La sabías? Contanos 👇",
          ["Montevideo"], "TRIVIA PATRIA", "¿EN QUÉ AÑO FUE\nLA INDEPENDENCIA?",
          ["Opción A: 1825", "Opción B: 1811", "Opción C: 1830"]),
        idea("promocional", "Independencia Nacional", "Post",
          "Escapada de nieve para el feriado largo de julio.",
          ["Mostrar destino de nieve", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Quedan pocos lugares para el feriado ❄️",
          ["Bariloche"], "ESCAPADA DE INVIERNO", "BARILOCHE\nFERIADO DE JULIO",
          ["Alojamiento con desayuno", "Traslados aeropuerto incluidos", "Pase de un día de ski"], "Precio por persona en base doble", "USD 890"),
      ],
    },
    {
      day: "12",
      label: "Día del Padre",
      ideas: [
        idea("educativo", "Día del Padre", "Carrusel",
          "Ideas de regalo-experiencia para el Día del Padre.",
          ["Slide 1: 'No sabés qué regalarle a papá?'", "Slide 2-4: pesca, golf, aventura, viaje juntos"],
          "Guardá estas ideas antes del Día del Padre 🎣",
          ["Bariloche", "Punta del Este"], "IDEAS DE REGALO", "QUÉ REGALARLE\nA PAPÁ",
          ["Excursión de pesca o golf", "Escapada de aventura", "Un viaje para compartir juntos"]),
        idea("inspiracional", "Día del Padre", "Reel",
          "Historia de un padre e hijo que viajaron juntos y lo que dejó esa experiencia.",
          ["Clip de un padre e hijo viajando juntos", "Texto: 'El mejor regalo, tiempo juntos'"],
          "El mejor regalo para papá es tiempo juntos 🤍",
          [], "PARA PAPÁ", "EL REGALO QUE\nSE RECUERDA SIEMPRE",
          ["Un viaje se recuerda toda la vida", "Mucho más que un objeto", "Tiempo de calidad en familia"]),
        idea("entretenimiento", "Día del Padre", "Reel",
          "Juego: '¿Qué tipo de viaje le regalarías a tu papá?'",
          ["Mostrar 3 estilos de papá con humor", "Asignar un destino a cada estilo"],
          "¿Cuál es tu papá? Contanos 👇",
          ["Bariloche", "Punta del Este"], "JUGÁ CON NOSOTROS", "¿QUÉ VIAJE LE\nREGALARÍAS A PAPÁ?",
          ["El pescador: Bariloche", "El golfista: Punta del Este", "El aventurero: Patagonia"]),
        idea("promocional", "Día del Padre", "Post",
          "Paquete de pesca y aventura para regalar el Día del Padre.",
          ["Mostrar destino de pesca/aventura", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Regalale una escapada a papá 🎣",
          ["Bariloche"], "REGALO PARA PAPÁ", "ESCAPADA DE PESCA\nPARA PAPÁ",
          ["2 noches de alojamiento", "Excursión de pesca incluida", "Desayuno incluido"], "Precio por persona", "USD 320"),
      ],
    },
  ],
  Agosto: [
    {
      day: "3er domingo",
      label: "Día del Niño",
      ideas: [
        idea("educativo", "Día del Niño", "Carrusel",
          "Checklist para viajar con niños sin contratiempos.",
          ["Slide 1: 'Viajar con niños: no te olvides de esto'", "Slide 2-4: entretenimiento para el viaje, medicamentos básicos, documentación de menores"],
          "Guardá esta checklist antes de viajar con los chicos ✅",
          ["Orlando", "Bariloche"], "VIAJAR CON NIÑOS", "CHECKLIST PARA\nVIAJAR CON CHICOS",
          ["Entretenimiento para el viaje", "Botiquín básico", "Documentación de menores al día"]),
        idea("inspiracional", "Día del Niño", "Reel",
          "Reflexión sobre los recuerdos de infancia que dejan los viajes en familia.",
          ["Clip de niños jugando en un destino familiar", "Texto sobre recuerdos de infancia"],
          "Los mejores recuerdos de infancia se viajan 🎈",
          [], "RECUERDOS DE INFANCIA", "LOS VIAJES QUE\nNUNCA SE OLVIDAN",
          ["La infancia se recuerda en fotos y viajes", "Un parque temático, una playa, un momento", "Regalales una aventura"]),
        idea("entretenimiento", "Día del Niño", "Reel",
          "Juego: '¿Qué destino familiar te gustaría conocer?'",
          ["Mostrar 3 destinos familiares con imágenes llamativas", "Pedir que elijan uno en comentarios"],
          "¿Cuál elegís? Contanos 👇",
          ["Orlando", "Bariloche", "Piriápolis"], "ELEGÍ TU DESTINO", "¿A DÓNDE TE\nGUSTARÍA IR?",
          ["Opción A: parque temático", "Opción B: montaña con nieve", "Opción C: playa con toboganes"]),
        idea("promocional", "Día del Niño", "Post",
          "Paquete familiar a un destino con actividades para chicos.",
          ["Mostrar destino familiar", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Regalales una aventura en familia 🎈",
          ["Piriápolis"], "PLAN FAMILIAR", "ESCAPADA FAMILIAR\nCON LOS CHICOS",
          ["Hotel con pileta y juegos", "Media pensión incluida", "Actividades para niños incluidas"], "Precio por persona en base doble", "USD 260"),
      ],
    },
  ],
  Septiembre: [],
  Octubre: [
    {
      day: "12",
      label: "Día de la Raza",
      ideas: [
        idea("educativo", "Día de la Raza", "Carrusel",
          "Destinos para conocer la diversidad cultural de Latinoamérica.",
          ["Slide 1: 'Diversidad cultural para descubrir'", "Slide 2-4: un destino cultural por slide"],
          "Guardá este recorrido cultural 🌎",
          ["Cusco", "Oaxaca", "San Pedro de Atacama"], "TURISMO CULTURAL", "DESTINOS PARA\nCONOCER NUESTRAS RAÍCES",
          ["Cusco y el legado inca", "Oaxaca y su tradición viva", "San Pedro de Atacama y su cultura ancestral"]),
        idea("inspiracional", "Día de la Raza", "Reel",
          "Reflexión sobre el encuentro cultural que regala viajar.",
          ["Clip de mercados y artesanías locales", "Texto sobre el valor de conocer otras culturas"],
          "Viajar es también aprender a mirar distinto 🌎",
          [], "ENCUENTRO CULTURAL", "CADA CULTURA\nTIENE ALGO PARA ENSEÑARNOS",
          ["Conocer otras culturas abre la cabeza", "El respeto empieza por conocer", "Cada viaje, un aprendizaje"]),
        idea("entretenimiento", "Día de la Raza", "Reel",
          "Trivia: '¿A qué cultura pertenece Machu Picchu?'",
          ["Pregunta con 3 opciones", "Revelar la respuesta correcta (Inca)"],
          "¿La sabías? Contanos 👇",
          ["Cusco"], "TRIVIA CULTURAL", "¿DE QUÉ CULTURA\nES MACHU PICCHU?",
          ["Opción A: Inca", "Opción B: Maya", "Opción C: Azteca"]),
        idea("promocional", "Día de la Raza", "Post",
          "Paquete cultural a Cusco y Machu Picchu.",
          ["Mostrar Cusco y Machu Picchu", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu viaje cultural a Perú 🌎",
          ["Cusco"], "VIAJE CULTURAL", "CUSCO Y\nMACHU PICCHU",
          ["Guía especializado incluido", "Entrada a Machu Picchu incluida", "Traslados incluidos"], "Precio por persona en base doble", "USD 1.190"),
      ],
    },
  ],
  Noviembre: [
    {
      day: "2",
      label: "Día de Difuntos",
      ideas: [
        idea("educativo", "Día de Difuntos", "Carrusel",
          "Sitios patrimoniales e históricos que vale la pena conocer.",
          ["Slide 1: 'Patrimonio y memoria para conocer'", "Slide 2-4: cementerios y sitios históricos destacados"],
          "Guardá este recorrido patrimonial 🕯️",
          ["Buenos Aires", "Montevideo"], "TURISMO PATRIMONIAL", "SITIOS DE MEMORIA\nPARA CONOCER",
          ["Cementerio de la Recoleta, Buenos Aires", "Cementerio Central, Montevideo", "Arquitectura y arte funerario histórico"]),
        idea("inspiracional", "Día de Difuntos", "Reel",
          "Reflexión serena sobre la memoria y los seres queridos.",
          ["Clip suave de un lugar sereno o patrimonial", "Texto reflexivo sobre la memoria"],
          "Honrar la memoria también es parte del camino 🕯️",
          [], "MEMORIA", "UN MOMENTO PARA\nRECORDAR",
          ["La memoria también se honra viajando", "Un espacio para el recuerdo y la calma", "Momentos para valorar lo vivido"]),
        idea("entretenimiento", "Día de Difuntos", "Post",
          "Dato curioso sobre patrimonio histórico funerario (formato suave, sin humor pesado).",
          ["Presentar un dato curioso e histórico", "Invitar a comentar si lo conocían"],
          "¿Sabías este dato? Contanos 👇",
          ["Buenos Aires"], "DATO CURIOSO", "UN DATO QUE\nQUIZÁS NO SABÍAS",
          ["Dato histórico o arquitectónico curioso", "Contexto breve del lugar", "Invitación a descubrirlo en persona"]),
        idea("promocional", "Día de Difuntos", "Post",
          "Escapada cultural y patrimonial a Buenos Aires.",
          ["Mostrar sitios patrimoniales de Buenos Aires", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu escapada cultural a Buenos Aires 🏛️",
          ["Buenos Aires"], "ESCAPADA CULTURAL", "BUENOS AIRES\nRUTA PATRIMONIAL",
          ["Traslados incluidos", "City tour patrimonial incluido", "Alojamiento 2 noches"], "Precio por persona en base doble", "USD 180"),
      ],
    },
  ],
  Diciembre: [
    {
      day: "25",
      label: "Navidad",
      ideas: [
        idea("educativo", "Navidad", "Carrusel",
          "Checklist para viajar tranquilo en la temporada navideña.",
          ["Slide 1: 'Viajás en Navidad? Anotá esto'", "Slide 2-4: reservar con mucha anticipación, revisar equipaje extra por regalos, confirmar horarios especiales"],
          "Guardá esta checklist antes de viajar en Navidad 🎄",
          ["Buenos Aires", "Europa"], "CHECKLIST NAVIDEÑO", "VIAJAR EN\nNAVIDAD SIN ESTRÉS",
          ["Reservá con mucha anticipación", "Sumá espacio extra en la valija por regalos", "Confirmá horarios especiales de la fecha"]),
        idea("inspiracional", "Navidad", "Reel",
          "Reflexión sobre pasar la Navidad en un destino con luces y magia especial.",
          ["Clip de luces navideñas y familias juntas", "Texto sobre la magia de las fiestas viajando"],
          "Esta Navidad, regalate un destino con magia 🎄✨",
          [], "MAGIA NAVIDEÑA", "UNA NAVIDAD\nCON TEMÁTICA ESPECIAL",
          ["Las luces navideñas cambian todo", "Una Navidad distinta, para recordar", "En familia, en otro rincón del mundo"]),
        idea("entretenimiento", "Navidad", "Reel",
          "Juego: '¿Adivinás qué ciudad tiene esta decoración navideña?'",
          ["Mostrar 3 pistas de una ciudad con mercados navideños", "Revelar cuál es"],
          "¿La adivinaste? Contanos 👇",
          ["Buenos Aires", "Viena", "Nueva York"], "ADIVINÁ LA CIUDAD", "¿QUÉ CIUDAD ES\nESTA NAVIDAD?",
          ["Pista 1: mercados navideños famosos", "Pista 2: nieve en las calles", "Pista 3: luces por toda la ciudad"]),
        idea("promocional", "Navidad", "Post",
          "Paquete con temática navideña para viajar en familia.",
          ["Mostrar destino con clima navideño", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
          "Reservá tu Navidad con temática especial 🎄",
          ["Buenos Aires"], "NAVIDAD TEMÁTICA", "NAVIDAD EN\nBUENOS AIRES",
          ["Alojamiento 3 noches", "Cena de Navidad incluida", "Traslados incluidos"], "Precio por persona en base doble", "USD 410"),
      ],
    },
  ],
};

const MONTH_NAMES = Object.keys(URUGUAY_CALENDAR);
const MONTH_INDEX = Object.fromEntries(MONTH_NAMES.map((m, i) => [m, i]));

function buildFestiveEvents() {
  const events = [];
  Object.entries(URUGUAY_CALENDAR).forEach(([monthName, dates]) => {
    dates.forEach((d) => {
      const dayNum = parseInt(d.day, 10);
      events.push({
        id: `festiva-${monthName}-${d.day}-${d.label}`.replace(/\s+/g, "_"),
        name: d.label,
        month: MONTH_INDEX[monthName],
        day: isNaN(dayNum) ? null : dayNum,
        dayLabel: d.day,
        place: "Uruguay",
        isWorldDay: d.label.toLowerCase().includes("mundial"),
        category: "festiva",
        ideas: d.ideas || [],
      });
    });
  });
  return events;
}

// Ejemplos de espectáculos/deportivos (fechas ficticias de ejemplo — la
// idea es que cargues las reales con el botón "+" del calendario).
const SAMPLE_EVENTS = [
  {
    id: "f1-sanpablo",
    name: "Fórmula 1 · GP de San Pablo",
    month: 10, day: 8, dayLabel: "8",
    place: "Autódromo José Carlos Pace, São Paulo",
    isWorldDay: false,
    category: "deportivo",
    ideas: [
      idea("educativo", "F1 San Pablo", "Carrusel",
        "Checklist para ir al Gran Premio de San Pablo.",
        ["Slide 1: portada", "Slide 2-4: entradas, traslado, clima"],
        "Guardá esta checklist antes de viajar a la carrera 🏁",
        ["São Paulo"], "GUÍA DEL GP", "TODO LISTO PARA\nEL GP DE SAN PABLO",
        ["Entrada según sector elegido", "Traslados hotel-circuito", "Ropa liviana + protector solar"]),
      idea("inspiracional", "F1 San Pablo", "Reel",
        "La emoción de vivir una carrera de F1 en vivo.",
        ["Clip de autos a alta velocidad", "Texto sobre la adrenalina en vivo"],
        "Nada se compara con vivirlo en vivo 🏎️",
        [], "ADRENALINA PURA", "VIVILO EN\nPRIMERA FILA",
        ["El rugido de los motores en vivo", "Una experiencia que no se olvida", "Para los fanáticos del automovilismo"]),
      idea("entretenimiento", "F1 San Pablo", "Reel",
        "Trivia: '¿Cuántas vueltas tiene el GP de San Pablo?'",
        ["Pregunta con 3 opciones", "Revelar la respuesta correcta"],
        "¿La sabías? Contanos 👇",
        ["São Paulo"], "TRIVIA F1", "¿CUÁNTAS VUELTAS\nTIENE LA CARRERA?",
        ["Opción A: 71 vueltas", "Opción B: 50 vueltas", "Opción C: 90 vueltas"]),
      idea("promocional", "F1 San Pablo", "Post",
        "Paquete con entrada, traslados y alojamiento para el GP.",
        ["Mostrar el circuito", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
        "Quedan pocos lugares para esta fecha 🏁",
        ["São Paulo"], "3 FECHAS INCLUIDAS", "FÓRMULA 1\nSAN PABLO 2026",
        ["Entrada sector G", "Traslado hotel ↔ circuito (3 días)", "Asistencia al viajero incluida"],
        "Precio en base doble", "USD 2.100"),
    ],
  },
  {
    id: "tini-baires",
    name: "Concierto de Tini en Buenos Aires",
    month: 6, day: 20, dayLabel: "20",
    place: "Movistar Arena, Buenos Aires",
    isWorldDay: false,
    category: "espectaculo",
    ideas: [
      idea("educativo", "Concierto de Tini", "Carrusel",
        "Checklist para ir a un recital en otro país.",
        ["Slide 1: portada", "Slide 2-4: entrada, alojamiento, cambio de moneda"],
        "Guardá esta checklist antes del show 🎤",
        ["Buenos Aires"], "GUÍA DEL RECITAL", "TODO LISTO PARA\nEL SHOW",
        ["Entrada confirmada con código QR", "Alojamiento cerca del estadio", "Cambio de moneda hecho con tiempo"]),
      idea("inspiracional", "Concierto de Tini", "Reel",
        "La emoción de vivir un recital en otro país junto a amigas/os.",
        ["Clip de fans cantando", "Texto sobre la energía compartida"],
        "Algunas experiencias hay que vivirlas en vivo 🎶",
        [], "PARA VIVIRLO", "UNA NOCHE PARA\nRECORDAR SIEMPRE",
        ["La energía de miles cantando juntos", "Un viaje con la excusa perfecta", "Momentos que quedan para siempre"]),
      idea("entretenimiento", "Concierto de Tini", "Reel",
        "Trivia: '¿En qué álbum está tu canción favorita de Tini?'",
        ["Mostrar 3 álbumes", "Invitar a comentar cuál es"],
        "Contanos tu canción favorita 👇",
        ["Buenos Aires"], "TRIVIA MUSICAL", "¿CUÁNTO SABÉS\nDE TINI?",
        ["Álbum 1", "Álbum 2", "Álbum 3"]),
      idea("promocional", "Concierto de Tini", "Post",
        "Paquete con entrada, alojamiento y traslados para el show.",
        ["Mostrar el estadio/artista", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
        "Quedan pocos lugares para este show 🎤",
        ["Buenos Aires"], "SHOW + ESTADÍA", "TINI EN\nBUENOS AIRES",
        ["Entrada al show incluida", "Alojamiento 2 noches", "Traslados aeropuerto incluidos"],
        "Precio por persona en base doble", "USD 480"),
    ],
  },
  {
    id: "dia-muertos-mexico",
    name: "Día de los Muertos",
    month: 10, day: 2, dayLabel: "1-2",
    place: "",
    isWorldDay: false,
    category: "festiva",
    ideas: [
      idea("educativo", "Día de los Muertos", "Carrusel",
        "Qué es y cómo se vive el Día de los Muertos en México.",
        ["Slide 1: portada", "Slide 2-4: origen, altares, Catrinas"],
        "Guardá este post para entender la tradición 💀",
        ["Ciudad de México", "Oaxaca"], "TRADICIÓN MEXICANA", "QUÉ ES EL\nDÍA DE LOS MUERTOS",
        ["Una tradición milenaria", "Altares, flores de cempasúchil y ofrendas", "Patrimonio de la humanidad (UNESCO)"]),
      idea("inspiracional", "Día de los Muertos", "Reel",
        "Reflexión sobre honrar a quienes ya no están, con color y alegría.",
        ["Clip de altares y color", "Texto sobre celebrar la vida y la memoria"],
        "Una forma hermosa de recordar con alegría 💐",
        [], "COLOR Y MEMORIA", "CELEBRAR LA VIDA,\nHONRAR LA MEMORIA",
        ["Una fiesta que abraza la memoria", "Colores, flores y tradición", "Una experiencia única en el mundo"]),
      idea("entretenimiento", "Día de los Muertos", "Reel",
        "Trivia: '¿Qué flor es típica de esta celebración?'",
        ["Pregunta con 3 opciones", "Revelar la respuesta correcta (cempasúchil)"],
        "¿La sabías? Contanos 👇",
        ["Ciudad de México"], "TRIVIA CULTURAL", "¿QUÉ FLOR ES\nLA PROTAGONISTA?",
        ["Opción A: Cempasúchil", "Opción B: Rosa", "Opción C: Girasol"]),
      idea("promocional", "Día de los Muertos", "Post",
        "Paquete para vivir el Día de los Muertos en México.",
        ["Mostrar altares y desfiles", "Resaltar beneficios incluidos", "Cerrar con precio y CTA"],
        "Vivilo en vivo este año 💀🌼",
        ["Ciudad de México"], "EXPERIENCIA CULTURAL", "DÍA DE LOS MUERTOS\nEN MÉXICO",
        ["Tour por altares y desfile", "Alojamiento 3 noches", "Guía cultural incluido"],
        "Precio por persona en base doble", "USD 990"),
    ],
  },
];

// =====================================================================
// COMPONENTE PRINCIPAL
// =====================================================================
export default function PlacasApp() {
  // ---- Navegación ----
  const [screen, setScreen] = useState("home"); // home | placas | ideas | calendario
  const [placasScreen, setPlacasScreen] = useState("welcome"); // welcome | imagen | video

  // ---- Editor embebido dentro de Ideas / Calendario (sin navegar) ----
  const [calEditorMode, setCalEditorMode] = useState(null); // null | imagen | video
  const [ideasEditorMode, setIdeasEditorMode] = useState(null); // null | imagen | video

  // ---- Formato / medidas ----
  const [canvasFormat, setCanvasFormat] = useState("story");
  const { w: CW, h: CH } = FORMATS[canvasFormat];

  // ---- Contenido del editor (compartido imagen/video) ----
  const [badge, setBadge] = useState("3 FECHAS INCLUIDAS");
  const [title, setTitle] = useState("FÓRMULA 1\nSAN PABLO 2026");
  const [bullets, setBullets] = useState(["Entrada sector G", "Traslado hotel ↔ circuito (3 días)"]);
  const [priceLabel, setPriceLabel] = useState("Precio en base doble");
  const [price, setPrice] = useState("USD 2.100");
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [layoutStyle, setLayoutStyle] = useState("promo"); // promo | titular (preset de posiciones)
  const [titleScale, setTitleScale] = useState(1); // 0.75 - 1.25 (compatibilidad, ya no se usa directo)
  const [scrimOpacity, setScrimOpacity] = useState(0.5); // 0 - 0.8

  // ---- Logo: texto, imagen, o sin logo ----
  const [logo, setLogo] = useState({ mode: "text", text: "PROVIAJES" }); // mode: text | image | none
  const [logoImageUrl, setLogoImageUrl] = useState("");
  const logoImageElRef = useRef(null);

  // ---- Posición / tamaño de cada elemento sobre la placa (editable
  // arrastrando directamente en la vista previa). x/y en % del lienzo,
  // fontSize en unidades del lienzo (1080px de ancho base). Se comparte
  // entre TODOS los editores (imagen y video), así los cambios se ven
  // reflejados en todos lados a la vez.
  const [elementBox, setElementBox] = useState({
    logo: { x: 5, y: 3, fontSize: 34 },
    badge: { x: 5, y: 9, fontSize: 30 },
    title: { x: 5, y: 58, fontSize: 96 },
    bullets: { x: 5, y: 77, fontSize: 40 },
    price: { x: 5, y: 88, fontSize: 88 },
  });
  const [selectedElement, setSelectedElement] = useState(null);

  const LAYOUT_PRESETS = {
    promo: {
      logo: { x: 5, y: 3, fontSize: 34 },
      badge: { x: 5, y: 9, fontSize: 30 },
      title: { x: 5, y: 58, fontSize: 96 },
      bullets: { x: 5, y: 77, fontSize: 40 },
      price: { x: 5, y: 88, fontSize: 88 },
    },
    titular: {
      logo: { x: 5, y: 3, fontSize: 32 },
      badge: { x: 5, y: 9, fontSize: 28 },
      title: { x: 5, y: 40, fontSize: 100 },
      bullets: { x: 5, y: 86, fontSize: 34 },
      price: { x: 5, y: 88, fontSize: 80 },
    },
  };

  const applyLayoutPreset = (presetKey) => {
    setLayoutStyle(presetKey);
    setElementBox(LAYOUT_PRESETS[presetKey]);
  };

  // ---- Fondo: modo (interno, según pantalla) ----
  const [bgMode, setBgMode] = useState("video"); // video | solid

  // ---- Pexels: video ----
  const [apiKey, setApiKey] = useState("");
  const [showKeyHelp, setShowKeyHelp] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState(15);
  const [clipSeconds, setClipSeconds] = useState(15);
  const [videoError, setVideoError] = useState("");
  const [videoWarning, setVideoWarning] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");

  // ---- Pexels: fotos / fondo sólido ----
  const [bgImageUrl, setBgImageUrl] = useState("");
  const [bgImageLoading, setBgImageLoading] = useState(false);
  const bgImageElRef = useRef(null);
  const [photoQuery, setPhotoQuery] = useState("");
  const [photoResults, setPhotoResults] = useState([]);
  const [photoSearching, setPhotoSearching] = useState(false);
  const [photoSearchError, setPhotoSearchError] = useState("");

  // ---- Captura de imagen ----
  const [imageUrl, setImageUrl] = useState("");
  const [imageCaptureError, setImageCaptureError] = useState("");
  const [imageMode, setImageMode] = useState("single"); // single | carousel

  // ---- Carrusel ----
  const [carouselSlides, setCarouselSlides] = useState(null);
  const [carouselGenerating, setCarouselGenerating] = useState(false);
  const [carouselError, setCarouselError] = useState("");

  // ---- Generador de ideas ----
  const [ideaTopic, setIdeaTopic] = useState("");
  const [ideaVariants, setIdeaVariants] = useState(null);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaIsTemplate, setIdeaIsTemplate] = useState(false);
  const [ideaFormatPref, setIdeaFormatPref] = useState("ambas"); // imagen | video | ambas

  // ---- Calendario ----
  const today = new Date();
  const [monthWindowStart, setMonthWindowStart] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState(null); // { month, day }
  const [customEvents, setCustomEvents] = useState([]);
  const [customEventsLoaded, setCustomEventsLoaded] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", month: today.getMonth(), day: "1", place: "", category: "espectaculo" });
  const [dayIdeas, setDayIdeas] = useState({}); // eventId -> { variants, loading, error, isTemplate }
  const [eventInfo, setEventInfo] = useState({}); // eventId -> { text, loading, error }

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const uploadedUrlRef = useRef(null);
  const uploadedImageUrlRef = useRef(null);

  // Guardado persistente: usa window.storage cuando está disponible (acá
  // dentro de Claude), y localStorage como respaldo cuando la app corre
  // publicada de forma independiente (ej: en Vercel).
  const storage = {
    async get(key) {
      if (typeof window !== "undefined" && window.storage) {
        return window.storage.get(key, false);
      }
      const value = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
      return value ? { key, value } : null;
    },
    async set(key, value) {
      if (typeof window !== "undefined" && window.storage) {
        return window.storage.set(key, value, false);
      }
      if (typeof window !== "undefined") window.localStorage.setItem(key, value);
      return { key, value };
    },
  };

  // ---- Cargar eventos personalizados guardados ----
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get("custom-events");
        if (res && res.value) setCustomEvents(JSON.parse(res.value));
      } catch (e) {
        // no había nada guardado todavía, arrancamos vacío
      }
      setCustomEventsLoaded(true);
    })();
  }, []);

  const persistCustomEvents = async (events) => {
    try {
      await storage.set("custom-events", JSON.stringify(events));
    } catch (e) {
      // si falla el guardado persistente, al menos queda en memoria esta sesión
    }
  };

  // ---- Cargar y guardar la API key de Pexels automáticamente ----
  useEffect(() => {
    (async () => {
      try {
        const res = await storage.get("pexels-api-key");
        if (res && res.value) setApiKey(res.value);
      } catch (e) {
        // todavía no había ninguna key guardada
      }
    })();
  }, []);

  useEffect(() => {
    if (!apiKey) return;
    const t = setTimeout(() => {
      storage.set("pexels-api-key", apiKey).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [apiKey]);

  // =====================================================================
  // BÚSQUEDA / CARGA DE VIDEO (Pexels)
  // =====================================================================
  const handleVideoUpload = (e) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (uploadedUrlRef.current) URL.revokeObjectURL(uploadedUrlRef.current);
      const url = URL.createObjectURL(file);
      uploadedUrlRef.current = url;
      setDownloadUrl("");
      setImageUrl("");
      setVideoError("");
      const isQuicktime = file.type === "video/quicktime" || /\.mov$/i.test(file.name || "");
      setVideoWarning(
        isQuicktime
          ? "Es un .MOV — si tu celular lo grabó en HEVC puede no reproducirse acá. Si falla, convertilo a .mp4."
          : ""
      );
      setVideoUrl(url);
      setBgMode("video");
      setVideoDuration(15);
      setClipSeconds(15);
    } catch (err) {
      setVideoError("No se pudo leer ese archivo de video. Probá con otro formato (mp4 recomendado).");
    } finally {
      e.target.value = "";
    }
  };

  const [videoPage, setVideoPage] = useState(1);
  const [videoHasMore, setVideoHasMore] = useState(true);
  const [videoLoadingMore, setVideoLoadingMore] = useState(false);

  const doSearch = async () => {
    if (!apiKey.trim()) {
      setSearchError("Necesitás pegar tu API key de Pexels primero.");
      return;
    }
    if (!query.trim()) return;
    setSearching(true);
    setSearchError("");
    setResults([]);
    setVideoPage(1);
    setVideoHasMore(true);
    try {
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12&page=1&orientation=portrait`,
        { headers: { Authorization: apiKey.trim() } }
      );
      if (res.status === 401) {
        setSearchError("API key inválida. Revisá que la hayas copiado completa.");
        setSearching(false);
        return;
      }
      if (!res.ok) {
        setSearchError(`Error de búsqueda (${res.status}). Probá de nuevo en unos segundos.`);
        setSearching(false);
        return;
      }
      const data = await res.json();
      setResults(data.videos || []);
      setVideoHasMore((data.videos || []).length >= 12);
      if (!data.videos || data.videos.length === 0) {
        setSearchError("Sin resultados. Probá con otro término (en inglés suele dar más resultados).");
      }
    } catch (e) {
      setSearchError("No se pudo conectar con Pexels. Revisá tu conexión.");
    }
    setSearching(false);
  };

  const loadMoreVideos = async () => {
    if (!apiKey.trim() || !query.trim() || videoLoadingMore) return;
    const nextPage = videoPage + 1;
    setVideoLoadingMore(true);
    try {
      const res = await fetch(
        `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=12&page=${nextPage}&orientation=portrait`,
        { headers: { Authorization: apiKey.trim() } }
      );
      if (res.ok) {
        const data = await res.json();
        setResults((prev) => [...prev, ...(data.videos || [])]);
        setVideoHasMore((data.videos || []).length >= 12);
        setVideoPage(nextPage);
      } else {
        setVideoHasMore(false);
      }
    } catch (e) {
      setVideoHasMore(false);
    }
    setVideoLoadingMore(false);
  };

  const pickBestFile = (video) => {
    const files = video.video_files || [];
    const portrait = files.filter((f) => f.height > f.width);
    const pool = portrait.length ? portrait : files;
    const hd = pool.find((f) => f.quality === "hd") || pool[0];
    return hd ? hd.link : files[0]?.link;
  };

  const selectVideo = (video) => {
    const link = pickBestFile(video);
    if (!link) return;
    setDownloadUrl("");
    setImageUrl("");
    setVideoError("");
    setVideoWarning("");
    setVideoUrl(link);
    setBgMode("video");
    setVideoDuration(video.duration || 15);
    setClipSeconds(Math.min(15, video.duration || 15));
  };

  // =====================================================================
  // BÚSQUEDA / CARGA DE FOTOS (Pexels)
  // =====================================================================
  const searchPexelsPhotos = async (q, perPage = 8, page = 1) => {
    if (!apiKey.trim() || !q.trim()) return [];
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${perPage}&page=${page}&orientation=portrait`,
      { headers: { Authorization: apiKey.trim() } }
    );
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    return data.photos || [];
  };

  const loadImageElement = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("no se pudo cargar la imagen"));
      img.src = url;
    });

  const autoSetBackgroundPhoto = async (q) => {
    setBgImageUrl("");
    bgImageElRef.current = null;
    if (!q || !apiKey.trim()) return;
    setBgImageLoading(true);
    try {
      const photos = await searchPexelsPhotos(q, 1);
      if (photos.length > 0) {
        const url = photos[0].src.large2x || photos[0].src.large || photos[0].src.original;
        const img = await loadImageElement(url);
        bgImageElRef.current = img;
        setBgImageUrl(url);
      }
    } catch (e) {
      // silencioso: se queda con el fondo de color
    }
    setBgImageLoading(false);
  };

  const [photoPage, setPhotoPage] = useState(1);
  const [photoHasMore, setPhotoHasMore] = useState(true);
  const [photoLoadingMore, setPhotoLoadingMore] = useState(false);

  const searchPhotosManually = async () => {
    if (!photoQuery.trim()) return;
    setPhotoSearching(true);
    setPhotoSearchError("");
    setPhotoResults([]);
    setPhotoPage(1);
    setPhotoHasMore(true);
    try {
      const photos = await searchPexelsPhotos(photoQuery, 8, 1);
      setPhotoResults(photos);
      setPhotoHasMore(photos.length >= 8);
      if (photos.length === 0) setPhotoSearchError("Sin resultados. Probá con otro término, en inglés.");
    } catch (e) {
      setPhotoSearchError("No se pudo buscar fotos. Revisá tu API key o tu conexión.");
    }
    setPhotoSearching(false);
  };

  const loadMorePhotos = async () => {
    if (!photoQuery.trim() || photoLoadingMore) return;
    const nextPage = photoPage + 1;
    setPhotoLoadingMore(true);
    try {
      const photos = await searchPexelsPhotos(photoQuery, 8, nextPage);
      setPhotoResults((prev) => [...prev, ...photos]);
      setPhotoHasMore(photos.length >= 8);
      setPhotoPage(nextPage);
    } catch (e) {
      setPhotoHasMore(false);
    }
    setPhotoLoadingMore(false);
  };

  const selectPhoto = async (photo) => {
    const url = photo.src.large2x || photo.src.large || photo.src.original;
    setBgImageUrl(url);
    try {
      const img = await loadImageElement(url);
      bgImageElRef.current = img;
    } catch (e) {
      bgImageElRef.current = null;
    }
  };

  const handleImageUpload = (e) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (uploadedImageUrlRef.current) URL.revokeObjectURL(uploadedImageUrlRef.current);
      const url = URL.createObjectURL(file);
      uploadedImageUrlRef.current = url;
      setBgMode("solid");
      setBgImageUrl(url);
      loadImageElement(url)
        .then((img) => (bgImageElRef.current = img))
        .catch(() => (bgImageElRef.current = null));
    } finally {
      e.target.value = "";
    }
  };

  const uploadedLogoUrlRef = useRef(null);
  const handleLogoUpload = (e) => {
    try {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (uploadedLogoUrlRef.current) URL.revokeObjectURL(uploadedLogoUrlRef.current);
      const url = URL.createObjectURL(file);
      uploadedLogoUrlRef.current = url;
      setLogoImageUrl(url);
      setLogo((prev) => ({ ...prev, mode: "image" }));
      loadImageElement(url)
        .then((img) => (logoImageElRef.current = img))
        .catch(() => (logoImageElRef.current = null));
    } finally {
      e.target.value = "";
    }
  };

  // =====================================================================
  // GENERADOR DE IDEAS (IA con respaldo de plantillas locales)
  // =====================================================================
  const buildTemplateIdeas = (topic) => {
    const upper = topic.toUpperCase();
    const shortBadge = topic.length > 26 ? topic.slice(0, 26).toUpperCase() : upper;
    return [
      idea("educativo", topic, "Carrusel", `Guía rápida con lo esencial relacionado a "${topic}".`,
        ["Slide 1: portada con el título y el tema.", "Slide 2 a 4: 3 tips o datos concretos y útiles.", "Slide 5: cierre invitando a guardar el post."],
        "Guardá este post para cuando lo necesites 📌", [], "GUÍA RÁPIDA", `${upper}\nLO QUE TENÉS QUE SABER`,
        ["Dato o tip 1 (editá esto)", "Dato o tip 2 (editá esto)", "Dato o tip 3 (editá esto)"]),
      idea("inspiracional", topic, "Reel", `Reflexión corta sobre lo que significa "${topic}" para quienes viajan.`,
        ["Imágenes emotivas de viajeros o familias.", "Texto o voz en off con una frase reflexiva."],
        "A veces el mejor regalo es un viaje juntos ✈️❤️", [], "PARA SENTIR", `${upper}\nSE VIVE VIAJANDO`,
        ["Historias reales de pasajeros", "Momentos que quedan para siempre", "Experiencias en familia"]),
      idea("entretenimiento", topic, "Reel", `Trivia o juego rápido relacionado con "${topic}" para generar comentarios.`,
        ["Mostrar 3 pistas o imágenes.", "Preguntar '¿adivinás cuál es?'", "Revelar la respuesta al final."],
        "Dejanos tu respuesta en los comentarios 👇", [], "JUGÁ Y ADIVINÁ", `${upper}\n¿LO ADIVINÁS?`,
        ["Pista 1 (editá esto)", "Pista 2 (editá esto)", "Pista 3 (editá esto)"]),
      idea("promocional", topic, "Post", `Oferta puntual relacionada con "${topic}".`,
        ["Mostrar el destino o paquete.", "Resaltar beneficios incluidos.", "Cerrar con el precio y CTA."],
        "Consultanos y reservá tu lugar 📩", [], shortBadge, `${upper}\nOFERTA ESPECIAL`,
        ["Beneficio incluido 1 (editá esto)", "Beneficio incluido 2 (editá esto)", "Beneficio incluido 3 (editá esto)"],
        "Precio por persona", "Consultar"),
    ];
  };

  // Si la IA no responde rápido, cortamos y caemos a las plantillas
  // locales — así el generador nunca deja esperando de más.
  const withTimeout = (promise, ms) =>
    Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error(`timeout tras ${ms / 1000}s`)), ms)),
    ]);

  const fetchIdeaVariants = async (topic) => {
    const promptText = `Sos un experto en marketing de redes sociales para agencias de viajes en Latinoamérica. Te paso un tema, fecha o efeméride: "${topic}".

Generá 4 ideas de contenido bien distintas para ese tema, una de cada tipo:
1. "educativo": artículo útil (ej: qué visitar en un destino, checklist de viaje, tips prácticos).
2. "inspiracional": contenido emotivo (reflexión sobre viajar, historia de una familia/pareja que viajó a un destino, frase inspiradora).
3. "entretenimiento": formato divertido (trivia, juego tipo "adiviná el destino", blooper, pregunta con humor).
4. "promocional": oferta concreta de un paquete con precio.

Devolvé SOLO un array JSON válido de exactamente 4 objetos, sin texto adicional, sin markdown, sin backticks, cada uno con esta forma exacta:
{"contentType":"educativo | inspiracional | entretenimiento | promocional","dayName":"nombre del día o tema","format":"Reel, Carrusel o Post","idea":"descripción corta y concreta de la idea creativa","script":["paso o clip 1","paso o clip 2","paso o clip 3"],"cierre":"frase de cierre o llamado a la acción","destinations":["destino 1","destino 2"],"badge":"texto corto para un badge de placa, máximo 4 palabras, en mayúsculas","title":"TÍTULO EN MAYÚSCULAS\\nEN DOS LÍNEAS","bullets":["item 1","item 2","item 3"],"priceLabel":"etiqueta de precio, SOLO si contentType es promocional, si no dejar string vacío","price":"precio, SOLO si contentType es promocional, si no dejar string vacío"}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1800,
        messages: [{ role: "user", content: [{ type: "text", text: promptText }] }],
      }),
    });

    const rawText = await response.text();
    const data = JSON.parse(rawText);

    if (!response.ok) {
      const apiMsg = data && data.error && data.error.message ? data.error.message : JSON.stringify(data).slice(0, 300);
      throw new Error(`Error de la API (${response.status}): ${apiMsg}`);
    }

    const text = (data.content || []).map((b) => b.text || "").join("");
    if (!text.trim()) throw new Error("La IA devolvió una respuesta vacía.");

    let clean = text.replace(/```json|```/g, "").trim();
    const first = clean.indexOf("[");
    const last = clean.lastIndexOf("]");
    if (first !== -1 && last !== -1 && last > first) clean = clean.slice(first, last + 1);

    const parsed = JSON.parse(clean);
    if (!Array.isArray(parsed)) throw new Error("La respuesta no fue una lista de ideas.");
    return parsed;
  };

  const getIdeasWithFallback = async (topic) => {
    try {
      const parsed = await withTimeout(fetchIdeaVariants(topic), 6000);
      return { variants: parsed, isTemplate: false };
    } catch (err) {
      console.error("IA no disponible o lenta, usando plantillas locales:", err);
      return { variants: buildTemplateIdeas(topic), isTemplate: true };
    }
  };

  const generateIdea = async () => {
    if (!ideaTopic.trim()) return;
    setIdeaLoading(true);
    setIdeaError("");
    setIdeaVariants(null);
    const { variants, isTemplate } = await getIdeasWithFallback(ideaTopic);
    setIdeaVariants(variants);
    setIdeaIsTemplate(isTemplate);
    setIdeaLoading(false);
  };

  // Info de un evento del calendario (best-effort; si la IA no responde,
  // avisamos con honestidad en vez de trabarnos).
  const fetchEventInfo = async (evt) => {
    setEventInfo((prev) => ({ ...prev, [evt.id]: { loading: true, text: "", error: "" } }));
    try {
      const promptText = `Dame 2-3 oraciones breves e informativas (en español) sobre este evento/fecha para un agente de viajes: "${evt.name}"${evt.place ? ` en ${evt.place}` : ""}. Sin markdown, sin listas, solo texto plano.`;
      const response = await withTimeout(
        fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-6",
            max_tokens: 300,
            messages: [{ role: "user", content: [{ type: "text", text: promptText }] }],
          }),
        }),
        5000
      );
      const rawText = await response.text();
      const data = JSON.parse(rawText);
      if (!response.ok) throw new Error("api error");
      const text = (data.content || []).map((b) => b.text || "").join("").trim();
      if (!text) throw new Error("respuesta vacía");
      setEventInfo((prev) => ({ ...prev, [evt.id]: { loading: false, text, error: "" } }));
    } catch (e) {
      setEventInfo((prev) => ({
        ...prev,
        [evt.id]: {
          loading: false,
          text: "",
          error: `No pudimos traer info automática ahora mismo. Te recomendamos buscar "${evt.name}" en Google para más detalles.`,
        },
      }));
    }
  };

  // Ideas para un evento del día seleccionado en el Calendario
  const fetchDayIdeas = async (evt) => {
    if (evt.ideas && evt.ideas.length > 0) {
      setDayIdeas((prev) => ({ ...prev, [evt.id]: { variants: evt.ideas, loading: false, error: "", isTemplate: false } }));
      return;
    }
    setDayIdeas((prev) => ({ ...prev, [evt.id]: { variants: null, loading: true, error: "" } }));
    const { variants, isTemplate } = await getIdeasWithFallback(evt.name);
    setDayIdeas((prev) => ({ ...prev, [evt.id]: { variants, loading: false, error: "", isTemplate } }));
  };

  // =====================================================================
  // APLICAR UNA IDEA AL EDITOR (contenido) y preparar fondo, SIN NAVEGAR.
  // Se usa tanto para el editor embebido en Ideas/Calendario como para
  // el editor de pantalla completa en Generador de Placas.
  // =====================================================================
  const applyIdeaToEditor = (ideaObj) => {
    setBadge(ideaObj.badge || "");
    setTitle(ideaObj.title || "");
    setBullets(ideaObj.bullets && ideaObj.bullets.length ? ideaObj.bullets : [""]);
    setPriceLabel(ideaObj.priceLabel || "");
    setPrice(ideaObj.price || "");
    setAccent(ACCENTS[Math.abs(hashCode(ideaObj.title || ideaObj.badge || "")) % ACCENTS.length].value);
    applyLayoutPreset(ideaObj.contentType === "educativo" ? "titular" : "promo");
    setDownloadUrl("");
    setImageUrl("");
    setVideoError("");
    setVideoWarning("");
    setCarouselSlides(null);
  };

  const loadIdeaImageContent = (ideaObj) => {
    applyIdeaToEditor(ideaObj);
    setImageMode("single");
    setBgMode("solid");
    setVideoUrl("");
    bgImageElRef.current = null;
    setBgImageUrl("");
    const q = (ideaObj.destinations && ideaObj.destinations[0]) || ideaObj.dayName || ideaObj.badge || "";
    autoSetBackgroundPhoto(q);
  };

  const loadIdeaVideoContent = (ideaObj) => {
    applyIdeaToEditor(ideaObj);
    setBgMode("video");
    const autoVideo = SAMPLE_VIDEOS[Math.abs(hashCode(ideaObj.title || ideaObj.badge || "")) % SAMPLE_VIDEOS.length];
    setVideoUrl(autoVideo);
    setVideoDuration(15);
    setClipSeconds(15);
  };

  // Desde Ideas/Calendario: abren el editor EMBEBIDO en esa misma pantalla,
  // sin navegar al Generador de Placas.
  const openInlineImage = (ideaObj, setEditorMode) => {
    loadIdeaImageContent(ideaObj);
    setEditorMode("imagen");
  };
  const openInlineVideo = (ideaObj, setEditorMode) => {
    loadIdeaVideoContent(ideaObj);
    setEditorMode("video");
  };
  const openInlineCarousel = async (ideaObj, setEditorMode) => {
    loadIdeaImageContent(ideaObj);
    setImageMode("carousel");
    setEditorMode("imagen");
    await generateCarousel(ideaObj);
  };

  // =====================================================================
  // CANVAS: dibujo en vivo
  // =====================================================================
  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const paragraphs = text.split("\n");
    let cursorY = y;
    paragraphs.forEach((para) => {
      const words = para.split(" ");
      let line = "";
      const lines = [];
      words.forEach((word) => {
        const test = line ? line + " " + word : word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);
      lines.forEach((l) => {
        ctx.fillText(l, x, cursorY);
        cursorY += lineHeight;
      });
    });
    return cursorY;
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function shadeColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    let r = (num >> 16) + percent;
    let g = ((num >> 8) & 0x00ff) + percent;
    let b = (num & 0x0000ff) + percent;
    r = Math.max(Math.min(255, r), 0);
    g = Math.max(Math.min(255, g), 0);
    b = Math.max(Math.min(255, b), 0);
    return `rgb(${r}, ${g}, ${b})`;
  }

  function hexToRgba(hex, alpha) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = num >> 16;
    const g = (num >> 8) & 0x00ff;
    const b = num & 0x0000ff;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  const paintFallbackBackground = (ctx, accentColor = accent) => {
    const grad = ctx.createLinearGradient(0, 0, CW * 0.3, CH);
    grad.addColorStop(0, shadeColor(accentColor, -70));
    grad.addColorStop(0.55, "#111318");
    grad.addColorStop(1, "#0a0a0c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CW, CH);
    const glow = ctx.createRadialGradient(CW * 0.85, CH * 0.12, 0, CW * 0.85, CH * 0.12, CW * 0.7);
    glow.addColorStop(0, hexToRgba(accentColor, 0.35));
    glow.addColorStop(1, hexToRgba(accentColor, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CW, CH);
  };

  // Renderizador único: dibuja fondo (video/foto/color), el logo (texto,
  // imagen o nada), y cada elemento en la posición/tamaño que tenga
  // guardado en elementBox (editable arrastrando en la vista previa).
  const renderPlaca = (canvas, video) => {
    const ctx = canvas.getContext("2d");
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, CW, CH);

    if (video && video.videoWidth) {
      const scale = Math.max(CW / video.videoWidth, CH / video.videoHeight);
      const dw = video.videoWidth * scale;
      const dh = video.videoHeight * scale;
      ctx.drawImage(video, (CW - dw) / 2, (CH - dh) / 2, dw, dh);
      ctx.fillStyle = `rgba(8,8,10,${scrimOpacity})`;
      ctx.fillRect(0, 0, CW, CH);
    } else if (bgImageElRef.current && bgImageElRef.current.naturalWidth) {
      const img = bgImageElRef.current;
      const scale = Math.max(CW / img.naturalWidth, CH / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (CW - dw) / 2, (CH - dh) / 2, dw, dh);
      ctx.fillStyle = `rgba(8,8,10,${scrimOpacity})`;
      ctx.fillRect(0, 0, CW, CH);
    } else {
      paintFallbackBackground(ctx);
    }

    // Logo
    if (logo.mode === "text" && logo.text) {
      const b = elementBox.logo;
      ctx.font = `700 ${b.fontSize}px Manrope, sans-serif`;
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.fillText(logo.text, (b.x / 100) * CW, (b.y / 100) * CH + b.fontSize * 0.8);
    } else if (logo.mode === "image" && logoImageElRef.current && logoImageElRef.current.naturalWidth) {
      const b = elementBox.logo;
      const img = logoImageElRef.current;
      const targetH = b.fontSize * 1.8;
      const targetW = (img.naturalWidth / img.naturalHeight) * targetH;
      ctx.drawImage(img, (b.x / 100) * CW, (b.y / 100) * CH, targetW, targetH);
    }

    // Badge
    if (badge) {
      const b = elementBox.badge;
      ctx.font = `800 ${b.fontSize}px Manrope, sans-serif`;
      const bx = (b.x / 100) * CW;
      const by = (b.y / 100) * CH;
      const badgeWidth = ctx.measureText(badge.toUpperCase()).width + b.fontSize * 2;
      const badgeHeight = b.fontSize * 2.1;
      ctx.fillStyle = accent;
      roundRect(ctx, bx, by, badgeWidth, badgeHeight, badgeHeight / 2);
      ctx.fill();
      ctx.fillStyle = "#0b0b0b";
      ctx.fillText(badge.toUpperCase(), bx + b.fontSize, by + badgeHeight * 0.68);
    }

    // Título
    if (title) {
      const b = elementBox.title;
      const lines = title.split("\n").filter((l) => l.trim());
      const lineHeight = Math.round(b.fontSize * 1.08);
      ctx.font = `800 ${b.fontSize}px Manrope, sans-serif`;
      let y = (b.y / 100) * CH + b.fontSize;
      lines.forEach((line, i) => {
        ctx.fillStyle = i === lines.length - 1 ? accent : "#ffffff";
        y = wrapText(ctx, line, (b.x / 100) * CW, y, CW - (b.x / 100) * CW - 56, lineHeight);
      });
    }

    // Incluye / bullets
    const visibleBullets = bullets.filter((bl) => bl.trim());
    if (visibleBullets.length > 0) {
      const b = elementBox.bullets;
      let y = (b.y / 100) * CH + b.fontSize;
      const bx = (b.x / 100) * CW;
      visibleBullets.forEach((bl) => {
        ctx.fillStyle = accent;
        ctx.font = `800 ${b.fontSize}px Manrope, sans-serif`;
        ctx.fillText("✓", bx, y);
        ctx.fillStyle = "#f2f2f2";
        ctx.font = `500 ${b.fontSize}px Manrope, sans-serif`;
        y = wrapText(ctx, bl, bx + b.fontSize * 1.35, y, CW - bx - b.fontSize * 1.35 - 56, b.fontSize * 1.2);
        y += b.fontSize * 0.45;
      });
    }

    // Precio
    if (priceLabel || price) {
      const b = elementBox.price;
      const bx = (b.x / 100) * CW;
      let y = (b.y / 100) * CH + b.fontSize * 0.35;
      if (priceLabel) {
        ctx.font = `600 ${Math.round(b.fontSize * 0.36)}px Manrope, sans-serif`;
        ctx.fillStyle = "rgba(255,255,255,0.75)";
        ctx.fillText(priceLabel, bx, y);
        y += b.fontSize * 0.9;
      }
      if (price) {
        ctx.font = `800 ${b.fontSize}px Manrope, sans-serif`;
        ctx.fillStyle = accent;
        ctx.fillText(price, bx, y);
      }
    }
  };

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || (!video && bgMode !== "solid")) {
      rafRef.current = requestAnimationFrame(drawFrame);
      return;
    }
    try {
      renderPlaca(canvas, video);
    } catch (err) {
      // no interrumpir el loop por un frame fallido
    }
    rafRef.current = requestAnimationFrame(drawFrame);
  }, [badge, title, bullets, priceLabel, price, accent, bgMode, scrimOpacity, canvasFormat, elementBox, logo, logoImageUrl]);

  useEffect(() => {
    if (videoUrl || bgMode === "solid") {
      rafRef.current = requestAnimationFrame(drawFrame);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [videoUrl, bgMode, drawFrame]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (isPlaying) {
      v.pause();
      setIsPlaying(false);
    } else {
      v.play();
      setIsPlaying(true);
    }
  };

  const updateBullet = (i, val) => {
    const next = [...bullets];
    next[i] = val;
    setBullets(next);
  };
  const removeBullet = (i) => setBullets(bullets.filter((_, idx) => idx !== i));
  const addBullet = () => setBullets([...bullets, ""]);

  // =====================================================================
  // EXPORTACIÓN: imagen / video / carrusel
  // =====================================================================
  const captureImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setImageCaptureError("");
    try {
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
    } catch (err) {
      setImageCaptureError(
        "No se pudo generar la imagen (puede pasar con algunas fotos externas). Probá con una imagen subida por vos."
      );
    }
  };

  const startRecording = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;
    setDownloadUrl("");
    setImageUrl("");

    video.muted = true;
    video.currentTime = 0;

    const stream = canvas.captureStream(30);
    let mimeType = "video/webm;codecs=vp9";
    if (!MediaRecorder.isTypeSupported(mimeType)) mimeType = "video/webm";

    // Bitrate alto para la mejor calidad posible en la descarga.
    const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10_000_000 });
    chunksRef.current = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" });
      setDownloadUrl(URL.createObjectURL(blob));
      setIsRecording(false);
      setRecordProgress(0);
      video.pause();
      setIsPlaying(false);
    };

    recorderRef.current = recorder;
    recorder.start();
    setIsRecording(true);
    video.play();
    setIsPlaying(true);

    const durationMs = clipSeconds * 1000;
    const startTime = Date.now();
    const progressTimer = setInterval(() => {
      const pct = Math.min(100, ((Date.now() - startTime) / durationMs) * 100);
      setRecordProgress(pct);
      if (pct >= 100) clearInterval(progressTimer);
    }, 100);

    setTimeout(() => {
      if (recorderRef.current && recorderRef.current.state !== "inactive") {
        recorderRef.current.stop();
      }
    }, durationMs);
  };

  const paintSlideBackground = (ctx, bgImg, accentColor) => {
    if (bgImg && bgImg.naturalWidth) {
      const scale = Math.max(CW / bgImg.naturalWidth, CH / bgImg.naturalHeight);
      const dw = bgImg.naturalWidth * scale;
      const dh = bgImg.naturalHeight * scale;
      ctx.drawImage(bgImg, (CW - dw) / 2, (CH - dh) / 2, dw, dh);
      ctx.fillStyle = "rgba(8,8,10,0.55)";
      ctx.fillRect(0, 0, CW, CH);
    } else {
      paintFallbackBackground(ctx, accentColor);
    }
  };

  const renderSlideDataUrl = (slide, accentColor, bgImg) => {
    const off = document.createElement("canvas");
    off.width = CW;
    off.height = CH;
    const ctx = off.getContext("2d");
    ctx.textBaseline = "alphabetic";
    paintSlideBackground(ctx, bgImg, accentColor);

    ctx.font = "700 32px Manrope, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("PROVIAJES", 56, 90);

    if (slide.kind === "cover") {
      if (slide.badge) {
        ctx.font = "800 28px Manrope, sans-serif";
        const bw = ctx.measureText(slide.badge.toUpperCase()).width + 60;
        ctx.fillStyle = accentColor;
        roundRect(ctx, 56, 130, bw, 58, 29);
        ctx.fill();
        ctx.fillStyle = "#0b0b0b";
        ctx.fillText(slide.badge.toUpperCase(), 86, 168);
      }
      const lines = (slide.title || "").split("\n").filter((l) => l.trim());
      const lineHeight = 100;
      let y = CH / 2 - (lines.length * lineHeight) / 2 + 36;
      ctx.font = "800 92px Manrope, sans-serif";
      lines.forEach((line, i) => {
        ctx.fillStyle = i === lines.length - 1 ? accentColor : "#ffffff";
        y = wrapText(ctx, line, 56, y, CW - 112, 100);
      });
      ctx.font = "600 32px Manrope, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText("Deslizá para ver más →", 56, CH - 90);
    } else if (slide.kind === "tip") {
      ctx.font = "800 30px Manrope, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.fillText(`TIP ${slide.index}/${slide.total}`, 56, 220);
      ctx.font = "800 68px Manrope, sans-serif";
      ctx.fillStyle = "#ffffff";
      wrapText(ctx, slide.text, 56, CH / 2 - 20, CW - 112, 78);
    } else if (slide.kind === "closing") {
      ctx.font = "800 30px Manrope, sans-serif";
      ctx.fillStyle = accentColor;
      ctx.fillText("PARA CERRAR", 56, 220);
      ctx.font = "800 72px Manrope, sans-serif";
      ctx.fillStyle = "#ffffff";
      wrapText(ctx, slide.text, 56, CH / 2 - 20, CW - 112, 82);
    }

    return off.toDataURL("image/png");
  };

  const generateCarousel = async (ideaObj) => {
    setCarouselGenerating(true);
    setCarouselError("");
    setCarouselSlides(null);

    const accentColor = ACCENTS[Math.abs(hashCode(ideaObj.title || ideaObj.badge || "")) % ACCENTS.length].value;

    let bgImg = null;
    const q = (ideaObj.destinations && ideaObj.destinations[0]) || ideaObj.dayName || ideaObj.badge || "";
    if (apiKey.trim() && q) {
      try {
        const photos = await searchPexelsPhotos(q, 1);
        if (photos.length > 0) {
          const url = photos[0].src.large2x || photos[0].src.large || photos[0].src.original;
          bgImg = await loadImageElement(url);
        }
      } catch (e) {
        // sigue con el fondo de color
      }
    }

    const slides = [{ kind: "cover", badge: ideaObj.badge, title: ideaObj.title }];
    (ideaObj.bullets || []).forEach((b, i) =>
      slides.push({ kind: "tip", index: i + 1, total: (ideaObj.bullets || []).length, text: b })
    );
    if (ideaObj.cierre) slides.push({ kind: "closing", text: ideaObj.cierre });

    try {
      const dataUrls = slides.map((slide) => renderSlideDataUrl(slide, accentColor, bgImg));
      setCarouselSlides(dataUrls);
    } catch (e) {
      setCarouselError("No se pudo generar el carrusel. Probá de nuevo.");
    }
    setCarouselGenerating(false);
  };

  // =====================================================================
  // CALENDARIO: helpers de grilla y eventos
  // =====================================================================
  const allEvents = React.useMemo(
    () => [...buildFestiveEvents(), ...SAMPLE_EVENTS, ...customEvents],
    [customEvents]
  );

  const getMonthGrid = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  };

  const eventsOnDay = (month, day) => allEvents.filter((e) => e.month === month && e.day === day);

  const shiftMonthWindow = (delta) => {
    setMonthWindowStart(new Date(monthWindowStart.getFullYear(), monthWindowStart.getMonth() + delta, 1));
  };

  const addCustomEvent = () => {
    if (!newEvent.name.trim()) return;
    const dayNum = parseInt(newEvent.day, 10);
    const evt = {
      id: `custom-${Date.now()}`,
      name: newEvent.name.trim(),
      month: Number(newEvent.month),
      day: isNaN(dayNum) ? null : dayNum,
      dayLabel: newEvent.day,
      place: newEvent.place.trim(),
      isWorldDay: false,
      category: newEvent.category,
      ideas: [],
    };
    const next = [...customEvents, evt];
    setCustomEvents(next);
    persistCustomEvents(next);
    setShowAddEvent(false);
    setNewEvent({ name: "", month: today.getMonth(), day: "1", place: "", category: "espectaculo" });
  };

  const deleteCustomEvent = (id) => {
    const next = customEvents.filter((e) => e.id !== id);
    setCustomEvents(next);
    persistCustomEvents(next);
  };

  const monthsToShow = [0, 1, 2].map((i) => new Date(monthWindowStart.getFullYear(), monthWindowStart.getMonth() + i, 1));
  const WEEKDAY_LETTERS = ["D", "L", "M", "M", "J", "V", "S"];
  const MONTH_LABELS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  // Props comunes que necesitan los bloques de editor (imagen/video),
  // se arman una vez y se reusan tanto en Generador de Placas como
  // embebidos en Ideas/Calendario.
  const imageEditorProps = {
    canvasFormat, setCanvasFormat, FORMATS,
    imageMode, setImageMode,
    layoutStyle, applyLayoutPreset, titleScale, setTitleScale, scrimOpacity, setScrimOpacity,
    accent, setAccent, ACCENTS,
    badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet,
    priceLabel, setPriceLabel, price, setPrice,
    canvasRef, bgImageUrl, bgImageLoading,
    imageUrl, imageCaptureError, captureImage,
    carouselSlides, carouselGenerating, carouselError, generateCarousel, setCarouselSlides,
    elementBox, setElementBox, selectedElement, setSelectedElement,
    logo, setLogo, logoImageUrl, handleLogoUpload,
  };

  const videoEditorProps = {
    canvasFormat, setCanvasFormat, FORMATS,
    layoutStyle, applyLayoutPreset, titleScale, setTitleScale, scrimOpacity, setScrimOpacity,
    accent, setAccent, ACCENTS,
    badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet,
    priceLabel, setPriceLabel, price, setPrice,
    videoRef, canvasRef,
    videoUrl, videoError, videoWarning, isPlaying, togglePlay, isRecording, recordProgress,
    videoDuration, clipSeconds, setClipSeconds,
    setVideoError, setVideoWarning, setVideoDuration,
    startRecording, downloadUrl,
    elementBox, setElementBox, selectedElement, setSelectedElement,
    logo, setLogo, logoImageUrl, handleLogoUpload,
  };

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" style={{ fontFamily: "Manrope, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');`}</style>

      {screen === "home" && <HomeScreen onNavigate={setScreen} />}

      {screen !== "home" && (
        <>
          <header className="sticky top-0 z-10 backdrop-blur bg-neutral-950/80 border-b border-neutral-800 px-4 py-3 flex items-center gap-3">
            <button
              onClick={() => {
                if (screen === "placas" && placasScreen !== "welcome") {
                  setPlacasScreen("welcome");
                } else {
                  setScreen("home");
                }
              }}
              className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="min-w-0">
              <h1 className="text-sm md:text-base font-bold leading-tight truncate">
                {screen === "placas" && placasScreen === "welcome" && "Generador de Placas"}
                {screen === "placas" && placasScreen === "imagen" && "Crear Imagen"}
                {screen === "placas" && placasScreen === "video" && "Crear Video"}
                {screen === "ideas" && "Generador de Ideas"}
                {screen === "calendario" && "Calendario"}
              </h1>
            </div>
          </header>

          <main className="px-5 py-6 space-y-6 max-w-md md:max-w-3xl lg:max-w-5xl mx-auto pb-16">
            {screen === "placas" && placasScreen === "welcome" && (
              <PlacasWelcome onCrearImagen={() => { setPlacasScreen("imagen"); setBgMode("solid"); }} onCrearVideo={() => { setPlacasScreen("video"); setBgMode("video"); }} />
            )}

            {screen === "placas" && placasScreen === "imagen" && (
              <CrearImagenScreen
                editorProps={imageEditorProps}
                apiKey={apiKey} setApiKey={setApiKey} showKeyHelp={showKeyHelp} setShowKeyHelp={setShowKeyHelp}
                photoQuery={photoQuery} setPhotoQuery={setPhotoQuery} photoResults={photoResults}
                photoSearching={photoSearching} photoSearchError={photoSearchError}
                photoHasMore={photoHasMore} photoLoadingMore={photoLoadingMore} loadMorePhotos={loadMorePhotos}
                searchPhotosManually={searchPhotosManually} selectPhoto={selectPhoto} bgImageUrl={bgImageUrl}
                handleImageUpload={handleImageUpload}
                ideaTopic={ideaTopic} setIdeaTopic={setIdeaTopic} ideaVariants={ideaVariants} ideaLoading={ideaLoading}
                ideaError={ideaError} ideaIsTemplate={ideaIsTemplate} generateIdea={generateIdea}
                applyIdeaToEditor={applyIdeaToEditor} autoSetBackgroundPhoto={autoSetBackgroundPhoto}
                EXAMPLES={EXAMPLES}
                onLoadExample={(ex) => {
                  applyIdeaToEditor({ badge: ex.badge, title: ex.title, bullets: ex.bullets, priceLabel: ex.priceLabel, price: ex.price, contentType: "promocional" });
                  setAccent(ex.accent);
                  applyLayoutPreset("promo");
                  bgImageElRef.current = null;
                  setBgImageUrl("");
                  autoSetBackgroundPhoto(ex.photoQuery);
                }}
              />
            )}

            {screen === "placas" && placasScreen === "video" && (
              <CrearVideoScreen
                editorProps={videoEditorProps}
                apiKey={apiKey} setApiKey={setApiKey} showKeyHelp={showKeyHelp} setShowKeyHelp={setShowKeyHelp}
                query={query} setQuery={setQuery} results={results} searching={searching} searchError={searchError}
                videoHasMore={videoHasMore} videoLoadingMore={videoLoadingMore} loadMoreVideos={loadMoreVideos}
                doSearch={doSearch} selectVideo={selectVideo} pickBestFile={pickBestFile} videoUrl={videoUrl}
                handleVideoUpload={handleVideoUpload}
                ideaTopic={ideaTopic} setIdeaTopic={setIdeaTopic} ideaVariants={ideaVariants} ideaLoading={ideaLoading}
                ideaError={ideaError} ideaIsTemplate={ideaIsTemplate} generateIdea={generateIdea}
                applyIdeaToEditor={applyIdeaToEditor}
                EXAMPLES={EXAMPLES}
                onLoadExample={(ex) => {
                  applyIdeaToEditor({ badge: ex.badge, title: ex.title, bullets: ex.bullets, priceLabel: ex.priceLabel, price: ex.price, contentType: "promocional" });
                  setAccent(ex.accent);
                  applyLayoutPreset("promo");
                  setVideoUrl(ex.video);
                  setVideoDuration(15);
                  setClipSeconds(15);
                }}
              />
            )}

            {screen === "ideas" && (
              <IdeasScreen
                {...{ ideaTopic, setIdeaTopic, ideaVariants, ideaLoading, ideaError, ideaIsTemplate, generateIdea, ideaFormatPref, setIdeaFormatPref }}
                editorMode={ideasEditorMode}
                setEditorMode={setIdeasEditorMode}
                onCreateImage={(idea) => openInlineImage(idea, setIdeasEditorMode)}
                onCreateVideo={(idea) => openInlineVideo(idea, setIdeasEditorMode)}
                onGenerateCarousel={(idea) => openInlineCarousel(idea, setIdeasEditorMode)}
                imageEditorProps={imageEditorProps}
                videoEditorProps={videoEditorProps}
              />
            )}

            {screen === "calendario" && (
              <CalendarioScreen
                {...{
                  monthsToShow, MONTH_LABELS, WEEKDAY_LETTERS, getMonthGrid, eventsOnDay, shiftMonthWindow,
                  selectedDay, setSelectedDay, CATEGORY_STYLES,
                  showAddEvent, setShowAddEvent, newEvent, setNewEvent, addCustomEvent, deleteCustomEvent,
                  dayIdeas, fetchDayIdeas, eventInfo, fetchEventInfo,
                }}
                editorMode={calEditorMode}
                setEditorMode={setCalEditorMode}
                onCreateImage={(idea) => openInlineImage(idea, setCalEditorMode)}
                onCreateVideo={(idea) => openInlineVideo(idea, setCalEditorMode)}
                onGenerateCarousel={(idea) => openInlineCarousel(idea, setCalEditorMode)}
                imageEditorProps={imageEditorProps}
                videoEditorProps={videoEditorProps}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
}

// =====================================================================
// PANTALLA DE INICIO
// =====================================================================
function HomeScreen({ onNavigate }) {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 80% 10%, rgba(16,185,129,0.35), transparent 55%), radial-gradient(circle at 10% 85%, rgba(6,182,212,0.3), transparent 55%), linear-gradient(180deg, #0a0a0c 0%, #111318 55%, #0a0a0c 100%)",
        }}
      />
      <div className="relative z-10 flex-1 flex flex-col justify-between px-6 py-10 max-w-md md:max-w-xl lg:max-w-2xl mx-auto w-full">
        <div>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-sky-500 flex items-center justify-center mb-5">
            <Film size={20} className="text-neutral-950" />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Placas ProViajes</h1>
          <p className="text-neutral-400 text-sm md:text-base mt-3 leading-relaxed">
            Creá placas de marketing para redes sociales, encontrá ideas de contenido y llevá el calendario de fechas
            importantes de tu agencia — todo en un mismo lugar.
          </p>
        </div>

        <div className="space-y-3 mt-10">
          <button
            onClick={() => onNavigate("placas")}
            className="w-full text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-4 flex items-center gap-4 hover:border-emerald-500/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <LayoutGrid size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="font-bold text-sm md:text-base">Generador de Placas</p>
              <p className="text-xs md:text-sm text-neutral-500">Creá imágenes o videos con texto para tus redes</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("ideas")}
            className="w-full text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-4 flex items-center gap-4 hover:border-sky-500/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
              <Sparkles size={20} className="text-sky-400" />
            </div>
            <div>
              <p className="font-bold text-sm md:text-base">Generador de Ideas</p>
              <p className="text-xs md:text-sm text-neutral-500">Ideas de contenido con IA sobre cualquier tema</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate("calendario")}
            className="w-full text-left bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-4 flex items-center gap-4 hover:border-violet-500/50 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
              <CalendarIcon size={20} className="text-violet-400" />
            </div>
            <div>
              <p className="font-bold text-sm md:text-base">Calendario</p>
              <p className="text-xs md:text-sm text-neutral-500">Fechas festivas, deportivas y de espectáculos</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// GENERADOR DE PLACAS — bienvenida
// =====================================================================
function PlacasWelcome({ onCrearImagen, onCrearVideo }) {
  return (
    <div className="space-y-6 pt-4">
      <div>
        <h2 className="text-lg md:text-2xl font-bold">¿Qué querés crear hoy?</h2>
        <p className="text-sm md:text-base text-neutral-400 mt-1.5 leading-relaxed">
          Armá una imagen (post o carrusel) o un video corto para tus redes, con texto, precio y fondo real o de
          color — todo editable.
        </p>
      </div>
      <div className="space-y-3">
        <button
          onClick={onCrearImagen}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-left hover:border-emerald-500/50 transition-colors flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
            <ImageIcon size={22} className="text-emerald-400" />
          </div>
          <div>
            <p className="font-bold">Crear Imagen</p>
            <p className="text-xs md:text-sm text-neutral-500">Post único o carrusel de varias placas</p>
          </div>
        </button>
        <button
          onClick={onCrearVideo}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-left hover:border-sky-500/50 transition-colors flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-sky-500/15 flex items-center justify-center shrink-0">
            <Film size={22} className="text-sky-400" />
          </div>
          <div>
            <p className="font-bold">Crear Video</p>
            <p className="text-xs md:text-sm text-neutral-500">Placa animada con video de fondo</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// Bloque compartido: configuración de formato/medidas
function FormatPicker({ canvasFormat, setCanvasFormat, FORMATS }) {
  return (
    <div className="space-y-2">
      <label className="text-xs md:text-sm text-neutral-400">Formato / medidas</label>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(FORMATS).map(([key, f]) => (
          <button
            key={key}
            onClick={() => setCanvasFormat(key)}
            className={`text-[11px] md:text-sm font-semibold rounded-lg py-2 px-1 transition-colors ${
              canvasFormat === key ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Bloque compartido: configuración de texto
function TextConfig({ layoutStyle, applyLayoutPreset, titleScale, setTitleScale, scrimOpacity, setScrimOpacity, accent, setAccent, ACCENTS, extraOpacityLabel }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs md:text-sm text-neutral-400">Formato de placa (reinicia las posiciones)</label>
        <div className="flex gap-2">
          <button
            onClick={() => applyLayoutPreset("promo")}
            className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
              layoutStyle === "promo" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Paquete (con precio)
          </button>
          <button
            onClick={() => applyLayoutPreset("titular")}
            className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
              layoutStyle === "titular" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Titular (afiche)
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs md:text-sm text-neutral-400">
          {extraOpacityLabel || "Opacidad del velo oscuro"}: {Math.round(scrimOpacity * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={0.8}
          step={0.05}
          value={scrimOpacity}
          onChange={(e) => setScrimOpacity(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs md:text-sm text-neutral-400">Color de acento (tipografía / detalles)</label>
        <div className="flex gap-2">
          {ACCENTS.map((a) => (
            <button
              key={a.value}
              onClick={() => setAccent(a.value)}
              className="w-8 h-8 rounded-full border-2"
              style={{ backgroundColor: a.value, borderColor: accent === a.value ? "#fff" : "transparent" }}
              title={a.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Bloque compartido: contenido de textos de la placa (badge/título/bullets/precio)
function ContentEditor({ badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet, priceLabel, setPriceLabel, price, setPrice, layoutStyle }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs md:text-sm text-neutral-400">Badge superior</label>
        <input
          value={badge}
          onChange={(e) => setBadge(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs md:text-sm text-neutral-400">Título (Enter = salto de línea)</label>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          rows={2}
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs md:text-sm text-neutral-400">{layoutStyle === "titular" ? "Incluye (el 1° se usa como cierre)" : "Incluye"}</label>
        {bullets.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={b}
              onChange={(e) => updateBullet(i, e.target.value)}
              className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
            />
            <button onClick={() => removeBullet(i)} className="text-neutral-500 px-1">
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button onClick={addBullet} className="text-xs md:text-sm text-emerald-400 flex items-center gap-1">
          <Plus size={14} /> Agregar ítem
        </button>
      </div>

      {layoutStyle === "promo" && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs md:text-sm text-neutral-400">Etiqueta de precio</label>
            <input
              value={priceLabel}
              onChange={(e) => setPriceLabel(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs md:text-sm text-neutral-400">Precio</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Bloque compartido: buscador de ideas con IA (inline)
function InlineIdeaSearch({ ideaTopic, setIdeaTopic, ideaVariants, ideaLoading, ideaError, ideaIsTemplate, generateIdea, onUse, mediaLabel }) {
  return (
    <CollapsibleSection title="Ideas con IA sobre el tema" icon={<Sparkles size={14} className="text-emerald-400" />}>
      <p className="text-xs md:text-sm text-neutral-500">
        Contanos brevemente sobre qué es {mediaLabel} (evento, destino, fecha) y te generamos 4 ideas de contenido
        listas para usar.
      </p>
      <div className="flex gap-2">
        <input
          value={ideaTopic}
          onChange={(e) => setIdeaTopic(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateIdea()}
          placeholder="Ej: Fórmula 1 en San Pablo"
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          onClick={generateIdea}
          disabled={ideaLoading}
          className="shrink-0 bg-gradient-to-br from-emerald-500 to-sky-500 text-neutral-950 font-semibold rounded-lg px-4 flex items-center gap-1.5 disabled:opacity-60"
        >
          {ideaLoading ? <Loader2 size={16} className="animate-spin" /> : "Generar"}
        </button>
      </div>
      {ideaError && <p className="text-xs md:text-sm text-rose-400">{ideaError}</p>}
      {ideaVariants && (
        <div className="space-y-2">
          {ideaIsTemplate && <p className="text-[10px] md:text-xs text-neutral-500">Plantilla base — editá lo que quieras</p>}
          {ideaVariants.map((idea, i) => (
            <IdeaCard key={i} idea={idea} onCreateImage={onUse ? () => onUse(idea) : undefined} compact />
          ))}
        </div>
      )}
    </CollapsibleSection>
  );
}

// Bloque compartido: "Ejemplos rápidos" colapsable
function ExamplesCollapsible({ EXAMPLES, onLoadExample }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5">
        <span className="text-sm md:text-base font-bold text-neutral-200">Ejemplos rápidos</span>
        <span className="text-neutral-500 text-xs md:text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.name}
              onClick={() => onLoadExample(ex)}
              className="text-left bg-neutral-800 border border-neutral-700 rounded-xl p-3 hover:border-neutral-600 transition-colors"
            >
              <span className="inline-block w-2.5 h-2.5 rounded-full mb-1.5" style={{ backgroundColor: ex.accent }} />
              <p className="text-xs md:text-sm font-semibold text-neutral-200 leading-tight">{ex.name}</p>
              <p className="text-[11px] md:text-sm text-neutral-500 mt-0.5">{ex.price}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

// Bloque genérico: sección desplegable reutilizable (Ideas con IA,
// Cargar imagen/video, etc.)
function CollapsibleSection({ title, icon, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5">
        <span className="text-sm md:text-base font-bold text-neutral-200 flex items-center gap-1.5">
          {icon}
          {title}
        </span>
        <span className="text-neutral-500 text-xs md:text-sm">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </section>
  );
}

// =====================================================================
// OVERLAY INTERACTIVO SOBRE EL LIENZO — permite hacer clic en cada
// elemento para editarlo ahí mismo, arrastrarlo (ícono ⠿) y cambiar su
// tamaño (tirando del punto verde). Comparte el mismo estado que el
// canvas real, así lo que ves acá es lo que se exporta.
// =====================================================================
function CanvasOverlay({
  elementBox, setElementBox, selectedElement, setSelectedElement,
  logo, setLogo, logoImageUrl,
  badge, setBadge, title, setTitle, bullets, setBullets, priceLabel, setPriceLabel, price, setPrice,
  accent, CW, CH,
}) {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.3);
  const dragRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.offsetWidth / CW);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [CW]);

  const onPointerMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    if (d.mode === "move") {
      const dxPct = ((e.clientX - d.startX) / d.rectW) * 100;
      const dyPct = ((e.clientY - d.startY) / d.rectH) * 100;
      setElementBox((prev) => ({
        ...prev,
        [d.key]: { ...prev[d.key], x: Math.max(0, Math.min(90, d.origX + dxPct)), y: Math.max(0, Math.min(95, d.origY + dyPct)) },
      }));
    } else {
      const delta = e.clientY - d.startY;
      setElementBox((prev) => ({
        ...prev,
        [d.key]: { ...prev[d.key], fontSize: Math.max(16, Math.min(160, d.origSize - delta * 0.4)) },
      }));
    }
  };
  const onPointerUp = () => {
    dragRef.current = null;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  };
  const onPointerDownDrag = (key, e) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedElement(key);
    const rect = containerRef.current.getBoundingClientRect();
    dragRef.current = { key, mode: "move", startX: e.clientX, startY: e.clientY, origX: elementBox[key].x, origY: elementBox[key].y, rectW: rect.width, rectH: rect.height };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };
  const onPointerDownResize = (key, e) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedElement(key);
    dragRef.current = { key, mode: "resize", startX: e.clientX, startY: e.clientY, origSize: elementBox[key].fontSize };
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const boxStyle = (key) => {
    const b = elementBox[key];
    return { position: "absolute", left: `${b.x}%`, top: `${b.y}%`, fontSize: `${b.fontSize * scale}px`, maxWidth: `${96 - b.x}%` };
  };
  const wrapClass = (key) =>
    `group ${
      selectedElement === key ? "outline outline-2 outline-emerald-400" : "outline outline-1 outline-dashed outline-transparent hover:outline-white/40"
    } outline-offset-2 rounded px-1`;
  const handle = (key) => (
    <span
      onPointerDown={(e) => onPointerDownDrag(key, e)}
      className="cursor-move opacity-0 group-hover:opacity-80 text-white text-[10px] select-none shrink-0 mt-0.5"
      title="Arrastrar"
    >
      ⠿
    </span>
  );
  const resizeHandle = (key) =>
    selectedElement === key && (
      <span
        onPointerDown={(e) => onPointerDownResize(key, e)}
        className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-emerald-400 rounded-full cursor-nwse-resize border border-neutral-900"
        title="Arrastrar para cambiar tamaño"
      />
    );

  const showLogo = logo.mode !== "none";
  const showBadge = !!badge;
  const showTitle = !!title;
  const showBullets = bullets.some((b) => b.trim());
  const showPrice = !!(priceLabel || price);

  return (
    <div ref={containerRef} className="absolute inset-0" onPointerDown={() => setSelectedElement(null)} style={{ fontFamily: "Manrope, sans-serif" }}>
      {showLogo && (
        <div style={boxStyle("logo")} className={wrapClass("logo")} onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-start gap-1">
            {handle("logo")}
            {logo.mode === "text" ? (
              <div
                contentEditable
                suppressContentEditableWarning
                onFocus={() => setSelectedElement("logo")}
                onBlur={(e) => setLogo((prev) => ({ ...prev, text: e.currentTarget.innerText }))}
                className="text-white/90 font-bold outline-none whitespace-nowrap"
              >
                {logo.text}
              </div>
            ) : (
              logoImageUrl && (
                <img src={logoImageUrl} alt="logo" style={{ height: `${elementBox.logo.fontSize * 1.8 * scale}px` }} className="object-contain" />
              )
            )}
          </div>
          {resizeHandle("logo")}
        </div>
      )}

      {showBadge && (
        <div style={boxStyle("badge")} className={wrapClass("badge")} onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-start gap-1">
            {handle("badge")}
            <div
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setSelectedElement("badge")}
              onBlur={(e) => setBadge(e.currentTarget.innerText)}
              className="font-extrabold uppercase outline-none whitespace-nowrap px-3 py-1 rounded-full"
              style={{ backgroundColor: accent, color: "#0b0b0b" }}
            >
              {badge}
            </div>
          </div>
          {resizeHandle("badge")}
        </div>
      )}

      {showTitle && (
        <div style={boxStyle("title")} className={wrapClass("title")} onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-start gap-1">
            {handle("title")}
            <div
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setSelectedElement("title")}
              onBlur={(e) => setTitle(e.currentTarget.innerText)}
              className="font-extrabold text-white outline-none whitespace-pre-wrap leading-tight"
            >
              {title}
            </div>
          </div>
          {resizeHandle("title")}
        </div>
      )}

      {showBullets && (
        <div style={boxStyle("bullets")} className={wrapClass("bullets")} onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-start gap-1">
            {handle("bullets")}
            <div
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setSelectedElement("bullets")}
              onBlur={(e) =>
                setBullets(
                  e.currentTarget.innerText
                    .split("\n")
                    .map((l) => l.replace(/^✓\s*/, ""))
                    .filter((l) => l.trim())
                )
              }
              className="text-neutral-100 outline-none whitespace-pre-wrap leading-snug"
            >
              {bullets
                .filter((b) => b.trim())
                .map((b) => `✓ ${b}`)
                .join("\n")}
            </div>
          </div>
          {resizeHandle("bullets")}
        </div>
      )}

      {showPrice && (
        <div style={boxStyle("price")} className={wrapClass("price")} onPointerDown={(e) => e.stopPropagation()}>
          <div className="flex items-start gap-1">
            {handle("price")}
            <div
              contentEditable
              suppressContentEditableWarning
              onFocus={() => setSelectedElement("price")}
              onBlur={(e) => {
                const lines = e.currentTarget.innerText.split("\n");
                setPriceLabel(lines[0] || "");
                setPrice(lines[1] || "");
              }}
              className="outline-none whitespace-pre-wrap leading-tight font-bold"
              style={{ color: accent }}
            >
              {[priceLabel, price].filter(Boolean).join("\n")}
            </div>
          </div>
          {resizeHandle("price")}
        </div>
      )}
    </div>
  );
}

// Bloque compartido: configuración del logo (texto / imagen / sin logo)
function LogoConfig({ logo, setLogo, logoImageUrl, handleLogoUpload }) {
  return (
    <div className="space-y-3">
      <label className="text-xs md:text-sm text-neutral-400">Logo</label>
      <div className="flex gap-2">
        <button
          onClick={() => setLogo((prev) => ({ ...prev, mode: "text" }))}
          className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
            logo.mode === "text" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Texto
        </button>
        <button
          onClick={() => setLogo((prev) => ({ ...prev, mode: "image" }))}
          className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
            logo.mode === "image" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Imagen
        </button>
        <button
          onClick={() => setLogo((prev) => ({ ...prev, mode: "none" }))}
          className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
            logo.mode === "none" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
          }`}
        >
          Sin logo
        </button>
      </div>
      {logo.mode === "text" && (
        <input
          value={logo.text}
          onChange={(e) => setLogo((prev) => ({ ...prev, text: e.target.value }))}
          placeholder="Texto del logo"
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm"
        />
      )}
      {logo.mode === "image" && (
        <div className="space-y-2">
          <label className="flex items-center justify-center gap-2 border border-dashed border-neutral-700 rounded-xl py-2.5 text-xs md:text-sm text-neutral-300 cursor-pointer hover:border-neutral-500 transition-colors">
            <Upload size={14} /> {logoImageUrl ? "Cambiar imagen del logo" : "Subir imagen del logo"}
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
          </label>
          {logoImageUrl && <img src={logoImageUrl} alt="logo" className="h-10 object-contain" />}
        </div>
      )}
      <p className="text-[11px] md:text-sm text-neutral-500">
        También podés arrastrar y editar el logo directo desde la vista previa.
      </p>
    </div>
  );
}


function ImageEditorBlock({
  canvasFormat, setCanvasFormat, FORMATS,
  imageMode, setImageMode,
  layoutStyle, applyLayoutPreset, titleScale, setTitleScale, scrimOpacity, setScrimOpacity,
  accent, setAccent, ACCENTS,
  badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet,
  priceLabel, setPriceLabel, price, setPrice,
  canvasRef, bgImageUrl, bgImageLoading,
  imageUrl, imageCaptureError, captureImage,
  carouselSlides, carouselGenerating, carouselError, generateCarousel, setCarouselSlides,
  elementBox, setElementBox, selectedElement, setSelectedElement,
  logo, setLogo, logoImageUrl, handleLogoUpload,
  onClose,
}) {
  const [configOpen, setConfigOpen] = useState(false);
  const { w, h } = FORMATS[canvasFormat];

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-bold text-neutral-200">Editor de placa</h2>
          <button onClick={onClose} className="text-[11px] md:text-sm text-neutral-500 underline underline-offset-2">
            Cerrar editor
          </button>
        </div>
      )}

      <div
        className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black mx-auto w-full"
        style={{ aspectRatio: `${w}/${h}`, maxWidth: w > h ? "100%" : 420 }}
      >
        <canvas ref={canvasRef} width={w} height={h} className="w-full h-full" />
        <CanvasOverlay
          elementBox={elementBox} setElementBox={setElementBox}
          selectedElement={selectedElement} setSelectedElement={setSelectedElement}
          logo={logo} setLogo={setLogo} logoImageUrl={logoImageUrl}
          badge={badge} setBadge={setBadge} title={title} setTitle={setTitle}
          bullets={bullets} setBullets={setBullets}
          priceLabel={priceLabel} setPriceLabel={setPriceLabel} price={price} setPrice={setPrice}
          accent={accent} CW={w} CH={h}
        />
        {bgImageLoading && (
          <div className="absolute top-2 left-2 bg-neutral-950/80 text-neutral-300 text-[9px] md:text-[11px] rounded-full px-2 py-0.5 flex items-center gap-1 pointer-events-none">
            <Loader2 size={9} className="animate-spin" /> Buscando foto…
          </div>
        )}
        {!bgImageLoading && !bgImageUrl && (
          <div className="absolute top-2 left-2 bg-neutral-950/80 text-neutral-300 text-[9px] md:text-[11px] rounded-full px-2 py-0.5 pointer-events-none">
            Color · sin foto
          </div>
        )}
      </div>

      <p className="text-[11px] md:text-sm text-neutral-500 text-center leading-snug">
        💡 Tocá cualquier texto para editarlo ahí mismo, arrastralo con el ⠿, o cambiá su tamaño desde el punto
        verde.
      </p>

      <button
        onClick={() => setConfigOpen(!configOpen)}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between text-sm md:text-base font-semibold text-neutral-200"
      >
        <span>⚙️ Configuración</span>
        <span className="text-neutral-500 text-xs md:text-sm">{configOpen ? "Ocultar ▲" : "Mostrar ▼"}</span>
      </button>

      {configOpen && (
        <div className="space-y-4">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <FormatPicker canvasFormat={canvasFormat} setCanvasFormat={setCanvasFormat} FORMATS={FORMATS} />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
            <label className="text-xs md:text-sm text-neutral-400">1 imagen o carrusel</label>
            <div className="flex gap-2">
              <button
                onClick={() => setImageMode("single")}
                className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
                  imageMode === "single" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                1 Imagen
              </button>
              <button
                onClick={() => setImageMode("carousel")}
                className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
                  imageMode === "carousel" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
                }`}
              >
                Carrusel
              </button>
            </div>
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 mb-3">Logo</h3>
            <LogoConfig logo={logo} setLogo={setLogo} logoImageUrl={logoImageUrl} handleLogoUpload={handleLogoUpload} />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 mb-3">Configuración de texto</h3>
            <TextConfig
              layoutStyle={layoutStyle} applyLayoutPreset={applyLayoutPreset}
              titleScale={titleScale} setTitleScale={setTitleScale}
              scrimOpacity={scrimOpacity} setScrimOpacity={setScrimOpacity}
              accent={accent} setAccent={setAccent} ACCENTS={ACCENTS}
              extraOpacityLabel="Opacidad del velo sobre la foto"
            />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 mb-3">Textos de la placa (alternativa al clic directo)</h3>
            <ContentEditor
              {...{ badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet, priceLabel, setPriceLabel, price, setPrice, layoutStyle }}
            />
          </section>
        </div>
      )}

      {/* Carrusel generado */}
      {(carouselGenerating || carouselSlides) && (
        <section className="bg-neutral-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold text-neutral-200">Carrusel generado</h2>
            {carouselSlides && (
              <button onClick={() => setCarouselSlides(null)} className="text-[11px] md:text-sm text-neutral-500 underline underline-offset-2">
                Cerrar
              </button>
            )}
          </div>
          {carouselGenerating && (
            <p className="text-xs md:text-sm text-neutral-400 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin" /> Generando las placas del carrusel…
            </p>
          )}
          {carouselError && <p className="text-xs md:text-sm text-rose-400">{carouselError}</p>}
          {carouselSlides && (
            <div className="grid grid-cols-2 gap-3">
              {carouselSlides.map((dataUrl, i) => (
                <div key={i} className="space-y-1.5">
                  <img src={dataUrl} alt={`Slide ${i + 1}`} className="w-full rounded-lg border border-neutral-800" style={{ aspectRatio: `${w}/${h}`, objectFit: "cover" }} />
                  <a href={dataUrl} download={`placa-carrusel-${i + 1}.png`} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 flex items-center justify-center gap-1.5 text-[11px] md:text-sm font-semibold">
                    <Download size={12} /> Slide {i + 1}
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Export */}
      <section className="space-y-3">
        {imageMode === "single" ? (
          <>
            <button onClick={captureImage} className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-neutral-950 font-bold rounded-xl py-3.5 flex items-center justify-center gap-2">
              <ImageIcon size={18} /> Generar placa (capturar imagen)
            </button>
            {imageCaptureError && <p className="text-xs md:text-sm text-rose-400">{imageCaptureError}</p>}
            {imageUrl && (
              <div className="space-y-2">
                <img src={imageUrl} alt="Placa capturada" className="w-full rounded-xl border border-neutral-800" style={{ aspectRatio: `${w}/${h}`, objectFit: "cover" }} />
                <a href={imageUrl} download="placa-proviajes.png" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 flex items-center justify-center gap-2 text-sm md:text-base font-semibold">
                  <Download size={16} /> Descargar en la mejor calidad (.png)
                </a>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() =>
              generateCarousel({
                badge, title, bullets, cierre: bullets[bullets.length - 1] || "",
                destinations: [], contentType: layoutStyle === "titular" ? "educativo" : "promocional",
              })
            }
            disabled={carouselGenerating}
            className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-neutral-950 font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {carouselGenerating ? <Loader2 size={18} className="animate-spin" /> : <LayoutGrid size={18} />}
            Generar carrusel con estos textos
          </button>
        )}
      </section>

      <ChatComingSoon />
    </div>
  );
}

// =====================================================================
// BLOQUE DE EDITOR — VIDEO (reutilizado en Generador de Placas e
// incrustado dentro de Ideas / Calendario)
// =====================================================================
function VideoEditorBlock({
  canvasFormat, setCanvasFormat, FORMATS,
  layoutStyle, applyLayoutPreset, titleScale, setTitleScale, scrimOpacity, setScrimOpacity,
  accent, setAccent, ACCENTS,
  badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet,
  priceLabel, setPriceLabel, price, setPrice,
  videoRef, canvasRef,
  videoUrl, videoError, videoWarning, isPlaying, togglePlay, isRecording, recordProgress,
  videoDuration, clipSeconds, setClipSeconds,
  setVideoError, setVideoWarning, setVideoDuration,
  startRecording, downloadUrl,
  elementBox, setElementBox, selectedElement, setSelectedElement,
  logo, setLogo, logoImageUrl, handleLogoUpload,
  onClose,
}) {
  const [configOpen, setConfigOpen] = useState(false);
  const { w, h } = FORMATS[canvasFormat];

  return (
    <div className="space-y-4">
      {onClose && (
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-bold text-neutral-200">Editor de placa</h2>
          <button onClick={onClose} className="text-[11px] md:text-sm text-neutral-500 underline underline-offset-2">
            Cerrar editor
          </button>
        </div>
      )}

      <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-black mx-auto w-full" style={{ aspectRatio: `${w}/${h}`, maxWidth: w > h ? "100%" : 420 }}>
        {videoUrl && (
          <video
            key={videoUrl}
            ref={videoRef}
            src={videoUrl}
            loop
            playsInline
            muted
            autoPlay
            style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
            crossOrigin={videoUrl.startsWith("blob:") ? undefined : "anonymous"}
            onLoadedData={() => {
              setVideoError("");
              setVideoWarning("");
            }}
            onError={(e) => {
              const mediaError = e.target.error;
              const isLocalFile = videoUrl.startsWith("blob:");
              let msg = "No se pudo cargar este video. Probá con otro ejemplo o subí el tuyo.";
              if (mediaError) {
                if (mediaError.code === 3 || mediaError.code === 4) {
                  msg = isLocalFile
                    ? "Este formato/códec de video no lo puede reproducir el navegador (frecuente en .MOV de iPhone en HEVC). Convertilo a .mp4, o Ajustes > Cámara > Formato > \"Más compatible\"."
                    : "Este video de fondo no se pudo cargar. Probá con otro ejemplo, buscá otro, o subí el tuyo.";
                } else if (mediaError.code === 2) {
                  msg = "Hubo un problema de conexión al cargar el video. Probá de nuevo.";
                }
              }
              setVideoError(msg);
            }}
            onLoadedMetadata={(e) => {
              const d = e.target.duration;
              if (d && isFinite(d)) {
                setVideoDuration(d);
                setClipSeconds(Math.min(60, Math.max(5, Math.round(d))));
              }
            }}
          />
        )}
        <canvas ref={canvasRef} width={w} height={h} className="w-full h-full" />
        <CanvasOverlay
          elementBox={elementBox} setElementBox={setElementBox}
          selectedElement={selectedElement} setSelectedElement={setSelectedElement}
          logo={logo} setLogo={setLogo} logoImageUrl={logoImageUrl}
          badge={badge} setBadge={setBadge} title={title} setTitle={setTitle}
          bullets={bullets} setBullets={setBullets}
          priceLabel={priceLabel} setPriceLabel={setPriceLabel} price={price} setPrice={setPrice}
          accent={accent} CW={w} CH={h}
        />

        {videoWarning && !videoError && (
          <div className="absolute top-2 left-2 right-2 bg-amber-500/95 text-neutral-950 text-[9px] md:text-[11px] rounded-lg px-2 py-1 leading-snug pointer-events-none">
            {videoWarning}
          </div>
        )}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/85 p-3 text-center pointer-events-none">
            <p className="text-[10px] md:text-xs text-neutral-300">{videoError}</p>
          </div>
        )}
        {isRecording && (
          <div className="absolute top-2 left-2 right-2 flex items-center gap-1.5 bg-black/70 rounded-full px-2 py-1 pointer-events-none">
            <Circle size={8} className="text-rose-500 fill-rose-500 animate-pulse" />
            <div className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500" style={{ width: `${recordProgress}%` }} />
            </div>
          </div>
        )}
        {videoUrl && (
          <button onClick={togglePlay} className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center z-10">
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
        )}
      </div>

      <p className="text-[11px] md:text-sm text-neutral-500 text-center leading-snug">
        💡 Tocá cualquier texto para editarlo ahí mismo, arrastralo con el ⠿, o cambiá su tamaño desde el punto
        verde.
      </p>

      <button
        onClick={() => setConfigOpen(!configOpen)}
        className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-3.5 flex items-center justify-between text-sm md:text-base font-semibold text-neutral-200"
      >
        <span>⚙️ Configuración</span>
        <span className="text-neutral-500 text-xs md:text-sm">{configOpen ? "Ocultar ▲" : "Mostrar ▼"}</span>
      </button>

      {configOpen && (
        <div className="space-y-4">
          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <FormatPicker canvasFormat={canvasFormat} setCanvasFormat={setCanvasFormat} FORMATS={FORMATS} />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-1">
            <label className="text-xs md:text-sm text-neutral-400">Duración del clip (hasta 1 minuto): {clipSeconds}s</label>
            <input
              type="range"
              min={5}
              max={Math.min(60, Math.round(videoDuration) || 60)}
              value={clipSeconds}
              onChange={(e) => setClipSeconds(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 mb-3">Logo</h3>
            <LogoConfig logo={logo} setLogo={setLogo} logoImageUrl={logoImageUrl} handleLogoUpload={handleLogoUpload} />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 mb-3">Configuración de texto</h3>
            <TextConfig
              layoutStyle={layoutStyle} applyLayoutPreset={applyLayoutPreset}
              titleScale={titleScale} setTitleScale={setTitleScale}
              scrimOpacity={scrimOpacity} setScrimOpacity={setScrimOpacity}
              accent={accent} setAccent={setAccent} ACCENTS={ACCENTS}
              extraOpacityLabel="Opacidad del velo sobre el video"
            />
          </section>

          <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
            <h3 className="text-sm md:text-base font-bold text-neutral-200 mb-3">Textos de la placa (alternativa al clic directo)</h3>
            <ContentEditor
              {...{ badge, setBadge, title, setTitle, bullets, setBullets, updateBullet, removeBullet, addBullet, priceLabel, setPriceLabel, price, setPrice, layoutStyle }}
            />
          </section>
        </div>
      )}

      <section className="space-y-3">
        <button
          onClick={startRecording}
          disabled={isRecording || !videoUrl}
          className={`w-full rounded-xl py-3.5 flex items-center justify-center gap-2 font-bold ${
            !videoUrl ? "bg-neutral-800 text-neutral-500" : "bg-gradient-to-r from-emerald-500 to-sky-500 text-neutral-950"
          } disabled:opacity-60`}
        >
          {isRecording ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Grabando placa…
            </>
          ) : (
            <>
              <Film size={18} /> Generar placa (grabar video)
            </>
          )}
        </button>
        {downloadUrl && (
          <a href={downloadUrl} download="placa-proviajes.webm" className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 flex items-center justify-center gap-2 text-sm md:text-base font-semibold">
            <Download size={16} /> Descargar en la mejor calidad (.webm)
          </a>
        )}
        <p className="text-[11px] md:text-sm text-neutral-500 leading-relaxed">
          Si alguna red no acepta .webm directo, un conversor rápido a .mp4 (o el propio celular al subir la
          historia) lo resuelve sin pérdida de calidad visible.
        </p>
      </section>

      <ChatComingSoon />
    </div>
  );
}

function ChatComingSoon() {
  return (
    <section className="bg-neutral-900/60 border border-dashed border-neutral-800 rounded-2xl p-4 flex items-center gap-3 opacity-70">
      <MessageCircle size={18} className="text-neutral-500 shrink-0" />
      <div>
        <p className="text-xs md:text-sm font-semibold text-neutral-400">Chat de edición con IA — Próximamente</p>
        <p className="text-[11px] md:text-sm text-neutral-600">Vas a poder pedirle cambios por chat y que los aplique solo.</p>
      </div>
    </section>
  );
}

// =====================================================================
// CREAR IMAGEN (pantalla completa dentro de Generador de Placas)
// =====================================================================
function CrearImagenScreen({
  editorProps, apiKey, setApiKey, showKeyHelp, setShowKeyHelp,
  photoQuery, setPhotoQuery, photoResults, photoSearching, photoSearchError, searchPhotosManually, selectPhoto, bgImageUrl,
  photoHasMore, photoLoadingMore, loadMorePhotos,
  handleImageUpload,
  ideaTopic, setIdeaTopic, ideaVariants, ideaLoading, ideaError, ideaIsTemplate, generateIdea,
  applyIdeaToEditor, autoSetBackgroundPhoto,
  EXAMPLES, onLoadExample,
}) {
  const [loadTab, setLoadTab] = useState("galeria"); // galeria | web

  return (
    <div className="space-y-4">
      <ExamplesCollapsible EXAMPLES={EXAMPLES} onLoadExample={onLoadExample} />

      <InlineIdeaSearch
        ideaTopic={ideaTopic} setIdeaTopic={setIdeaTopic} ideaVariants={ideaVariants} ideaLoading={ideaLoading}
        ideaError={ideaError} ideaIsTemplate={ideaIsTemplate} generateIdea={generateIdea}
        mediaLabel="la imagen"
        onUse={(idea) => {
          applyIdeaToEditor(idea);
          const q = (idea.destinations && idea.destinations[0]) || idea.dayName || idea.badge || "";
          autoSetBackgroundPhoto(q);
        }}
      />

      <CollapsibleSection title="Cargar imagen" icon={<ImageIcon size={14} className="text-emerald-400" />}>
        <div className="flex gap-2">
          <button
            onClick={() => setLoadTab("galeria")}
            className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
              loadTab === "galeria" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Desde galería
          </button>
          <button
            onClick={() => setLoadTab("web")}
            className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
              loadTab === "web" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Buscar en web
          </button>
        </div>

        {loadTab === "galeria" && (
          <label className="flex items-center justify-center gap-2 border border-dashed border-neutral-700 rounded-xl py-3 text-sm md:text-base text-neutral-300 cursor-pointer hover:border-neutral-500 transition-colors">
            <Upload size={16} /> Cargar imagen desde galería
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>
        )}

        {loadTab === "web" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs md:text-sm text-neutral-400">API key de Pexels (fotos)</label>
              <button onClick={() => setShowKeyHelp(!showKeyHelp)} className="text-[11px] md:text-sm text-emerald-400 underline underline-offset-2">
                ¿Cómo la consigo?
              </button>
            </div>
            {showKeyHelp && (
              <p className="text-[11px] md:text-sm text-neutral-400 leading-relaxed">
                Entrá a pexels.com/api, creá una cuenta gratis y copiá la key al instante. Sirve para fotos y videos.
                Se guarda sola para la próxima vez.
              </p>
            )}
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Pegá tu API key acá"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <input
                value={photoQuery}
                onChange={(e) => setPhotoQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchPhotosManually()}
                placeholder="Buscar foto real (ej: Madrid street)"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={searchPhotosManually} disabled={photoSearching} className="shrink-0 bg-neutral-700 rounded-lg px-3 flex items-center justify-center disabled:opacity-60">
                {photoSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              </button>
            </div>
            {photoSearchError && <p className="text-[11px] md:text-sm text-rose-400">{photoSearchError}</p>}
            {photoResults.length > 0 && (
              <>
                <div className="grid grid-cols-4 gap-1.5">
                  {photoResults.map((p, i) => (
                    <button
                      key={`${p.id}-${i}`}
                      onClick={() => selectPhoto(p)}
                      className={`aspect-[9/16] rounded-md overflow-hidden border-2 ${
                        bgImageUrl === (p.src.large2x || p.src.large || p.src.original) ? "border-emerald-400" : "border-transparent"
                      }`}
                    >
                      <img src={p.src.tiny} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                {photoHasMore && (
                  <button
                    onClick={loadMorePhotos}
                    disabled={photoLoadingMore}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {photoLoadingMore ? <Loader2 size={14} className="animate-spin" /> : null} Ver más
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </CollapsibleSection>

      <ImageEditorBlock {...editorProps} />
    </div>
  );
}

// =====================================================================
// CREAR VIDEO (pantalla completa dentro de Generador de Placas)
// =====================================================================
function CrearVideoScreen({
  editorProps, apiKey, setApiKey, showKeyHelp, setShowKeyHelp,
  query, setQuery, results, searching, searchError, doSearch, selectVideo, pickBestFile, videoUrl,
  videoHasMore, videoLoadingMore, loadMoreVideos,
  handleVideoUpload,
  ideaTopic, setIdeaTopic, ideaVariants, ideaLoading, ideaError, ideaIsTemplate, generateIdea, applyIdeaToEditor,
  EXAMPLES, onLoadExample,
}) {
  const [loadTab, setLoadTab] = useState("galeria"); // galeria | web

  return (
    <div className="space-y-4">
      <ExamplesCollapsible EXAMPLES={EXAMPLES} onLoadExample={onLoadExample} />

      <InlineIdeaSearch
        ideaTopic={ideaTopic} setIdeaTopic={setIdeaTopic} ideaVariants={ideaVariants} ideaLoading={ideaLoading}
        ideaError={ideaError} ideaIsTemplate={ideaIsTemplate} generateIdea={generateIdea}
        mediaLabel="el video"
        onUse={(idea) => applyIdeaToEditor(idea)}
      />

      <CollapsibleSection title="Cargar video" icon={<Film size={14} className="text-emerald-400" />}>
        <div className="flex gap-2">
          <button
            onClick={() => setLoadTab("galeria")}
            className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
              loadTab === "galeria" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Desde galería
          </button>
          <button
            onClick={() => setLoadTab("web")}
            className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
              loadTab === "web" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
            }`}
          >
            Buscar en web
          </button>
        </div>

        {loadTab === "galeria" && (
          <label className="flex items-center justify-center gap-2 border border-dashed border-neutral-700 rounded-xl py-3 text-sm md:text-base text-neutral-300 cursor-pointer hover:border-neutral-500 transition-colors">
            <Upload size={16} /> Cargar video desde galería
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
          </label>
        )}

        {loadTab === "web" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs md:text-sm text-neutral-400">API key de Pexels (videos)</label>
              <button onClick={() => setShowKeyHelp(!showKeyHelp)} className="text-[11px] md:text-sm text-emerald-400 underline underline-offset-2">
                ¿Cómo la consigo?
              </button>
            </div>
            {showKeyHelp && (
              <p className="text-[11px] md:text-sm text-neutral-400 leading-relaxed">
                Entrá a pexels.com/api, creá una cuenta gratis y copiá la key al instante. Sirve para fotos y videos.
                Se guarda sola para la próxima vez.
              </p>
            )}
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Pegá tu API key acá"
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder="Ej: Formula 1 Brazil track"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button onClick={doSearch} disabled={searching} className="shrink-0 bg-neutral-700 rounded-lg px-4 flex items-center gap-1.5 disabled:opacity-60">
                {searching ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              </button>
            </div>
            {searchError && <p className="text-xs md:text-sm text-rose-400">{searchError}</p>}
            {results.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-2">
                  {results.map((v, i) => (
                    <button
                      key={`${v.id}-${i}`}
                      onClick={() => selectVideo(v)}
                      className={`relative aspect-[9/16] rounded-lg overflow-hidden border-2 ${
                        videoUrl === pickBestFile(v) ? "border-emerald-400" : "border-transparent"
                      }`}
                    >
                      <video
                        src={pickBestFile(v)}
                        poster={v.image}
                        muted
                        loop
                        playsInline
                        preload="none"
                        className="w-full h-full object-cover"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <span className="absolute bottom-1 right-1 text-[10px] md:text-xs bg-black/70 px-1 rounded">{Math.round(v.duration)}s</span>
                    </button>
                  ))}
                </div>
                {videoHasMore && (
                  <button
                    onClick={loadMoreVideos}
                    disabled={videoLoadingMore}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 text-xs md:text-sm font-semibold flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {videoLoadingMore ? <Loader2 size={14} className="animate-spin" /> : null} Ver más
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </CollapsibleSection>

      <VideoEditorBlock {...editorProps} />
    </div>
  );
}

// =====================================================================
// GENERADOR DE IDEAS
// =====================================================================
function IdeasScreen({
  ideaTopic, setIdeaTopic, ideaVariants, ideaLoading, ideaError, ideaIsTemplate, generateIdea,
  ideaFormatPref, setIdeaFormatPref,
  editorMode, setEditorMode, onCreateImage, onCreateVideo, onGenerateCarousel,
  imageEditorProps, videoEditorProps,
}) {
  return (
    <div className="space-y-6 pt-2">
      <div>
        <h2 className="text-lg md:text-2xl font-bold">Ideas para tu próxima placa</h2>
        <p className="text-sm md:text-base text-neutral-400 mt-1.5 leading-relaxed">
          Contanos un evento, destino o fecha (ej: "Campeonato del Mundo", "Concierto de Tini en Buenos Aires", "Día
          de los Muertos en México") y te damos 4 ideas: educativa, inspiracional, de entretenimiento y promocional.
        </p>
      </div>

      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
        <label className="text-xs md:text-sm text-neutral-400">¿Ideas para...?</label>
        <div className="flex gap-2">
          {[
            { key: "imagen", label: "Imágenes" },
            { key: "video", label: "Videos" },
            { key: "ambas", label: "Ambas" },
          ].map((opt) => (
            <button
              key={opt.key}
              onClick={() => setIdeaFormatPref(opt.key)}
              className={`flex-1 text-xs md:text-sm font-semibold rounded-lg py-2 transition-colors ${
                ideaFormatPref === opt.key ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800 text-neutral-400"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={ideaTopic}
            onChange={(e) => setIdeaTopic(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateIdea()}
            placeholder="Ej: Concierto de Tini en Buenos Aires"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={generateIdea}
            disabled={ideaLoading}
            className="shrink-0 bg-gradient-to-br from-emerald-500 to-sky-500 text-neutral-950 font-semibold rounded-lg px-4 flex items-center gap-1.5 disabled:opacity-60"
          >
            {ideaLoading ? <Loader2 size={16} className="animate-spin" /> : "Generar"}
          </button>
        </div>
        {ideaError && <p className="text-xs md:text-sm text-rose-400">{ideaError}</p>}
      </section>

      {ideaVariants && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm md:text-base font-bold text-neutral-200">Elegí una variante</h2>
            {ideaIsTemplate && <span className="text-[10px] md:text-xs text-neutral-500">Plantilla base — editá lo que quieras</span>}
          </div>
          <div className="space-y-3">
            {ideaVariants.map((idea, i) => (
              <IdeaCard
                key={i}
                idea={idea}
                onCreateImage={ideaFormatPref !== "video" ? () => onCreateImage(idea) : undefined}
                onCreateVideo={ideaFormatPref !== "imagen" ? () => onCreateVideo(idea) : undefined}
                onGenerateCarousel={() => onGenerateCarousel(idea)}
              />
            ))}
          </div>
        </section>
      )}

      {!ideaVariants && !ideaLoading && (
        <div className="text-center py-10 text-neutral-500 text-sm md:text-base">
          Escribí un tema arriba para empezar. Cuanto más específico (evento + lugar + fecha), mejores las ideas.
        </div>
      )}

      {editorMode && (
        <div className="border-t border-neutral-800 pt-5">
          {editorMode === "imagen" && <ImageEditorBlock {...imageEditorProps} onClose={() => setEditorMode(null)} />}
          {editorMode === "video" && <VideoEditorBlock {...videoEditorProps} onClose={() => setEditorMode(null)} />}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// CALENDARIO
// =====================================================================
function CalendarioScreen(props) {
  const {
    monthsToShow, MONTH_LABELS, WEEKDAY_LETTERS, getMonthGrid, eventsOnDay, shiftMonthWindow,
    selectedDay, setSelectedDay, CATEGORY_STYLES,
    showAddEvent, setShowAddEvent, newEvent, setNewEvent, addCustomEvent, deleteCustomEvent,
    dayIdeas, fetchDayIdeas, eventInfo, fetchEventInfo,
    editorMode, setEditorMode, onCreateImage, onCreateVideo, onGenerateCarousel,
    imageEditorProps, videoEditorProps,
  } = props;

  const selectedEvents = selectedDay ? eventsOnDay(selectedDay.month, selectedDay.day) : [];

  return (
    <div className="space-y-6 pt-2">
      <div>
        <h2 className="text-lg md:text-2xl font-bold">Calendario de fechas</h2>
        <p className="text-sm md:text-base text-neutral-400 mt-1.5 leading-relaxed">
          Fechas festivas, deportivas y de espectáculos. Tocá un día con puntos de color para ver los eventos y
          generar ideas y placas al instante.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-[11px] md:text-sm text-neutral-400">
        {Object.entries(CATEGORY_STYLES).map(([key, s]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <button onClick={() => shiftMonthWindow(-1)} className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => setShowAddEvent(!showAddEvent)}
          className="flex items-center gap-1.5 text-xs md:text-sm font-semibold bg-emerald-500 text-neutral-950 rounded-full px-3 py-1.5"
        >
          <Plus size={14} /> Agregar evento
        </button>
        <button onClick={() => shiftMonthWindow(1)} className="w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
          <ChevronRight size={16} />
        </button>
      </div>

      {showAddEvent && (
        <section className="bg-neutral-900 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
          <h3 className="text-sm md:text-base font-bold text-neutral-200">Nuevo evento</h3>
          <input
            value={newEvent.name}
            onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
            placeholder="Nombre del evento (ej: Concierto de X en Y)"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={newEvent.month}
              onChange={(e) => setNewEvent({ ...newEvent, month: e.target.value })}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
            >
              {MONTH_LABELS.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            <input
              value={newEvent.day}
              onChange={(e) => setNewEvent({ ...newEvent, day: e.target.value })}
              placeholder="Día (ej: 20)"
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
            />
          </div>
          <input
            value={newEvent.place}
            onChange={(e) => setNewEvent({ ...newEvent, place: e.target.value })}
            placeholder="Lugar (ej: Movistar Arena, Buenos Aires)"
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm md:text-base"
          />
          <div className="flex gap-2">
            {Object.entries(CATEGORY_STYLES).map(([key, s]) => (
              <button
                key={key}
                onClick={() => setNewEvent({ ...newEvent, category: key })}
                className={`flex-1 text-[11px] md:text-sm font-semibold rounded-lg py-2 transition-colors ${
                  newEvent.category === key ? "text-neutral-950" : "bg-neutral-800 text-neutral-400"
                }`}
                style={newEvent.category === key ? { backgroundColor: s.color } : {}}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button onClick={addCustomEvent} className="w-full bg-emerald-500 text-neutral-950 font-bold rounded-lg py-2.5 text-sm md:text-base">
            Guardar evento
          </button>
        </section>
      )}

      {/* Meses chicos, uno al lado del otro */}
      <div className="grid grid-cols-3 gap-2">
        {monthsToShow.map((monthDate) => {
          const year = monthDate.getFullYear();
          const month = monthDate.getMonth();
          const weeks = getMonthGrid(year, month);
          return (
            <section key={`${year}-${month}`} className="bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 space-y-1">
              <h3 className="text-[10px] md:text-xs font-bold text-neutral-300 text-center leading-tight">
                {MONTH_LABELS[month].slice(0, 3)} {String(year).slice(2)}
              </h3>
              <div className="grid grid-cols-7 gap-px text-center">
                {WEEKDAY_LETTERS.map((d, i) => (
                  <div key={i} className="text-[7px] md:text-[9px] text-neutral-500 font-semibold">
                    {d}
                  </div>
                ))}
                {weeks.flat().map((day, i) => {
                  if (day === null) return <div key={i} />;
                  const evts = eventsOnDay(month, day);
                  const isSelected = selectedDay && selectedDay.month === month && selectedDay.day === day;
                  return (
                    <button
                      key={i}
                      onClick={() => (evts.length > 0 ? setSelectedDay(isSelected ? null : { month, day }) : null)}
                      className={`aspect-square rounded flex flex-col items-center justify-center text-[8px] md:text-[10px] leading-none ${
                        isSelected ? "bg-emerald-500 text-neutral-950 font-bold" : evts.length > 0 ? "bg-neutral-800 text-neutral-100" : "text-neutral-600"
                      }`}
                    >
                      <span>{day}</span>
                      {evts.length > 0 && (
                        <span className="flex gap-px mt-px">
                          {[...new Set(evts.map((e) => e.category))].slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="w-1 h-1 rounded-full"
                              style={{ backgroundColor: isSelected ? "#0a0a0a" : CATEGORY_STYLES[cat]?.color }}
                            />
                          ))}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Fechas variables (Carnaval, Semana Santa, etc.) que no tienen día fijo */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-2">
        <h3 className="text-xs md:text-sm font-bold text-neutral-400">Fechas variables (sin día fijo en el calendario)</h3>
        {buildFestiveEvents()
          .filter((e) => e.day === null)
          .map((e) => (
            <button
              key={e.id}
              onClick={() => setSelectedDay({ month: e.month, day: "variable", variableId: e.id })}
              className="w-full text-left text-xs md:text-sm text-neutral-300 bg-neutral-800 rounded-lg px-3 py-2"
            >
              {e.name} · {MONTH_LABELS[e.month]} ({e.dayLabel})
            </button>
          ))}
      </section>

      {/* Detalle del día seleccionado */}
      {selectedDay && (
        <section className="space-y-3">
          <h2 className="text-sm md:text-base font-bold text-neutral-200">
            Eventos —{" "}
            {selectedDay.day === "variable"
              ? "fecha variable"
              : `${selectedDay.day} de ${MONTH_LABELS[selectedDay.month]}`}
          </h2>
          {(selectedDay.day === "variable"
            ? buildFestiveEvents().filter((e) => e.id === selectedDay.variableId)
            : selectedEvents
          ).map((evt) => (
            <EventDetailCard
              key={evt.id}
              evt={evt}
              CATEGORY_STYLES={CATEGORY_STYLES}
              dayIdeas={dayIdeas}
              fetchDayIdeas={fetchDayIdeas}
              eventInfo={eventInfo}
              fetchEventInfo={fetchEventInfo}
              onCreateImage={onCreateImage}
              onCreateVideo={onCreateVideo}
              onGenerateCarousel={onGenerateCarousel}
              deleteCustomEvent={deleteCustomEvent}
              isCustom={evt.id.startsWith("custom-")}
            />
          ))}
        </section>
      )}

      {editorMode && (
        <div className="border-t border-neutral-800 pt-5">
          {editorMode === "imagen" && <ImageEditorBlock {...imageEditorProps} onClose={() => setEditorMode(null)} />}
          {editorMode === "video" && <VideoEditorBlock {...videoEditorProps} onClose={() => setEditorMode(null)} />}
        </div>
      )}
    </div>
  );
}

function EventDetailCard({ evt, CATEGORY_STYLES, dayIdeas, fetchDayIdeas, eventInfo, fetchEventInfo, onCreateImage, onCreateVideo, onGenerateCarousel, deleteCustomEvent, isCustom }) {
  const ideasState = dayIdeas[evt.id];
  const infoState = eventInfo[evt.id];
  const catStyle = CATEGORY_STYLES[evt.category];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-semibold rounded-full px-2 py-0.5 mb-1" style={{ backgroundColor: `${catStyle?.color}22`, color: catStyle?.color }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: catStyle?.color }} />
            {catStyle?.label}
          </span>
          <h3 className="text-sm md:text-base font-bold text-neutral-100">{evt.name}</h3>
          <p className="text-xs md:text-sm text-neutral-500">
            {evt.dayLabel ?? evt.day} · {evt.isWorldDay ? "Día mundial" : evt.place || "Lugar a confirmar"}
          </p>
        </div>
        {isCustom && (
          <button onClick={() => deleteCustomEvent(evt.id)} className="text-neutral-600 shrink-0">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {!infoState && (
        <button onClick={() => fetchEventInfo(evt)} className="text-xs md:text-sm font-semibold text-sky-400 flex items-center gap-1.5">
          <Info size={13} /> Info del evento
        </button>
      )}
      {infoState && infoState.loading && (
        <p className="text-xs md:text-sm text-neutral-500 flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" /> Buscando información…
        </p>
      )}
      {infoState && !infoState.loading && infoState.text && <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">{infoState.text}</p>}
      {infoState && !infoState.loading && infoState.error && <p className="text-xs md:text-sm text-amber-400 leading-relaxed">{infoState.error}</p>}

      {!ideasState && (
        <button onClick={() => fetchDayIdeas(evt)} className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2.5 text-xs md:text-sm font-semibold text-neutral-200">
          Ver ideas de contenido
        </button>
      )}
      {ideasState && ideasState.loading && (
        <p className="text-xs md:text-sm text-neutral-500 flex items-center gap-1.5">
          <Loader2 size={12} className="animate-spin" /> Generando ideas…
        </p>
      )}
      {ideasState && ideasState.variants && (
        <div className="space-y-2 pt-1">
          {ideasState.isTemplate && <p className="text-[10px] md:text-xs text-neutral-500">Plantilla base — editá lo que quieras</p>}
          {ideasState.variants.map((idea, i) => (
            <IdeaCard
              key={i}
              idea={idea}
              onCreateImage={() => onCreateImage(idea)}
              onCreateVideo={() => onCreateVideo(idea)}
              onGenerateCarousel={() => onGenerateCarousel(idea)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// =====================================================================
// IDEA CARD (reutilizable)
// =====================================================================
function IdeaCard({ idea, onCreateImage, onCreateVideo, onGenerateCarousel, compact }) {
  const typeStyle = CONTENT_TYPE_STYLES[idea.contentType];
  const isCarousel = (idea.format || "").toLowerCase().includes("carrusel");
  const slideCount = isCarousel ? 1 + (idea.bullets ? idea.bullets.length : 0) + (idea.cierre ? 1 : 0) : 0;

  return (
    <div className="rounded-2xl p-4 space-y-3 border bg-neutral-900 border-neutral-800">
      <div>
        <h3 className="text-sm md:text-base font-bold text-neutral-100">{idea.dayName}</h3>
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {typeStyle && <span className={`inline-block text-[10px] md:text-xs font-semibold rounded-full px-2 py-0.5 ${typeStyle.cls}`}>{typeStyle.label}</span>}
          {idea.format && <span className="inline-block text-[10px] md:text-xs font-semibold text-neutral-400 bg-neutral-800 rounded-full px-2 py-0.5">{idea.format}</span>}
        </div>
      </div>

      {!compact && <p className="text-xs md:text-sm text-neutral-300 leading-relaxed">{idea.idea}</p>}

      {!compact && idea.script && idea.script.length > 0 && (
        <ul className="space-y-1">
          {idea.script.map((s, i) => (
            <li key={i} className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              • {s}
            </li>
          ))}
        </ul>
      )}

      {!compact && idea.cierre && <p className="text-xs md:text-sm text-neutral-300 italic">"{idea.cierre}"</p>}

      {!compact && idea.destinations && idea.destinations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {idea.destinations.map((d, i) => (
            <span key={i} className="text-[11px] md:text-sm bg-neutral-800 text-neutral-300 rounded-full px-2.5 py-1">
              {d}
            </span>
          ))}
        </div>
      )}

      {isCarousel && onGenerateCarousel && (
        <button onClick={onGenerateCarousel} className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 text-neutral-950 rounded-lg py-2.5 text-xs md:text-sm font-bold">
          Generar carrusel automático ({slideCount} placas)
        </button>
      )}

      <div className="flex gap-2">
        {onCreateImage && (
          <button onClick={onCreateImage} className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg py-2.5 text-xs md:text-sm font-semibold text-neutral-200 flex items-center justify-center gap-1.5">
            <ImageIcon size={13} /> Foto
          </button>
        )}
        {onCreateVideo && (
          <button onClick={onCreateVideo} className="flex-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg py-2.5 text-xs md:text-sm font-semibold text-neutral-200 flex items-center justify-center gap-1.5">
            <Film size={13} /> Video
          </button>
        )}
      </div>
    </div>
  );
}
