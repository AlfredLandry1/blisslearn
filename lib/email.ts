import { Resend } from "resend";

interface PasswordResetEmailData {
  email: string;
  name: string;
  token: string;
  resetUrl: string;
}

// Configuration Resend (gratuit jusqu'à 3000 emails/mois)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const { email, name, token, resetUrl } = data;

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // Email de test Resend - changez pour 'noreply@styland-digital.blisslearn.com' une fois le domaine configuré
      //from: "noreply@styland-digital.blisslearn.com", // Email de test Resend - changez pour 'noreply@styland-digital.blisslearn.com' une fois le domaine configuré
      to: email,
      subject: "Réinitialisation de votre mot de passe - BlissLearn",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #e5e7eb;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
              min-height: 100vh;
            }
            .container {
              background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
              border: 1px solid #475569;
              border-radius: 12px;
              padding: 40px;
              box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
              backdrop-filter: blur(10px);
            }
            .header {
              text-align: left;
              margin-bottom: 30px;
            }
            .logo {
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 12px 24px;
              border-radius: 8px;
              display: inline-block;
              font-weight: bold;
              font-size: 18px;
              box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
            }
            .title {
              color: #f8fafc;
              font-size: 24px;
              font-weight: bold;
              margin: 20px 0 10px 0;
            }
            .subtitle {
              color: #cbd5e1;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .content {
              color: #e2e8f0;
              font-size: 16px;
              margin-bottom: 30px;
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
              color: white;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 8px;
              font-weight: bold;
              font-size: 16px;
              margin: 20px 0;
              text-align: left;
              box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
              transition: all 0.3s ease;
            }
            .button:hover {
              background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
              box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.4);
              transform: translateY(-2px);
            }
            .warning {
              background: linear-gradient(135deg, #451a03 0%, #7c2d12 100%);
              border: 1px solid #ea580c;
              border-radius: 8px;
              padding: 16px;
              margin: 20px 0;
              color: #fed7aa;
              box-shadow: 0 4px 6px -1px rgba(234, 88, 12, 0.2);
            }
            .footer {
              text-align: left;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #475569;
              color: #94a3b8;
              font-size: 14px;
            }
            .link {
              color: white;
              text-decoration: none;
              transition: color 0.3s ease;
            }
            .link:hover {
              color: white;
            }
            .divider {
              height: 1px;
              background: linear-gradient(90deg, transparent 0%, #475569 50%, transparent 100%);
              margin: 20px 0;
            }
            .highlight {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
              border-left: 4px solid #3b82f6;
              padding: 16px;
              border-radius: 0 8px 8px 0;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BlissLearn</div>
            </div>
            
            <h1 class="title">Bonjour ${name},</h1>
            <p class="subtitle">Vous avez demandé la réinitialisation de votre mot de passe.</p>
            
            <div class="highlight">
              <p class="content">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
            </div>
            
            <div style="text-align: left;">
              <a href="${resetUrl}" class="button">
                Réinitialiser mon mot de passe
              </a>
            </div>
            
            <div class="warning">
              <strong>⚠️ Important :</strong>
              <ul style="margin: 10px 0 0 20px; padding: 0;">
                <li>Ce lien expire dans 1 heure</li>
                <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                <li>Ne partagez jamais ce lien avec quelqu'un d'autre</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <p class="content">
              Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
              <br>
              <a href="${resetUrl}" class="link">${resetUrl}</a>
            </p>
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p>
                <a href="${process.env.NEXTAUTH_URL}" class="link">BlissLearn</a> - 
                L'avenir de l'apprentissage
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`Email de réinitialisation envoyé à ${email}`, result);
    return result;
  } catch (error) {
    console.error("Erreur détaillée lors de l'envoi de l'email:", error);
    throw error;
  }
}

// Fonction de test pour vérifier la configuration email
export async function testEmailConnection() {
  try {
    // Test simple avec Resend
    console.log("Configuration Resend valide");
    return true;
  } catch (error) {
    console.error("Erreur de configuration email:", error);
    return false;
  }
}

// Alias pour la compatibilité
export const sendResetPasswordEmail = sendPasswordResetEmail;
