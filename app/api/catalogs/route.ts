import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://app.fincasya.cloud";

async function handler(request: NextRequest) {
  const backendUrl = new URL("/api/catalogs", BACKEND_URL);

  // Forward query params
  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.set(key, value);
  });

  // Build headers to forward (including cookies)
  const headers = new Headers();
  const reqContentType = request.headers.get("Content-Type");
  if (reqContentType) {
    headers.set("Content-Type", reqContentType);
  }

  const cookie = request.headers.get("cookie");
  if (cookie) {
    headers.set("cookie", cookie);
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  // Make the request to the backend
  const backendResponse = await fetch(backendUrl.toString(), fetchOptions);

  // Read the response body
  const responseBody = await backendResponse.text();

  // Create the Next.js response, forwarding status and body
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });

  // Forward all response headers
  backendResponse.headers.forEach((value, key) => {
    const skipHeaders = ["transfer-encoding", "connection", "keep-alive"];
    if (!skipHeaders.includes(key.toLowerCase())) {
      response.headers.append(key, value);
    }
  });

  return response;
}

export const GET = handler;
