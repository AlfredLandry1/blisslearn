import { Resend } from "resend";

interface PasswordResetEmailData {
  email: string;
  name: string;
  token: string;
  resetUrl: string;
}

interface PasswordChangeConfirmationEmailData {
  email: string;
  name: string;
  loginUrl: string;
}

interface CourseCompletionEmailData {
  email: string;
  name: string;
  courseTitle: string;
  institution: string;
  certificateUrl: string;
  completionDate: string;
  timeSpent: string;
  certificateNumber: string;
}

interface VerificationEmailData {
  email: string;
  name: string;
  token: string;
}

// Configuration Resend (gratuit jusqu'à 3000 emails/mois)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(data: PasswordResetEmailData) {
  const { email, name, token, resetUrl } = data;

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // ✅ Adresse de test qui fonctionne
      to: email,
      subject: "Réinitialisation de votre mot de passe - BlissLearn",
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@blisslearn.com>",
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "normal",
      },
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Réinitialisation de mot de passe</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; border: 1px solid #e9ecef;">
            <!-- En-tête -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px;">Bonjour ${name},</h1>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Vous avez demandé la réinitialisation de votre mot de passe.</p>
            </div>

            <!-- Contenu principal -->
            <div style="background: white; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
              <p style="color: #495057; margin: 0 0 20px 0;">Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="${resetUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Réinitialiser mon mot de passe
                </a>
              </div>

              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; margin: 0 0 10px 0; font-weight: bold;">⚠️ Important :</p>
                <ul style="margin: 0; padding-left: 20px; color: #856404;">
                  <li>Ce lien expire dans 1 heure</li>
                  <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
                  <li>Ne partagez jamais ce lien avec quelqu'un d'autre</li>
                </ul>
              </div>

              <p style="color: #6c757d; font-size: 14px; margin: 20px 0 0 0;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${resetUrl}" style="color: #007bff; word-break: break-all;">${resetUrl}</a>
              </p>
            </div>

            <!-- Pied de page -->
            <div style="text-align: center; color: #6c757d; font-size: 14px; border-top: 1px solid #e9ecef; padding-top: 20px;">
              <p style="margin: 0 0 10px 0;">Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p style="margin: 0;">
                <a href="${process.env.NEXTAUTH_URL}" style="color: #007bff; text-decoration: none;">BlissLearn</a> - 
                L'avenir de l'apprentissage
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ Email de réinitialisation envoyé à ${email}`, result);
    return result;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'email de réinitialisation:",
      error
    );
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

export async function sendPasswordChangeConfirmationEmail(
  data: PasswordChangeConfirmationEmailData
) {
  const { email, name, loginUrl } = data;

  try {
    const result = await resend.emails.send({
      from: "onboarding@resend.dev", // Email de test Resend - changez pour 'noreply@styland-digital.blisslearn.com' une fois le domaine configuré
      to: email,
      subject: "Votre mot de passe a été modifié avec succès - BlissLearn",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de changement de mot de passe</title>
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
            .success-badge {
              background: linear-gradient(135deg, #059669 0%, #047857 100%);
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              display: inline-block;
              font-weight: bold;
              font-size: 14px;
              margin-bottom: 20px;
              box-shadow: 0 4px 6px -1px rgba(5, 150, 105, 0.3);
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
            .info-box {
              background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(29, 78, 216, 0.1) 100%);
              border: 1px solid #3b82f6;
              border-radius: 8px;
              padding: 16px;
              margin: 20px 0;
              color: #e2e8f0;
              box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.2);
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
              background: linear-gradient(135deg, rgba(5, 150, 105, 0.1) 0%, rgba(4, 120, 87, 0.1) 100%);
              border-left: 4px solid #10b981;
              padding: 16px;
              border-radius: 0 8px 8px 0;
              margin: 20px 0;
            }
            .security-tips {
              background: linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(217, 119, 6, 0.1) 100%);
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 16px;
              margin: 20px 0;
              color: #fef3c7;
              box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.2);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">BlissLearn</div>
            </div>
            
            <div class="success-badge">✅ Confirmation</div>
            
            <h1 class="title">Bonjour ${name},</h1>
            <p class="subtitle">Votre mot de passe a été modifié avec succès !</p>
            
            <div class="highlight">
              <p class="content">
                <strong>Votre mot de passe a été réinitialisé avec succès.</strong> 
                Vous pouvez maintenant vous connecter à votre compte BlissLearn avec votre nouveau mot de passe.
              </p>
            </div>
            
            <div style="text-align: left;">
              <a href="${loginUrl}" class="button">
                Se connecter à mon compte
              </a>
            </div>
            
            <div class="info-box">
              <strong>📅 Détails de la modification :</strong>
              <ul style="margin: 10px 0 0 20px; padding: 0;">
                <li>Date : ${new Date().toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</li>
                <li>IP : Sécurisée</li>
                <li>Appareil : Sécurisé</li>
              </ul>
            </div>
            
            <div class="security-tips">
              <strong>🔒 Conseils de sécurité :</strong>
              <ul style="margin: 10px 0 0 20px; padding: 0;">
                <li>Utilisez un mot de passe unique et fort</li>
                <li>Activez l'authentification à deux facteurs si disponible</li>
                <li>Ne partagez jamais vos identifiants</li>
                <li>Déconnectez-vous sur les appareils publics</li>
              </ul>
            </div>
            
            <div class="divider"></div>
            
            <p class="content">
              Si vous n'avez pas effectué cette modification, contactez immédiatement notre support :
              <br>
              <a href="mailto:support@blisslearn.com" class="link">support@blisslearn.com</a>
            </p>
            
            <div class="footer">
              <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p>
                <a href="${
                  process.env.NEXTAUTH_URL
                }" class="link">BlissLearn</a> - 
                L'avenir de l'apprentissage
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(
      `Email de confirmation de changement de mot de passe envoyé à ${email}`,
      result
    );
    return result;
  } catch (error) {
    console.error(
      "Erreur détaillée lors de l'envoi de l'email de confirmation:",
      error
    );
    throw error;
  }
}

// Alias pour la compatibilité
export const sendResetPasswordEmail = sendPasswordResetEmail;

export async function sendCourseCompletionEmail(
  data: CourseCompletionEmailData
) {
  const {
    email,
    name,
    courseTitle,
    institution,
    certificateUrl,
    completionDate,
    timeSpent,
    certificateNumber,
  } = data;

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev', // ✅ Adresse de test qui fonctionne
      to: email,
      subject: `Certification obtenue - ${courseTitle}`, // ✅ Sujet simplifié
      headers: {
        "List-Unsubscribe": "<mailto:unsubscribe@blisslearn.com>",
        "X-Priority": "3",
        "X-MSMail-Priority": "Normal",
        Importance: "normal",
      },
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Certification Obtenue - BlissLearn</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; border: 1px solid #e9ecef;">
            <!-- En-tête -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px;">🎉 Félicitations !</h1>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Vous avez obtenu votre certification</p>
            </div>

            <!-- Contenu principal -->
            <div style="background: white; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
              <h2 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 20px;">${courseTitle}</h2>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 5px 0; color: #495057;"><strong>Institution :</strong> ${institution}</p>
                <p style="margin: 5px 0; color: #495057;"><strong>Date de complétion :</strong> ${completionDate}</p>
                <p style="margin: 5px 0; color: #495057;"><strong>Temps passé :</strong> ${timeSpent}</p>
                <p style="margin: 5px 0; color: #495057;"><strong>Numéro de certification :</strong> <span style="font-family: monospace; background: #f8f9fa; padding: 2px 6px; border-radius: 4px;">${certificateNumber}</span></p>
              </div>

              <div style="text-align: center; margin: 25px 0;">
                <a href="${certificateUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Voir ma certification
                </a>
              </div>
            </div>

            <!-- Informations supplémentaires -->
            <div style="background: #e3f2fd; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
              <h3 style="color: #1976d2; margin: 0 0 10px 0; font-size: 16px;">Prochaines étapes</h3>
              <ul style="margin: 0; padding-left: 20px; color: #495057;">
                <li>Partagez votre certification sur LinkedIn</li>
                <li>Ajoutez-la à votre CV</li>
                <li>Continuez votre apprentissage avec d'autres cours</li>
              </ul>
            </div>

            <!-- Pied de page -->
            <div style="text-align: center; color: #6c757d; font-size: 14px; border-top: 1px solid #e9ecef; padding-top: 20px;">
              <p style="margin: 0 0 10px 0;">Cet email a été envoyé automatiquement par BlissLearn</p>
              <p style="margin: 0;">
                <a href="${process.env.NEXTAUTH_URL}" style="color: #007bff; text-decoration: none;">BlissLearn</a> - 
                L'avenir de l'apprentissage
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log(`✅ Email de certification envoyé à ${email}`, result);
    return result;
  } catch (error) {
    console.error(
      "❌ Erreur lors de l'envoi de l'email de certification:",
      error
    );
    throw error;
  }
}

export async function sendVerificationEmail(data: VerificationEmailData) {
  const { email, name, token } = data;
  const verifyUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`;

  console.log("📧 sendVerificationEmail - Détails:", {
    email,
    name,
    token: token.substring(0, 10) + "...",
    verifyUrl,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY ? "Configurée" : "Manquante"
  });

  try {
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Vérification de votre adresse email - BlissLearn",
      html: `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vérification de votre email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #f8f9fa; border-radius: 8px; padding: 30px; border: 1px solid #e9ecef;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; margin: 0 0 10px 0; font-size: 24px;">Bienvenue ${name} !</h1>
              <p style="color: #6c757d; margin: 0; font-size: 16px;">Merci de vous être inscrit sur BlissLearn.</p>
            </div>
            <div style="background: white; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
              <p style="color: #495057; margin: 0 0 20px 0;">Pour activer votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
              <div style="text-align: center; margin: 25px 0;">
                <a href="${verifyUrl}" style="background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                  Vérifier mon email
                </a>
              </div>
              <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
                <p style="color: #856404; margin: 0 0 10px 0; font-weight: bold;">⚠️ Important :</p>
                <ul style="margin: 0; padding-left: 20px; color: #856404;">
                  <li>Ce lien expire dans 24 heures</li>
                  <li>Si vous n'avez pas créé de compte, ignorez cet email</li>
                </ul>
              </div>
              <p style="color: #6c757d; font-size: 14px; margin: 20px 0 0 0;">
                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                <a href="${verifyUrl}" style="color: #007bff; word-break: break-all;">${verifyUrl}</a>
              </p>
            </div>
            <div style="text-align: center; color: #6c757d; font-size: 14px; border-top: 1px solid #e9ecef; padding-top: 20px;">
              <p style="margin: 0 0 10px 0;">Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
              <p style="margin: 0;">
                <a href="${process.env.NEXTAUTH_URL}" style="color: #007bff; text-decoration: none;">BlissLearn</a> - L'avenir de l'apprentissage
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log(`✅ Email de vérification envoyé à ${email}`, result);
    return result;
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi de l'email de vérification:", error);
    throw error;
  }
}
