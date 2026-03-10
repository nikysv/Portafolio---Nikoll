const UI = {
  cuerpo: document.body,
  temas: {
    rosado: {
      fondo: "#efbfcf",
      texto: "#2d1b2e",
      skillColor: "#8b1a5c",
      skillFondo: "rgba(139, 26, 92, 0.15)",
      skillHoverFondo: "#8b1a5c",
      skillHoverTexto: "#fff",
    },
    blanco: {
      fondo: "#ffffff",
      texto: "#333333",
      skillColor: "#ff66b2",
      skillFondo: "rgba(255, 102, 178, 0.1)",
      skillHoverFondo: "#ff66b2",
      skillHoverTexto: "#fff",
    },
    gris: {
      fondo: "#d3d3d3",
      texto: "#1a1a1a",
      skillColor: "#6b1f5e",
      skillFondo: "rgba(107, 31, 94, 0.2)",
      skillHoverFondo: "#6b1f5e",
      skillHoverTexto: "#fff",
    },
  },

  cambiarColor(color) {
    const tema = this.temas[color] || this.temas.blanco;
    this.cuerpo.style.background = tema.fondo;
    this.cuerpo.style.color = tema.texto;

    document.querySelectorAll(".skill-tag").forEach((tag) => {
      tag.style.color = tema.skillColor;
      tag.style.borderColor = tema.skillColor;
      tag.style.background = tema.skillFondo;

      const newTag = tag.cloneNode(true);
      tag.parentNode.replaceChild(newTag, tag);

      newTag.addEventListener("mouseenter", function () {
        this.style.background = tema.skillHoverFondo;
        this.style.color = tema.skillHoverTexto;
        const stars = this.querySelector(".stars");
        if (stars) stars.style.color = tema.skillHoverTexto;
      });

      newTag.addEventListener("mouseleave", function () {
        this.style.background = tema.skillFondo;
        this.style.color = tema.skillColor;
        const stars = this.querySelector(".stars");
        if (stars) stars.style.color = tema.skillColor;
      });
    });
  },

  irASeccion(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  },

  efectoEscritura(texto, elementoId) {
    const el = document.getElementById(elementoId);
    if (!el) return;
    let i = 0;
    const escribir = () => {
      if (i < texto.length) {
        el.textContent += texto[i++];
        setTimeout(escribir, 100);
      }
    };
    escribir();
  },

  inicializarSelector() {
    this.selector = document.getElementById("colorSelector");
    this.selector?.addEventListener("change", () =>
      this.cambiarColor(this.selector.value),
    );
  },
};

// --- MÓDULO: Gestión de Proyectos (con Delegación de Eventos) ---
const Proyectos = {
  contenedor: null,
  contadorClics: null,

  // Inicializar contador con closure
  crearContador(inicial = 0) {
    let contador = inicial;
    return {
      incrementar(nombreProyecto) {
        contador++;
        console.log(
          `✨ Total de clics en proyectos: ${contador} | Último: ${nombreProyecto}`,
        );
        return contador;
      },
      obtenerTotal: () => contador,
    };
  },

  inicializar() {
    this.contadorClics = this.crearContador();
    this.contenedor = document.getElementById("proyectos");

    if (!this.contenedor) return;

    this.contenedor.addEventListener("click", (evento) => {
      const tarjeta = evento.target.closest(".project-card");
        const nombreProyecto =
          tarjeta.querySelector(".project-title")?.innerText;
        if (nombreProyecto) {
          alert(`Haz hecho clic en el proyecto: ${nombreProyecto}`);
        }
    });

    this.contenedor.addEventListener("mouseover", (evento) => {
      const tarjeta = evento.target.closest(".project-card");
      if (tarjeta) {
        tarjeta.style.transform = "translateY(-8px)";
        tarjeta.style.transition = "all 0.3s ease";
      }
    });

    this.contenedor.addEventListener("mouseout", (evento) => {
      const tarjeta = evento.target.closest(".project-card");
      if (tarjeta && !tarjeta.contains(evento.relatedTarget)) {
        tarjeta.style.transform = "translateY(0)";
      }
    });
  },
};

// --- MÓDULO: Sistema de Rastreador de Secciones ---
const Rastreador = {
  rastreadores: {},

  crearRastreadorDeSeccion: function (nombreSeccion) {
    let conteoVisitas = 0;
    return {
      incrementar: function () {
        conteoVisitas++;
        console.log(
          `Has visitado la sección "${nombreSeccion}" ${conteoVisitas} ${conteoVisitas === 1 ? "vez" : "veces"}`,
        );
        return conteoVisitas;
      },
      obtenerTotal: function () {
        return conteoVisitas;
      },
    };
  },

  inicializar: function () {
    // Crear rastreadores para TODAS las secciones
    this.rastreadores = {
      inicio: this.crearRastreadorDeSeccion("Inicio"),
      "sobre-mi": this.crearRastreadorDeSeccion("Sobre Mí"),
      experiencia: this.crearRastreadorDeSeccion("Experiencia"),
      proyectos: this.crearRastreadorDeSeccion("Proyectos"),
      logros: this.crearRastreadorDeSeccion("Logros"),
      contacto: this.crearRastreadorDeSeccion("Contacto"),
    };

    // Configurar Intersection Observer
    const observerOptions = {
      threshold: 0.3, // Se activa cuando el 30% de la sección es visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const rastreador = this.rastreadores[entry.target.id];
          if (rastreador) {
            rastreador.incrementar();
          }
        }
      });
    }, observerOptions);

    Object.keys(this.rastreadores).forEach((seccionId) => {
      const seccion = document.getElementById(seccionId);
      if (seccion) observer.observe(seccion);
    });
  },
};

const App = {
  inicializar: function () {
    UI.inicializarSelector();
    UI.efectoEscritura(
      '"Debugging in heels, coding with style."',
      "typewriter",
    );

    Proyectos.inicializar();

    Rastreador.inicializar();

    console.log("Aplicación inicializada correctamente");
  },
};

document.addEventListener("DOMContentLoaded", () => App.inicializar());
