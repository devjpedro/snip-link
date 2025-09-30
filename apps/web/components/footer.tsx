import { Github, LinkIcon, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { branding } from "@/app/constants/branding";

export function Footer() {
  return (
    <footer className="border-border border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 text-center sm:text-left md:grid-cols-4">
          <div className="space-y-4">
            <Link
              className="flex items-center justify-center space-x-2 sm:justify-start"
              href="/"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <LinkIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="gradient-text font-bold text-xl">
                {branding.name}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Encurtador de links moderno e gratuito, feito especialmente para
              desenvolvedores.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/"
                >
                  Encurtar Links
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="/analytics"
                >
                  Analytics
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Recursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="http://localhost:3333/openapi"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Documentação
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="http://localhost:3333/openapi"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  API
                </Link>
              </li>
              <li>
                <Link
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  href="http://localhost:3333/openapi"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Ajuda
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Conecte-se</h3>
            <div className="flex justify-center space-x-4 sm:justify-start">
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="#"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="#"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                className="text-muted-foreground transition-colors hover:text-foreground"
                href="#"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 border-border border-t pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 {branding.name}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
