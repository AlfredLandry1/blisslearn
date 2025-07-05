import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { sendCourseCompletionEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Test d'envoi d'email
    console.log('🧪 TEST: Tentative d\'envoi d\'email de test');
    console.log('📧 Email utilisateur:', session.user.email);
    console.log('🔑 RESEND_API_KEY configurée:', !!process.env.RESEND_API_KEY);
    console.log('🌐 NEXTAUTH_URL:', process.env.NEXTAUTH_URL);

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: 'RESEND_API_KEY non configurée',
        message: 'Veuillez configurer la variable d\'environnement RESEND_API_KEY'
      }, { status: 500 });
    }

    try {
      await sendCourseCompletionEmail({
        email: session.user.email,
        name: session.user.name || 'Test User',
        courseTitle: 'Cours de test - BlissLearn',
        institution: 'BlissLearn Academy',
        certificateUrl: `${process.env.NEXTAUTH_URL}/dashboard/certifications`,
        completionDate: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        timeSpent: '2h 30min',
        certificateNumber: 'BL-2024-TEST-123456'
      });

      console.log('✅ Email de test envoyé avec succès');
      return NextResponse.json({ 
        success: true, 
        message: 'Email de test envoyé avec succès' 
      });

    } catch (emailError) {
      console.error('❌ Erreur lors de l\'envoi de l\'email de test:', emailError);
      return NextResponse.json({ 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: emailError instanceof Error ? emailError.message : 'Erreur inconnue'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Erreur lors du test email:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
} 