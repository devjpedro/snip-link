import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@snip-link/ui/components/card";
import {
  BarChart3,
  Code,
  Eye,
  Globe,
  Link2,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "URLs Personalizadas",
    description:
      "Crie links com aliases personalizados para melhor branding e memorização.",
  },
  {
    icon: BarChart3,
    title: "Analytics Avançados",
    description:
      "Acompanhe cliques, origens, dispositivos e muito mais em tempo real.",
  },
  {
    icon: Shield,
    title: "100% Seguro",
    description:
      "Proteção contra spam e malware. Seus links e dados estão sempre seguros.",
  },
  {
    icon: Zap,
    title: "Super Rápido",
    description:
      "Redirecionamento instantâneo com CDN global para máxima performance.",
  },
  {
    icon: Code,
    title: "API Completa",
    description:
      "Integre facilmente com sua aplicação usando nossa API RESTful.",
  },
  {
    icon: Eye,
    title: "Preview de Links",
    description:
      "Visualize o destino dos links antes de clicar para maior segurança.",
  },
  {
    icon: Globe,
    title: "Sem Limites",
    description:
      "Encurte quantos links quiser, sem restrições ou taxas ocultas.",
  },
  {
    icon: Users,
    title: "Colaboração",
    description:
      "Compartilhe e gerencie links em equipe com controles de acesso.",
  },
  {
    icon: Settings,
    title: "Configurável",
    description:
      "Personalize comportamentos, expiração e regras de redirecionamento.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-background py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl">
            Tudo que você precisa em um só lugar
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-xl">
            Recursos poderosos para desenvolvedores que precisam de mais do que
            apenas encurtar links
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              className="border-border/50 bg-card/50 backdrop-blur transition-colors hover:bg-card/80"
              key={`feature-${feature.title}-${index}`}
            >
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
