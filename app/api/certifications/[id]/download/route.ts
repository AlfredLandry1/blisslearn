import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST - Générer et télécharger le certificat
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Récupérer la certification
    const certification = await prisma.certification.findFirst({
      where: {
        id: params.id,
        userId: user.id
      }
    });

    if (!certification) {
      return NextResponse.json({ error: "Certification introuvable" }, { status: 404 });
    }

    // Générer le contenu HTML du certificat
    const htmlContent = generateCertificateHTML(certification, user);

    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="certification-${certification.certificateNumber}.html"`,
      },
    });

  } catch (error) {
    console.error("Erreur lors de la génération du certificat:", error);
    return NextResponse.json(
      { error: "Erreur lors de la génération du certificat" },
      { status: 500 }
    );
  }
}

function generateCertificateHTML(certification: any, user: any) {
  const issuedDate = new Date(certification.issuedAt).toLocaleDateString('fr-FR');
  const expiresDate = certification.expiresAt ? new Date(certification.expiresAt).toLocaleDateString('fr-FR') : null;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Certification - ${certification.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .certificate {
            background: white;
            width: 100%;
            max-width: 900px;
            border-radius: 20px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            position: relative;
        }
        
        .certificate::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.1) 50%, transparent 70%);
            pointer-events: none;
        }
        
        .header {
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
        }
        
        .header::after {
            content: '';
            position: absolute;
            bottom: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 20px solid transparent;
            border-right: 20px solid transparent;
            border-top: 20px solid #8b5cf6;
        }
        
        .title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .subtitle {
            font-size: 1.2rem;
            font-weight: 300;
            opacity: 0.9;
        }
        
        .content {
            padding: 60px 40px 40px;
            text-align: center;
        }
        
        .recipient {
            font-size: 2rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 20px;
        }
        
        .description {
            font-size: 1.1rem;
            color: #6b7280;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        
        .course-title {
            font-size: 1.8rem;
            font-weight: 600;
            color: #3b82f6;
            margin-bottom: 40px;
            padding: 20px;
            background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
            border-radius: 15px;
            border-left: 5px solid #3b82f6;
        }
        
        .details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }
        
        .detail-item {
            text-align: left;
            padding: 20px;
            background: #f8fafc;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        
        .detail-label {
            font-size: 0.9rem;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .detail-value {
            font-size: 1.1rem;
            font-weight: 600;
            color: #1f2937;
        }
        
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 30px 40px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        .signature {
            text-align: center;
        }
        
        .signature-line {
            width: 150px;
            height: 2px;
            background: #3b82f6;
            margin: 10px auto;
        }
        
        .signature-text {
            font-size: 0.9rem;
            color: #6b7280;
        }
        
        .seal {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: 700;
            font-size: 0.8rem;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        .verification {
            text-align: center;
            margin-top: 20px;
            padding: 15px;
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 8px;
            color: #166534;
            font-size: 0.9rem;
        }
        
        @media print {
            body {
                background: white;
            }
            .certificate {
                box-shadow: none;
                border-radius: 0;
            }
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <h1 class="title">CERTIFICAT DE COMPLÉTION</h1>
            <p class="subtitle">Certification officielle</p>
        </div>
        
        <div class="content">
            <div class="recipient">${user.name || user.email}</div>
            <p class="description">a complété avec succès le cours suivant :</p>
            <div class="course-title">${certification.title}</div>
            
            <div class="details">
                <div class="detail-item">
                    <div class="detail-label">Numéro de certification</div>
                    <div class="detail-value">${certification.certificateNumber}</div>
                </div>
                
                <div class="detail-item">
                    <div class="detail-label">Date d'émission</div>
                    <div class="detail-value">${issuedDate}</div>
                </div>
                
                ${expiresDate ? `
                <div class="detail-item">
                    <div class="detail-label">Date d'expiration</div>
                    <div class="detail-value">${expiresDate}</div>
                </div>
                ` : ''}
                
                ${certification.institution ? `
                <div class="detail-item">
                    <div class="detail-label">Institution</div>
                    <div class="detail-value">${certification.institution}</div>
                </div>
                ` : ''}
                
                ${certification.level ? `
                <div class="detail-item">
                    <div class="detail-label">Niveau</div>
                    <div class="detail-value">${certification.level}</div>
                </div>
                ` : ''}
                
                ${certification.duration ? `
                <div class="detail-item">
                    <div class="detail-label">Durée du cours</div>
                    <div class="detail-value">${certification.duration}</div>
                </div>
                ` : ''}
            </div>
            
            <div class="verification">
                🔍 Ce certificat peut être vérifié en ligne sur notre plateforme
            </div>
        </div>
        
        <div class="footer">
            <div class="signature">
                <div class="signature-line"></div>
                <div class="signature-text">Signature du directeur</div>
            </div>
            
            <div class="seal">
                <span>BLISS</span>
                <span>LEARN</span>
            </div>
        </div>
    </div>
</body>
</html>
  `;
} 