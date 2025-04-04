import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';
import { initViewSelector } from './module/viewSelector.js'
import {initCalendar} from './module/calendar.js'
import { saveCalendarData, loadCalendarData, initializeFirestore } from './module/database.js';
import { store } from './store.js';

const firebaseConfig = {
  apiKey: "AIzaSyCaZbAIQeeAgOprhvCsEY9xDpaVAFmqeLU",
  authDomain: "calendrier-blaireau.firebaseapp.com",
  projectId: "calendrier-blaireau",
  storageBucket: "calendrier-blaireau.firebasestorage.app",
  messagingSenderId: "467824587717",
  appId: "1:467824587717:web:5fac14d2876ab1a033d1ac",
  measurementId: "G-KTJZVJ9Z7K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export { app, auth };
const analytics = getAnalytics(app);

// Initialiser Firestore après l'initialisation de l'application
initializeFirestore(app);

// Récupérez l'instance de auth
const auth = getAuth();

const connectButton = document.getElementById('connect-button');
const authContainer = document.getElementById('auth-container');
const signupForm = document.getElementById('signup-form'); 
const loginForm = document.getElementById('login-form');  
const signupButton = document.getElementById('signup-button'); 
const loginButton = document.getElementById('login-button');  
const showLoginLink = document.getElementById('show-login');   
const showSignupLink = document.getElementById('show-signup'); 
// const calendarApp = document.getElementById('calendar-app'); 
const calendarRoot = document.getElementById('calendar-root');

const init = () => {
  initViewSelector()
  initCalendar()
}

const main = () => {
  try {
    console.log('serviceWorker' in navigator)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then(() => navigator.serviceWorker.ready.then(() => {
          console.log('registered')
        }))
        .catch((err) => console.error(err));
    }
  } catch (err) {
    console.error(err)
  }

  init()
}

main()

// Afficher le formulaire de connexion/inscription lorsque le bouton "Se connecter" est cliqué
connectButton.addEventListener('click', () => {
  authContainer.style.display = 'block';
  signupForm.style.display = 'none'; // Masquer le formulaire d'inscription
  loginForm.style.display = 'block';  // Afficher le formulaire de connexion
});

// Basculer vers le formulaire de connexion
showLoginLink.addEventListener('click', (e) => {
  e.preventDefault(); // Empêche le comportement par défaut du lien (qui pourrait être de recharger la page)
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// Basculer vers le formulaire d'inscription
showSignupLink.addEventListener('click', (e) => {
  e.preventDefault(); // Empêche le comportement par défaut du lien
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

// Gestion de l'inscription
signupButton.addEventListener('click', (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');

  const email = emailInput.value;
  const password = passwordInput.value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // L'utilisateur s'est inscrit avec succès
      const user = userCredential.user;
      console.log('Utilisateur inscrit :', user);
      alert("Inscription réussie !"); // Petit feedback visuel
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Erreur lors de l\'inscription :', errorCode, errorMessage);
      alert("Erreur lors de l'inscription : " + errorMessage);
    });
});

// Gestion de la connexion
loginButton.addEventListener('click', (e) => {
  e.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  const email = emailInput.value;
  const password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // L'utilisateur s'est connecté avec succès
      const user = userCredential.user;
      console.log('Utilisateur connecté :', user);
      alert("Connexion réussie !"); // Petit feedback visuel
      authContainer.style.display = 'none'; // Masquer les formulaires après la connexion
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Erreur lors de la connexion :', errorCode, errorMessage);
      alert("Erreur lors de la connexion : " + errorMessage);
    });
});

// Gestion de l'état de l'utilisateur
onAuthStateChanged(auth, async (user) => { // Ajoutez 'async' ici car loadCalendarData est asynchrone
  if (user) {
    // L'utilisateur est connecté
    const uid = user.uid;
    console.log('Utilisateur connecté (via onAuthStateChanged) :', user);

    // Charger les données du calendrier depuis Firestore
    const loadedCheckedDates = await loadCalendarData(uid);

    // Mettre à jour le store avec les données chargées
    store.checkedDates.splice(0, store.checkedDates.length, ...loadedCheckedDates);
    console.log('store.checkedDates updated:', store.checkedDates); // Ajoutez cette ligne

    // Afficher l'application calendrier
    calendarRoot.classList.remove('hidden'); // Supprimer la classe 'hidden' pour afficher

    // Afficher le bouton "Se connecter" (si nécessaire)
    connectButton.style.display = 'block';

    // Modifier le texte du bouton "Se connecter" en "Connecté"
    connectButton.textContent = 'Connecté';

    // Masquer le conteneur d'authentification
    authContainer.style.display = 'none';

    // Initialiser le calendrier ici, après avoir chargé les données
    //initCalendar(); // Ajoutez cette ligne ici

    // Potentiellement afficher un bouton de déconnexion (nous l'ajouterons plus tard)
  } else {
    // L'utilisateur n'est pas connecté
    console.log('Utilisateur déconnecté');

    // Masquer l'application calendrier
    calendarRoot.classList.add('hidden'); // Ajouter la classe 'hidden' pour masquer

    // Réinitialiser le texte du bouton à "Se connecter"
    connectButton.textContent = 'Se connecter'

    // Afficher le conteneur d'authentification
    authContainer.style.display = 'block';
  }
});