"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Bell,
  Shield,
  User,
  Palette,
  Globe,
  Download,
  Trash2,
  Save,
  Camera,
  Sparkles,
} from "lucide-react";
import { useUIStore } from "@/stores/uiStore";
import { useFormManager } from "@/components/ui/form-manager";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");

  const { addNotification, setLoading, isKeyLoading } = useUIStore();
  const { form, setForm, updateField, submitForm } = useFormManager("settings");
  const loadingKey = "settings-save";
  const loading = isKeyLoading(loadingKey);

  // Initialiser le formulaire avec les données de session
  useEffect(() => {
    if (session?.user) {
      setForm({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
      });
    }
  }, [session?.user, setForm]);

  const handleInputChange = (field: string, value: string) => {
    updateField(field, value);
  };

  const handleSaveProfile = async () => {
    await submitForm(
      async (data: any) => {
        // Ici vous ajouteriez la logique pour sauvegarder les données
        await new Promise(resolve => setTimeout(resolve, 1000));
        return { success: true };
      },
      {
        loadingKey,
        onSuccess: () => {
          addNotification({
            type: "success",
            title: "Profil mis à jour",
            message: "Vos informations ont été sauvegardées avec succès",
            duration: 3000
          });
        },
        onError: (error: any) => {
          addNotification({
            type: "error",
            title: "Erreur",
            message: "Impossible de sauvegarder les modifications",
            duration: 5000
          });
        }
      }
    );
  };

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "appearance", label: "Apparence", icon: Palette },
    { id: "language", label: "Langue", icon: Globe },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Paramètres</h1>
          <p className="text-gray-400">
            Personnalisez votre expérience d'apprentissage
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation des paramètres */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Contenu des paramètres */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profil */}
            {activeTab === "profile" && (
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informations du profil
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={form.image || ""} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-blue-400 text-white text-xl">
                          {form.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 w-8 h-8 p-0 rounded-full border-gray-600 bg-gray-800 hover:bg-gray-700"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">
                        Photo de profil
                      </h4>
                      <p className="text-gray-400 text-sm">
                        JPG, PNG ou GIF. Max 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Informations personnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-300">
                        Nom complet
                      </Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image" className="text-gray-300">
                      URL de l'image de profil
                    </Label>
                    <Input
                      id="image"
                      value={form.image}
                      onChange={(e) =>
                        handleInputChange("image", e.target.value)
                      }
                      className="bg-gray-800 border-gray-600 text-white focus:border-blue-500"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-medium">
                        Statut du compte
                      </h4>
                      <p className="text-gray-400 text-sm">
                        {session?.user?.email
                          ? "Email renseigné"
                          : "Email non renseigné"}
                      </p>
                    </div>
                    <Badge
                      variant={session?.user?.email ? "default" : "secondary"}
                      className={
                        session?.user?.email
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }
                    >
                      {session?.user?.email ? "Renseigné" : "Non renseigné"}
                    </Badge>
                  </div>

                  <Button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="truncate bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading
                      ? "Sauvegarde..."
                      : "Sauvegarder les modifications"}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bell className="w-5 h-5 mr-2" />
                    Préférences de notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      label: "Notifications par email",
                      description: "Recevoir des notifications par email",
                      enabled: true,
                    },
                    {
                      label: "Notifications push",
                      description:
                        "Recevoir des notifications push dans le navigateur",
                      enabled: true,
                    },
                    {
                      label: "Rappels de cours",
                      description: "Rappels pour les cours en cours",
                      enabled: true,
                    },
                    {
                      label: "Nouvelles certifications",
                      description:
                        "Notifications pour les nouvelles certifications",
                      enabled: false,
                    },
                    {
                      label: "Webinars et événements",
                      description: "Rappels pour les webinars et événements",
                      enabled: true,
                    },
                    {
                      label: "Progrès hebdomadaire",
                      description: "Résumé hebdomadaire de vos progrès",
                      enabled: true,
                    },
                  ].map((setting, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                    >
                      <div>
                        <h4 className="text-white font-medium">
                          {setting.label}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {setting.description}
                        </p>
                      </div>
                      <Switch defaultChecked={setting.enabled} />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Sécurité */}
            {activeTab === "security" && (
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Sécurité et confidentialité
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">
                        Authentification à deux facteurs
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Sécurisez votre compte avec la 2FA
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Configurer
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">
                        Changer le mot de passe
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Mettez à jour votre mot de passe
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Modifier
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">
                        Sessions actives
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Gérez vos sessions connectées
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      Voir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Apparence */}
            {activeTab === "appearance" && (
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Palette className="w-5 h-5 mr-2" />
                    Apparence
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Mode sombre</h4>
                      <p className="text-gray-400 text-sm">
                        Activer le thème sombre
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Animations</h4>
                      <p className="text-gray-400 text-sm">
                        Activer les animations d'interface
                      </p>
                    </div>
                    <Switch defaultChecked={true} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Langue */}
            {activeTab === "language" && (
              <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Langue et région
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-gray-300">
                      Langue
                    </Label>
                    <select className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-gray-300">
                      Fuseau horaire
                    </Label>
                    <select className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none">
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="UTC">UTC (UTC+0)</option>
                      <option value="America/New_York">
                        America/New_York (UTC-5)
                      </option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions dangereuses */}
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Zone dangereuse</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div>
                    <h4 className="text-white font-medium">
                      Exporter mes données
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Télécharger toutes vos données personnelles
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <div>
                    <h4 className="text-white font-medium">
                      Supprimer mon compte
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Cette action est irréversible
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
