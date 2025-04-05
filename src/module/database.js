import { getFirestore, collection, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js';

let db;
let calendarDataCollection;

export const initializeFirestore = (firebaseApp) => {
  db = getFirestore(firebaseApp);
  calendarDataCollection = collection(db, 'calendarData');
  console.log("Firestore initialisé dans database.js");
};

// Fonction pour sauvegarder les données du calendrier dans Firestore
export const saveCalendarData = async (userId, checkedDates) => {
  if (userId && db && calendarDataCollection) {
    const userDocRef = doc(calendarDataCollection, userId);
    try {
      await setDoc(userDocRef, { checkedDates });
      console.log("Données du calendrier sauvegardées dans Firestore pour l'utilisateur :", userId);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des données du calendrier dans Firestore :", error);
    }
  } else {
    console.warn("Firestore non initialisé ou paramètres manquants dans saveCalendarData");
  }
};

// Fonction pour charger les données du calendrier depuis Firestore
export const loadCalendarData = async (userId) => {
  if (userId && db && calendarDataCollection) {
    const userDocRef = doc(calendarDataCollection, userId);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Données du calendrier chargées depuis Firestore pour l'utilisateur :", userId);
        return data.checkedDates || [];
      } else {
        console.log("Aucune donnée de calendrier trouvée pour l'utilisateur :", userId);
        return [];
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du calendrier depuis Firestore :", error);
      return [];
    }
  } else {
    console.warn("Firestore non initialisé ou paramètres manquants dans loadCalendarData");
    return [];
  }
};