import { createBrowserRouter, Navigate } from "react-router-dom";

import { ProsConstPage } from "@/presentation/pages/pros-cons/ProsConstPage";
import { AssistantPage } from "@/presentation/pages/assistant/AssistantPage";
import { TranslatePage } from "@/presentation/pages/translate/TranslatePage";
import { TextToAudioPage } from "@/presentation/pages/text-to-audio/TextToAudioPage";
import { OrthographyPage } from "@/presentation/pages/orthography/OrthographyPage";
import { AudioToTextPage } from "@/presentation/pages/audio-to-text/AudioToTextPage";
import { ImageTunningPage } from "@/presentation/pages/image-generation/ImageTunningPage";
import { ImageGenerationPage } from "@/presentation/pages/image-generation/ImageGenerationPage";
import { ProsConsStreamPage } from "@/presentation/pages/pros-cons-stream/ProsConsStreamPage";

import { DashboardLayout } from "@/presentation/layouts/DashboardLayout";

export const menuRoutes = [
  {
    to: "/orthography",
    icon: "fa-solid fa-spell-check",
    title: "Ortografía",
    description: "Corregir ortografía",
    component: <OrthographyPage />,
  },
  {
    to: "/pros-cons",
    icon: "fa-solid fa-code-compare",
    title: "Pros & Cons",
    description: "Comparar pros y contras",
    component: <ProsConstPage />,
  },
  {
    to: "/pros-cons-stream",
    icon: "fa-solid fa-water",
    title: "Como stream",
    description: "Con stream de mensajes",
    component: <ProsConsStreamPage />,
  },
  {
    to: "/translate",
    icon: "fa-solid fa-language",
    title: "Traducir",
    description: "Textos a otros idiomas",
    component: <TranslatePage />,
  },
  {
    to: "/text-to-audio",
    icon: "fa-solid fa-podcast",
    title: "Texto a audio",
    description: "Convertir texto a audio",
    component: <TextToAudioPage />,
  },
  {
    to: "/image-generation",
    icon: "fa-solid fa-image",
    title: "Imágenes",
    description: "Generar imágenes",
    component: <ImageGenerationPage />,
  },
  {
    to: "/image-tunning",
    icon: "fa-solid fa-wand-magic",
    title: "Editar imagen",
    description: "Generación continua",
    component: <ImageTunningPage />,
  },
  {
    to: "/audio-to-text",
    icon: "fa-solid fa-comment-dots",
    title: "Audio a texto",
    description: "Convertir audio a texto",
    component: <AudioToTextPage />,
  },
  {
    to: "/assistant",
    icon: "fa-solid fa-user",
    title: "Asistente",
    description: "Información del asistente",
    component: <AssistantPage />,
  },
];

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      ...menuRoutes.map((router) => ({
        path: router.to,
        element: router.component,
      })),
      {
        path: "",
        element: <Navigate to={menuRoutes[0].to} />, //default redirect
      },
    ],
  },
]);
