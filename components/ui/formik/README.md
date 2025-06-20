# Composants Formik pour BlissLearn

Ce dossier contient des composants personnalisés qui intègrent Formik avec les composants shadcn/ui pour une gestion de formulaires robuste et une validation avancée.

## Composants disponibles

### FormikField

Composant de base pour les champs de formulaire avec Formik.

```tsx
import { FormikField } from "@/components/ui/formik";

<FormikField
  name="email"
  label="Adresse email"
  type="email"
  placeholder="votre@email.com"
  required
/>
```

**Props :**
- `name: string` - Nom du champ (requis)
- `label?: string` - Label du champ
- `type?: "text" | "email" | "password" | "checkbox"` - Type de champ
- `placeholder?: string` - Placeholder du champ
- `className?: string` - Classes CSS personnalisées
- `showPasswordToggle?: boolean` - Afficher le toggle de mot de passe (pour type="password")
- `required?: boolean` - Champ requis
- `children?: React.ReactNode` - Contenu personnalisé

### FormikFieldWithIcon

Composant pour les champs avec icône intégrée.

```tsx
import { FormikFieldWithIcon } from "@/components/ui/formik";
import { Mail } from "lucide-react";

<FormikFieldWithIcon
  name="email"
  label="Adresse email"
  type="email"
  placeholder="votre@email.com"
  icon={Mail}
  required
/>
```

**Props :**
- `name: string` - Nom du champ (requis)
- `label?: string` - Label du champ
- `type?: "text" | "email" | "password"` - Type de champ
- `placeholder?: string` - Placeholder du champ
- `className?: string` - Classes CSS personnalisées
- `icon: LucideIcon` - Icône à afficher (requis)
- `showPasswordToggle?: boolean` - Afficher le toggle de mot de passe
- `required?: boolean` - Champ requis

## Schémas de validation

Les schémas de validation Yup sont définis dans `@/lib/validation-schemas.ts` :

- `loginSchema` - Validation pour la connexion
- `registerSchema` - Validation pour l'inscription
- `forgotPasswordSchema` - Validation pour le mot de passe oublié

## Utilisation avec Formik

```tsx
import { Formik, Form } from "formik";
import { FormikFieldWithIcon } from "@/components/ui/formik";
import { loginSchema, initialLoginValues } from "@/lib/validation-schemas";

<Formik
  initialValues={initialLoginValues}
  validationSchema={loginSchema}
  onSubmit={handleSubmit}
>
  {({ isSubmitting, isValid }) => (
    <Form>
      <FormikFieldWithIcon
        name="email"
        label="Email"
        type="email"
        icon={Mail}
        required
      />
      <Button type="submit" disabled={isSubmitting || !isValid}>
        Se connecter
      </Button>
    </Form>
  )}
</Formik>
```

## Fonctionnalités

- ✅ Validation en temps réel avec Yup
- ✅ Gestion des erreurs automatique
- ✅ Toggle de visibilité du mot de passe
- ✅ Support des icônes Lucide
- ✅ Design cohérent avec shadcn/ui
- ✅ Animations et transitions fluides
- ✅ Support des champs checkbox
- ✅ Messages d'erreur personnalisés
- ✅ Accessibilité (ARIA labels, focus management)

## Styles

Les composants utilisent les classes Tailwind CSS et s'intègrent parfaitement avec le thème sombre de BlissLearn. Les couleurs et les transitions sont cohérentes avec le design system existant. 