import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAiNdx1391pxaKTdNdv3N4inVjbOi6pBPc",
  authDomain: "fir-control-gastos-7e6f2.firebaseapp.com",
  projectId: "fir-control-gastos-7e6f2",
  storageBucket: "fir-control-gastos-7e6f2.firebasestorage.app",
  messagingSenderId: "385632762332",
  appId: "1:385632762332:web:dfe2c0cd5baf0ef4cc3719"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app-container");
const signInButton = document.getElementById("sign-in-button");
const signOutButton = document.getElementById("sign-out-button");
const welcomeText = document.getElementById("welcome-text");
const totalDisplay = document.getElementById("total-gastos");
const expensesList = document.getElementById("expenses-list");
const expenseForm = document.getElementById("expense-form");
const conceptInput = document.getElementById("concepto");
const amountInput = document.getElementById("cantidad");
const dateInput = document.getElementById("fecha");
const formStatus = document.getElementById("form-status");
const loginStatus = document.getElementById("login-status");

let unsubscribeExpenses = null;

function showLogin() {
  loginContainer.classList.remove("hidden");
  appContainer.classList.add("hidden");
}

function showApp(user) {
  loginContainer.classList.add("hidden");
  appContainer.classList.remove("hidden");
  welcomeText.textContent = `Hola, ${user.displayName || "usuario"}`;
  formStatus.textContent = "";
  loginStatus.textContent = "";
}

function clearExpenses() {
  expensesList.innerHTML = "";
  totalDisplay.textContent = "$0.00";
}

function renderExpenses(snapshot) {
  const items = [];
  let total = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();
    items.push({
      id: doc.id,
      concepto: data.concepto,
      cantidad: Number(data.cantidad) || 0,
      fecha: data.fecha,
    });
    total += Number(data.cantidad) || 0;
  });

  items.sort((a, b) => {
    if (a.fecha > b.fecha) return -1;
    if (a.fecha < b.fecha) return 1;
    return 0;
  });

  expensesList.innerHTML = items
    .map(
      (item) => `
      <article class="item">
        <div class="item-details">
          <span class="item-concept">${item.concepto}</span>
          <span class="item-meta">${item.fecha}</span>
        </div>
        <span class="item-amount">$${item.cantidad.toFixed(2)}</span>
      </article>
    `
    )
    .join("");

  totalDisplay.textContent = `$${total.toFixed(2)}`;

  if (items.length === 0) {
    expensesList.innerHTML = "<p class='footer-note'>No hay gastos registrados aún.</p>";
  }
}

function subscribeToUserExpenses(user) {
  if (unsubscribeExpenses) {
    unsubscribeExpenses();
  }

  const expensesQuery = query(
    collection(db, "gastos"),
    where("userId", "==", user.uid)
  );

  unsubscribeExpenses = onSnapshot(
    expensesQuery,
    (snapshot) => {
      renderExpenses(snapshot);
    },
    (error) => {
      console.error("Error al leer gastos: ", error);
      expensesList.innerHTML = "<p class='footer-note'>No se pudieron cargar los gastos.</p>";
    }
  );
}

signInButton.addEventListener("click", async () => {
  loginStatus.textContent = "";
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    loginStatus.textContent = "Error de autenticación. Intenta de nuevo.";
    console.error(error);
  }
});

signOutButton.addEventListener("click", async () => {
  try {
    if (unsubscribeExpenses) {
      unsubscribeExpenses();
      unsubscribeExpenses = null;
    }
    await signOut(auth);
  } catch (error) {
    console.error("Error cerrando sesión:", error);
  }
});

expenseForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  const user = auth.currentUser;
  if (!user) {
    formStatus.textContent = "Necesitas iniciar sesión antes de guardar un gasto.";
    return;
  }

  const concepto = conceptInput.value.trim();
  const cantidad = parseFloat(amountInput.value);
  const fecha = dateInput.value;

  if (!concepto || Number.isNaN(cantidad) || !fecha) {
    formStatus.textContent = "Completa todos los campos correctamente.";
    return;
  }

  try {
    await addDoc(collection(db, "gastos"), {
      userId: user.uid,
      concepto,
      cantidad,
      fecha,
    });
    expenseForm.reset();
    formStatus.textContent = "Gasto guardado correctamente.";
  } catch (error) {
    formStatus.textContent = "No se pudo guardar el gasto. Intenta de nuevo.";
    console.error(error);
  }
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    showApp(user);
    subscribeToUserExpenses(user);
  } else {
    showLogin();
    clearExpenses();
  }
});
