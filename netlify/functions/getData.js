const { GoogleSpreadsheet } = require('google-spreadsheet');

exports.handler = async (event, context) => {
    try {
        console.log("Début de la fonction getData");
        console.log("GOOGLE_SPREADSHEET_ID_FROM_URL:", process.env.GOOGLE_SPREADSHEET_ID_FROM_URL);
        console.log("GOOGLE_SERVICE_ACCOUNT_EMAIL:", process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);

        const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID_FROM_URL);
        console.log("GoogleSpreadsheet initialisé");

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
        });
        console.log("Authentification réussie");

        await doc.loadInfo();
        console.log("Informations du document chargées");

        const sheet = doc.sheetsByIndex[0];
        console.log('Accès à la feuille:', sheet.title, 'elle a', sheet.rowCount, 'lignes');

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, message: "Connexion à la Google Sheet réussie" })
        };
    } catch (error) {
        console.error('Erreur générale dans getData:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};


/*
const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    console.log("Début de la fonction getData");

    const privateKey = Buffer.from(process.env.GOOGLE_PRIVATE_KEY, 'base64').toString('ascii');

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    console.log("Auth créé");

    const sheets = google.sheets({ version: 'v4', auth });

    console.log("Client Sheets créé");

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID_FROM_URL,
      range: 'COORDINATES!A2:E',
    });

    console.log("Données récupérées");

    const rows = response.data.values;
    if (rows && rows.length) {
      console.log("Données trouvées");
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, data: rows[0] })
      };
    } else {
      console.log("Aucune donnée trouvée");
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: "Aucune donnée trouvée" })
      };
    }

  } catch (error) {
    console.error('Erreur générale dans getData:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message })
    };
  }
};
*/
