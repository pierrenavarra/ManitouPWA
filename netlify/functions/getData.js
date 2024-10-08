const { initializeApp } = require('firebase/app');
const { getDatabase, ref, get } = require('firebase/database');
const firebaseConfig = require('./firebase-config');

console.log('Début de la fonction getData');

const app = initializeApp(firebaseConfig);
console.log('Firebase app initialisée');

const database = getDatabase(app);
console.log('Database récupérée');

exports.handler = async (event) => {
  try {
    console.log('Parsing du body de l\'event');
    const { elementId } = JSON.parse(event.body);
    console.log('ElementId reçu:', elementId);

    console.log('Tentative de récupération des données pour elementId:', elementId);
    const snapshot = await get(ref(database, 'elements'));
    console.log('Snapshot récupéré');

    if (snapshot.exists()) {
      const data = snapshot.val();
      const element = data.find(item => item && item.elementid === parseInt(elementId));
      
      if (element) {
        console.log('Données trouvées pour elementId:', elementId);
        console.log('Données renvoyées:', JSON.stringify({
          success: true,
          elementid: element.elementid,
          latitude: element.latitude,
          longitude: element.longitude,
          commentaire: element.commentaire,
          google_maps: element.google_maps,
          imageUrl: element.image_url
        }));

        return {
          statusCode: 200,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type"
          },
          body: JSON.stringify({
            success: true,
            elementid: element.elementid,
            latitude: element.latitude,
            longitude: element.longitude,
            commentaire: element.commentaire,
            google_maps: element.google_maps,
            imageUrl: element.image_url
          })
        };
      } else {
        console.log('Aucune donnée trouvée pour elementId:', elementId);
        return {
          statusCode: 404,
          body: JSON.stringify({ success: false, message: 'Données non trouvées' })
        };
      }
    } else {
      console.log('Aucune donnée trouvée dans la base');
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Aucune donnée dans la base' })
      };
    }
  } catch (error) {
    console.error('Erreur dans getData:', error);
    console.error('Stack trace:', error.stack);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: 'Erreur serveur', details: error.message })
    };
  }
};