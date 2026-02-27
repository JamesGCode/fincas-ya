import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Set the workerSrc to a public URL to avoid issues with Webpack/Next.js
// We use unpkg as a reliable CDN for the worker
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

/**
 * Generates a base64 image preview from the first page of a PDF File.
 *
 * @param file The PDF File object
 * @returns A promise that resolves to a base64 data URL of the rendered image.
 */
export async function generatePdfPreview(file: File): Promise<string> {
  if (file.type !== "application/pdf") {
    throw new Error("File is not a PDF");
  }

  // Create a URL for the file to pass to pdf.js
  const fileUrl = URL.createObjectURL(file);

  try {
    const loadingTask = getDocument(fileUrl);
    const pdf = await loadingTask.promise;

    // Get the first page
    const page = await pdf.getPage(1);

    // Set scale to a reasonable value for thumbnails to save memory but keep quality
    const viewport = page.getViewport({ scale: 1.5 });

    // Create a canvas to render the page onto
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create canvas context");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render the page on the canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert canvas to base64 image
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    return dataUrl;
  } finally {
    // Always cleanup the object URL
    URL.revokeObjectURL(fileUrl);
  }
}

/**
 * Generates a base64 image preview from a PDF URL.
 *
 * @param url The PDF URL string
 * @returns A promise that resolves to a base64 data URL of the rendered image.
 */
export async function generatePdfPreviewFromUrl(url: string): Promise<string> {
  try {
    // Determine if we need to proxy the request to bypass CORS
    // If it's a full URL (like S3), we proxy it through a simple absolute path or api route
    // Alternatively, pdf.js can handle it if we set withCredentials false or bypass
    let fetchUrl = url;
    if (url.startsWith("http")) {
      // By using our own backend or next.js api proxy, we avoid CORS issues.
      // Easiest client-side fix for S3 CORS is to proxy it if S3 CORS isn't configured.
      fetchUrl = `/api/cors-proxy?url=${encodeURIComponent(url)}`;
    }

    const loadingTask = getDocument(fetchUrl);
    const pdf = await loadingTask.promise;

    // Get the first page
    const page = await pdf.getPage(1);

    // Set scale
    const viewport = page.getViewport({ scale: 1.5 });

    // Create canvas
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Could not create canvas context");
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render on canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    await page.render(renderContext).promise;

    // Convert to base64
    return canvas.toDataURL("image/jpeg", 0.8);
  } catch (error) {
    console.error("Error generating PDF preview from URL:", url, error);
    throw error;
  }
}
