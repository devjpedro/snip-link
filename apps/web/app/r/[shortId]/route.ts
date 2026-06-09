import { env } from "@snip-link/env";
import { type NextRequest, NextResponse } from "next/server";

// Links curtos vivem no domínio do front (ex: sniplinkbr.vercel.app/r/abc123),
// mas a lógica de redirect + contagem de cliques está na API. Este handler
// repassa a requisição para a API server-to-server, encaminhando o cookie de
// sessão (para que o clique do próprio dono não seja contado), e devolve o
// redirect ao navegador.
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortId: string }> }
) {
  const { shortId } = await params;

  const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/r/${shortId}`, {
    headers: { cookie: _request.headers.get("cookie") ?? "" },
    redirect: "manual",
  });

  const location = response.headers.get("location");

  if (location && response.status >= 300 && response.status < 400) {
    return NextResponse.redirect(location);
  }

  return NextResponse.redirect(new URL("/not-found", _request.url));
}
