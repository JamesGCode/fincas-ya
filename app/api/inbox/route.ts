import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://app.fincasya.cloud";

/**
 * Proxies root /api/inbox requests to the backend.
 * This ensures the frontend's session_token is correctly sent to our backend
 * to authenticate requests like getting conversations.
 */
async function handler(request: NextRequest) {
  const backendPath = `/api/inbox`;
  const backendUrl = new URL(backendPath, BACKEND_URL);

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

  // Forward body for non-GET requests
  if (request.method !== "GET" && request.method !== "HEAD") {
    const contentType = request.headers.get("Content-Type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
    } else if (contentType.includes("multipart/form-data")) {
      headers.delete("Content-Type");
      const formData = await request.formData();
      fetchOptions.body = formData;
    } else {
      fetchOptions.body = await request.arrayBuffer();
    }
  }

  // Make the request to the backend
  const backendResponse = await fetch(backendUrl.toString(), fetchOptions);

  const responseBody = await backendResponse.text();

  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
  });

  backendResponse.headers.forEach((value, key) => {
    const skipHeaders = ["transfer-encoding", "connection", "keep-alive"];
    if (!skipHeaders.includes(key.toLowerCase())) {
      response.headers.append(key, value);
    }
  });

  return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
export const PATCH = handler;
