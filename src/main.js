const connectButton = document.getElementById('connect-button');
const authContainer = document.getElementById('auth-container');
const signupForm = document.getElementById('signup-form'); 
const loginForm = document.getElementById('login-form');  
const signupButton = document.getElementById('signup-button'); 
const loginButton = document.getElementById('login-button');  
const showLoginLink = document.getElementById('show-login');   
const showSignupLink = document.getElementById('show-signup'); 
const calendarApp = document.getElementById('calendar-app'); 

// Importations Firebase
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } 
from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js';

import { initViewSelector } from './module/viewSelector.js'
import {initCalendar} from './module/calendar.js'

// Récupérez l'instance de auth
const auth = getAuth();

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
onAuthStateChanged(auth, (user) => {
  if (user) {
    // L'utilisateur est connecté
    const uid = user.uid;
    console.log('Utilisateur connecté (via onAuthStateChanged) :', user);

    // Masquer le conteneur d'authentification
    authContainer.style.display = 'none';

    // Potentiellement afficher un bouton de déconnexion (nous l'ajouterons plus tard)
  } else {
    // L'utilisateur n'est pas connecté
    console.log('Utilisateur déconnecté');

    // Afficher le bouton "Se connecter" (il devrait déjà l'être par défaut ou après une déconnexion)
    connectButton.style.display = 'block';

    // Masquer l'application calendrier et potentiellement afficher le conteneur d'authentification
    calendarApp.style.display = 'none'; // Assurez-vous que l'application est masquée par défaut
    // authContainer.style.display = 'block'; // Vous pouvez choisir d'afficher les formulaires ici ou seulement au clic du bouton
  }
});
