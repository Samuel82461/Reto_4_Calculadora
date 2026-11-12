// Referencia a la pantalla de la calculadora
const pantalla = document.getElementById("pantalla");

// Estado de la calculadora
let primerNumero = null;   // primer número de la operación
let operador = null;       // operación elegida (+, -, *, /)
let numeroActual = "";     // número que se está escribiendo
let reiniciar = false;     // indica si se acaba de mostrar un resultado

// Símbolos que se muestran en pantalla para cada operación
const simbolos = { "+": "+", "-": "−", "*": "×", "/": "÷" };

// Muestra en pantalla la operación actual
function mostrar() {
  let texto = "";
  if (primerNumero !== null) texto += primerNumero;
  if (operador !== null) texto += " " + simbolos[operador] + " ";
  texto += numeroActual;
  pantalla.textContent = texto === "" ? "0" : texto;
}

// Reinicia cualquier operación y limpia la pantalla
function limpiar() {
  primerNumero = null;
  operador = null;
  numeroActual = "";
  reiniciar = false;
  mostrar();
}

// Agrega un número (o el punto decimal) a la pantalla
function agregarNumero(valor) {
  if (reiniciar) {
    limpiar();
  }
  if (valor === "." && numeroActual.includes(".")) return;
  if (valor === "." && numeroActual === "") numeroActual = "0";
  if (numeroActual === "0" && valor !== ".") numeroActual = "";
  numeroActual += valor;
  mostrar();
}

// Realiza la operación entre dos números
function operar(a, b, operacion) {
  switch (operacion) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? null : a / b;
    default: return null;
  }
}

// Guarda la operación elegida y espera el siguiente número
function elegirOperacion(nuevaOperacion) {
  if (numeroActual === "" && primerNumero === null) return;

  // Si ya hay una operación completa, se calcula antes de continuar
  if (primerNumero !== null && operador !== null && numeroActual !== "") {
    calcular();
    if (primerNumero === null) return; // hubo un error
  } else if (primerNumero === null) {
    primerNumero = numeroActual;
    numeroActual = "";
  }

  operador = nuevaOperacion;
  reiniciar = false;
  mostrar();
}

// Calcula y muestra el resultado
function calcular() {
  if (primerNumero === null || operador === null || numeroActual === "") return;

  const resultado = operar(parseFloat(primerNumero), parseFloat(numeroActual), operador);

  if (resultado === null) {
    pantalla.textContent = "No se puede dividir entre 0";
    primerNumero = null;
    operador = null;
    numeroActual = "";
    reiniciar = true;
    return;
  }

  // Se redondea para evitar errores de decimales (por ejemplo 0.1 + 0.2)
  primerNumero = String(parseFloat(resultado.toFixed(10)));
  operador = null;
  numeroActual = "";
  reiniciar = false;
  pantalla.textContent = primerNumero;
  reiniciar = true;
}

// Eventos de los botones numéricos
document.querySelectorAll("[data-numero]").forEach(function (boton) {
  boton.addEventListener("click", function () {
    agregarNumero(boton.dataset.numero);
  });
});

// Eventos de los botones de operación
document.querySelectorAll("[data-operacion]").forEach(function (boton) {
  boton.addEventListener("click", function () {
    elegirOperacion(boton.dataset.operacion);
  });
});

// Evento del botón de resultado
document.getElementById("resultado").addEventListener("click", calcular);

// Evento del botón de limpiar
document.getElementById("limpiar").addEventListener("click", limpiar);
