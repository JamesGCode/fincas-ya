import { useState, useEffect } from "react";

export interface Review {
  id: string;
  fincaId: string;
  userName: string;
  userLocation: string;
  rating: number; // 1-5
  date: string; // ISO string or formatted string
  comment: string;
  monthsOnPlatform?: string; // Optional "8 meses en Airbnb" style
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "mock-1",
    fincaId: "viota-luxury-house-26-36-pax-viota-cundinamarca",
    userName: "Daniel",
    userLocation: "Facatativá, Colombia",
    rating: 5,
    date: "enero de 2026",
    comment:
      "Un apartamento muy acogedor, que realmente se siente como un hogar. Todo estaba impecablemente ordenado y lleno de detalles que marcan la diferencia: chocolates de bienvenida, café delicioso.",
  },
  {
    id: "mock-2",
    fincaId: "viota-luxury-house-26-36-pax-viota-cundinamarca",
    userName: "Sofía",
    userLocation: "8 meses en Airbnb",
    rating: 4,
    date: "enero de 2026",
    comment:
      "Fue una buena estadía. Fue un poco difícil al inicio encontrar la dirección porque estaba mal un número. Del resto bien, había todo lo necesario, es un lugar cercano a todo.",
    monthsOnPlatform: "8 meses en Airbnb",
  },
  {
    id: "mock-3",
    fincaId: "viota-luxury-house-26-36-pax-viota-cundinamarca",
    userName: "Viviana",
    userLocation: "Madrid, Colombia",
    rating: 5,
    date: "agosto de 2025",
    comment:
      "El lugar fue exactamente igual a las fotos, muy acogedor. El personal del edificio también nos prestó ayuda con el parqueadero. En definitiva volveremos porque tanto el lugar como la atención fueron excelentes.",
  },
  {
    id: "mock-4",
    fincaId: "viota-luxury-house-26-36-pax-viota-cundinamarca",
    userName: "Dora Mignely",
    userLocation: "9 años en Airbnb",
    rating: 5,
    date: "octubre de 2025",
    comment:
      "El apartamento está bien ubicado, es central y se encuentra impecable, Paola es servicial y está muy pendiente de las inquietudes y necesidades requeridas.",
    monthsOnPlatform: "9 años en Airbnb",
  },
];

const STORAGE_KEY = "fincas-reviews-store";

export function useReviews(fincaId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from localStorage on mount
  useEffect(() => {
    const loadReviews = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const storedReviews: Review[] = stored ? JSON.parse(stored) : [];

        // Merge stored reviews with mock reviews (mock reviews only if no stored for that ID, or just always append mock?)
        // For this demo: combine all stored + filter mocks by current ID
        // In a real app, mocks probably wouldn't be mixed this way, but useful for demo
        const currentFincaMocks = MOCK_REVIEWS.filter(
          (r) => r.fincaId === fincaId || !r.fincaId /* global mocks? no */,
        );

        // Combine: Stored (User created) + Mocks
        // Filter stored by fincaId as well
        const relevantStored = storedReviews.filter(
          (r) => r.fincaId === fincaId,
        );

        // To avoid duplicates if we save mocks? No, just save NEW ones.
        setReviews([...relevantStored, ...currentFincaMocks]);
      } catch (error) {
        console.error("Failed to load reviews", error);
        // Fallback to mocks
        setReviews(MOCK_REVIEWS.filter((r) => r.fincaId === fincaId));
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [fincaId]);

  const addReview = (newReview: Omit<Review, "id" | "date">) => {
    const review: Review = {
      ...newReview,
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
      }),
    };

    setReviews((prev) => [review, ...prev]);

    // Persist to localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const allStoredReviews: Review[] = stored ? JSON.parse(stored) : [];
      const updatedAllReviews = [review, ...allStoredReviews];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAllReviews));
    } catch (error) {
      console.error("Failed to save review", error);
    }
  };

  return {
    reviews,
    isLoading,
    addReview,
    reviewCount: reviews.length,
    averageRating:
      reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1),
  };
}
