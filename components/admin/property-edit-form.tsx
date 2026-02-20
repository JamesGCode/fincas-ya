// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { sileo } from "sileo";
// import {
//   useProperty,
//   useUpdateProperty,
//   useDeletePropertyImage,
// } from "@/hooks/use-properties";
// import type { UpdatePropertyPayload } from "@/hooks/use-properties";
// import {
//   ArrowLeft,
//   Save,
//   Loader2,
//   Plus,
//   X,
//   MapPin,
//   Users,
//   DollarSign,
//   FileText,
//   ImageIcon,
//   ListChecks,
//   Video,
//   Globe,
//   AlertCircle,
//   Trash2,
//   CheckCircle2,
//   Circle,
// } from "lucide-react";
// import Link from "next/link";
// import { Skeleton } from "@/components/ui/skeleton";

// interface PropertyEditFormProps {
//   propertyId: string;
// }

// export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
//   const { data: property, isLoading, isError } = useProperty(propertyId);
//   const updateMutation = useUpdateProperty();
//   const deleteImageMutation = useDeletePropertyImage();

//   const [form, setForm] = useState<UpdatePropertyPayload>({});
//   const [newFeature, setNewFeature] = useState("");
//   const [newImageUrl, setNewImageUrl] = useState("");

//   // Multi-select state
//   const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
//   const [isDeletingSelected, setIsDeletingSelected] = useState(false);

//   useEffect(() => {
//     if (updateMutation.isSuccess) {
//       sileo.success({ title: "¡Propiedad actualizada exitosamente!" });
//     }
//   }, [updateMutation.isSuccess]);

//   useEffect(() => {
//     if (updateMutation.isError) {
//       sileo.error({
//         title: "Error al actualizar la propiedad",
//         description: "Intentalo de nuevo.",
//       });
//     }
//   }, [updateMutation.isError]);

//   useEffect(() => {
//     if (property) {
//       setForm({
//         title: property.title,
//         description: property.description,
//         location: property.location,
//         capacity: property.capacity,
//         price: property.price,
//         seasonPrices: property.seasonPrices,
//         images: property.images,
//         features: property.features,
//         video: property.video,
//         coordinates: property.coordinates,
//       });
//     }
//   }, [property]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await updateMutation.mutateAsync({ id: propertyId, payload: form });
//     } catch (error) {
//       console.error("Error al actualizar:", error);
//     }
//   };

//   const addFeature = () => {
//     if (newFeature.trim()) {
//       setForm((prev) => ({
//         ...prev,
//         features: [...(prev.features || []), newFeature.trim()],
//       }));
//       setNewFeature("");
//     }
//   };

//   const removeFeature = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       features: prev.features?.filter((_, i) => i !== index),
//     }));
//   };

//   const addImage = () => {
//     if (newImageUrl.trim()) {
//       setForm((prev) => ({
//         ...prev,
//         images: [...(prev.images || []), newImageUrl.trim()],
//       }));
//       setNewImageUrl("");
//     }
//   };

//   // Toggle individual image selection
//   const toggleImageSelection = (index: number) => {
//     setSelectedImages((prev) => {
//       const next = new Set(prev);
//       if (next.has(index)) {
//         next.delete(index);
//       } else {
//         next.add(index);
//       }
//       return next;
//     });
//   };

//   // Select / deselect all
//   const toggleSelectAll = () => {
//     if (selectedImages.size === (form.images?.length || 0)) {
//       setSelectedImages(new Set());
//     } else {
//       setSelectedImages(new Set((form.images || []).map((_, i) => i)));
//     }
//   };

//   // Delete all selected images
//   const deleteSelectedImages = async () => {
//     if (selectedImages.size === 0) return;

//     setIsDeletingSelected(true);
//     const indices = Array.from(selectedImages).sort((a, b) => b - a); // descending to keep indices stable

//     try {
//       await Promise.all(
//         indices.map((index) => {
//           const imageUrl = form.images?.[index];
//           if (!imageUrl) return Promise.resolve();
//           return deleteImageMutation.mutateAsync({ id: propertyId, imageUrl });
//         }),
//       );

//       // Remove from local state (descending order to preserve indices)
//       setForm((prev) => ({
//         ...prev,
//         images: prev.images?.filter((_, i) => !selectedImages.has(i)),
//       }));

//       sileo.success({
//         title: `${selectedImages.size} ${selectedImages.size === 1 ? "imagen eliminada" : "imágenes seleccionadas"} correctamente`,
//       });
//       setSelectedImages(new Set());
//     } catch (error) {
//       sileo.error({ title: "Error al eliminar las imágenes seleccionadas" });
//     } finally {
//       setIsDeletingSelected(false);
//     }
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const newFiles = Array.from(e.target.files);
//       setForm((prev) => ({
//         ...prev,
//         files: [...(prev.files || []), ...newFiles],
//       }));
//     }
//   };

//   const removeFile = (index: number) => {
//     setForm((prev) => ({
//       ...prev,
//       files: prev.files?.filter((_, i) => i !== index),
//     }));
//   };

//   const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       const file = e.target.files[0];
//       setForm((prev) => ({
//         ...prev,
//         videoFile: file,
//       }));
//     }
//   };

//   const removeVideoFile = () => {
//     setForm((prev) => ({
//       ...prev,
//       videoFile: undefined,
//     }));
//   };

//   const removeCurrentVideo = () => {
//     if (
//       window.confirm("¿Estás seguro de que deseas eliminar el video actual?")
//     ) {
//       setForm((prev) => ({
//         ...prev,
//         video: "", // Clear current video URL
//       }));
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
//         <div className="max-w-4xl mx-auto space-y-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Skeleton className="w-10 h-10 rounded-xl" />
//               <div className="space-y-2">
//                 <Skeleton className="h-6 w-48" />
//                 <Skeleton className="h-4 w-32" />
//               </div>
//             </div>
//           </div>
//           <div className="grid grid-cols-1 gap-6">
//             <Skeleton className="h-64 w-full rounded-2xl" />
//             <Skeleton className="h-48 w-full rounded-2xl" />
//             <Skeleton className="h-40 w-full rounded-2xl" />
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError || !property) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20">
//         <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
//           <AlertCircle className="w-7 h-7 text-red-400" />
//         </div>
//         <p className="text-gray-700 font-medium mb-1">
//           No se pudo cargar la propiedad
//         </p>
//         <p className="text-gray-400 text-sm mb-4">
//           Verifica que el ID sea correcto
//         </p>
//         <Link
//           href="/properties"
//           className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90 font-medium transition-colors"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Volver al listado
//         </Link>
//       </div>
//     );
//   }

//   const inputClass =
//     "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-200 shadow-sm";
//   const labelClass =
//     "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-1";

//   const totalImages = form.images?.length || 0;
//   const allSelected = selectedImages.size === totalImages && totalImages > 0;

//   return (
//     <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
//       <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between sticky top-[64px] z-10 bg-gray-50/80 backdrop-blur-xl py-6 -mx-6 px-6 mb-2">
//           <div className="flex items-center gap-5">
//             <Link
//               href="/properties"
//               className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all hover:scale-105 active:scale-95 group"
//             >
//               <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
//             </Link>
//             <div>
//               <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
//                 {property.title}
//               </h1>
//               <div className="flex items-center gap-2 mt-2">
//                 <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
//                   {property.location}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Basic Info */}
//         <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
//           <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50 bg-gray-50/30">
//             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
//               <FileText className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="font-black text-lg text-gray-900 tracking-tight">
//                 Información básica
//               </h2>
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
//                 Detalles principales
//               </p>
//             </div>
//           </div>
//           <div className="p-8 space-y-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-1">
//                 <label className={labelClass}>Título Premium</label>
//                 <input
//                   type="text"
//                   value={form.title || ""}
//                   onChange={(e) =>
//                     setForm((prev) => ({ ...prev, title: e.target.value }))
//                   }
//                   className={inputClass}
//                   placeholder="Ej: Mansión del Sol en Copacabana"
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className={labelClass}>Ubicación Geográfica</label>
//                 <div className="relative group">
//                   <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
//                   <input
//                     type="text"
//                     value={form.location || ""}
//                     onChange={(e) =>
//                       setForm((prev) => ({
//                         ...prev,
//                         location: e.target.value,
//                       }))
//                     }
//                     className={`${inputClass} pl-11`}
//                     placeholder="Ej: Copacabana, Antioquia"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className={labelClass}>Reseña del Alojamiento</label>
//               <textarea
//                 rows={6}
//                 value={form.description || ""}
//                 onChange={(e) =>
//                   setForm((prev) => ({
//                     ...prev,
//                     description: e.target.value,
//                   }))
//                 }
//                 className={`${inputClass} resize-none py-4 leading-relaxed`}
//                 placeholder="Describe la experiencia única que ofrece esta propiedad..."
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-1">
//                 <label className={labelClass}>Capacidad Máxima</label>
//                 <div className="relative group">
//                   <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
//                   <input
//                     type="number"
//                     value={form.capacity || ""}
//                     onChange={(e) =>
//                       setForm((prev) => ({
//                         ...prev,
//                         capacity: Number(e.target.value),
//                       }))
//                     }
//                     className={`${inputClass} pl-11`}
//                   />
//                 </div>
//               </div>
//               <div className="space-y-1">
//                 <label className={labelClass}>Precio por Noche (COP)</label>
//                 <div className="relative group">
//                   <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
//                   <input
//                     type="number"
//                     value={form.seasonPrices?.base || form.price || ""}
//                     onChange={(e) =>
//                       setForm((prev) => ({
//                         ...prev,
//                         seasonPrices: {
//                           ...prev.seasonPrices,
//                           base: Number(e.target.value),
//                           baja: prev.seasonPrices?.baja ?? 0,
//                           media: prev.seasonPrices?.media ?? 0,
//                           alta: prev.seasonPrices?.alta ?? 0,
//                           especiales: prev.seasonPrices?.especiales ?? null,
//                         },
//                       }))
//                     }
//                     className={`${inputClass} pl-11 font-black text-gray-900`}
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-1">
//               <label className={labelClass}>Video de la Finca</label>
//               <div className="space-y-4">
//                 {form.video || form.videoFile ? (
//                   <div className="relative group rounded-2xl overflow-hidden bg-gray-900 aspect-video ring-1 ring-gray-200 shadow-sm max-h-[400px] mx-auto">
//                     {form.videoFile ? (
//                       <video
//                         src={URL.createObjectURL(form.videoFile)}
//                         className="w-full h-full object-contain"
//                         controls
//                       />
//                     ) : (
//                       <video
//                         src={form.video}
//                         className="w-full h-full object-contain"
//                         controls
//                       />
//                     )}
//                     <button
//                       type="button"
//                       onClick={
//                         form.videoFile ? removeVideoFile : removeCurrentVideo
//                       }
//                       className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-500 hover:text-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                     <div className="absolute bottom-3 left-3">
//                       <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20">
//                         {form.videoFile ? "Por subir" : "Actual"}
//                       </span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="relative group">
//                     <input
//                       type="file"
//                       id="video-upload"
//                       accept="video/*"
//                       className="hidden"
//                       onChange={handleVideoSelect}
//                     />
//                     <label
//                       htmlFor="video-upload"
//                       className="flex flex-col items-center justify-center gap-2 w-full p-8 rounded-2xl border-2 border-dashed border-gray-100 hover:border-primary/30 hover:bg-primary/5 text-gray-400 hover:text-primary cursor-pointer transition-all duration-300"
//                     >
//                       <Video className="w-8 h-8 mb-1" />
//                       <span className="text-sm font-black uppercase tracking-widest">
//                         Subir Video de la Propiedad
//                       </span>
//                     </label>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Coordinates */}
//         <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
//           <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50 bg-gray-50/30">
//             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
//               <Globe className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="font-black text-lg text-gray-900 tracking-tight">
//                 Coordenadas
//               </h2>
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
//                 Ubicación exacta en el mapa
//               </p>
//             </div>
//           </div>
//           <div className="p-8">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-1">
//                 <label className={labelClass}>Latitud</label>
//                 <input
//                   type="number"
//                   step="any"
//                   value={form.coordinates?.lat || ""}
//                   onChange={(e) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       coordinates: {
//                         ...prev.coordinates!,
//                         lat: Number(e.target.value),
//                       },
//                     }))
//                   }
//                   className={inputClass}
//                 />
//               </div>
//               <div className="space-y-1">
//                 <label className={labelClass}>Longitud</label>
//                 <input
//                   type="number"
//                   step="any"
//                   value={form.coordinates?.lng || ""}
//                   onChange={(e) =>
//                     setForm((prev) => ({
//                       ...prev,
//                       coordinates: {
//                         ...prev.coordinates!,
//                         lng: Number(e.target.value),
//                       },
//                     }))
//                   }
//                   className={inputClass}
//                 />
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Features */}
//         <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
//           <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50 bg-gray-50/30">
//             <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
//               <ListChecks className="w-5 h-5 text-primary" />
//             </div>
//             <div>
//               <h2 className="font-black text-lg text-gray-900 tracking-tight">
//                 Características
//               </h2>
//               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
//                 {form.features?.length || 0} Amenidades registradas
//               </p>
//             </div>
//           </div>
//           <div className="p-8 space-y-6">
//             <div className="flex flex-wrap gap-3">
//               {form.features?.map((feature, index) => (
//                 <span
//                   key={index}
//                   className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 group/tag hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
//                 >
//                   {feature}
//                   <button
//                     type="button"
//                     onClick={() => removeFeature(index)}
//                     className="text-gray-300 hover:text-orange-600 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </span>
//               ))}
//               {!form.features?.length && (
//                 <div className="w-full py-8 border-2 border-dashed border-gray-50 rounded-[24px] flex flex-col items-center justify-center text-gray-300">
//                   <ListChecks className="w-8 h-8 mb-2 opacity-20" />
//                   <p className="text-sm font-bold uppercase tracking-widest">
//                     Sin características
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="flex gap-3 pt-2">
//               <input
//                 type="text"
//                 value={newFeature}
//                 onChange={(e) => setNewFeature(e.target.value)}
//                 onKeyDown={(e) =>
//                   e.key === "Enter" && (e.preventDefault(), addFeature())
//                 }
//                 placeholder="Agrega una nueva característica..."
//                 className={`${inputClass} flex-1`}
//               />
//               <button
//                 type="button"
//                 onClick={addFeature}
//                 disabled={!newFeature.trim()}
//                 className="px-6 rounded-2xl bg-gray-900 hover:bg-black text-white shadow-md transition-all active:scale-95 disabled:opacity-20"
//               >
//                 <Plus className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </section>

//         {/* Images */}
//         <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
//           <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/30">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
//                 <ImageIcon className="w-5 h-5 text-primary" />
//               </div>
//               <div>
//                 <h2 className="font-black text-lg text-gray-900 tracking-tight">
//                   Multimedia
//                 </h2>
//                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
//                   {(form.images?.length || 0) + (form.files?.length || 0)} Fotos
//                   seleccionadas
//                 </p>
//               </div>
//             </div>

//             {/* Select All / Deselect All toggle — only when there are existing images */}
//             {totalImages > 0 && (
//               <button
//                 type="button"
//                 onClick={toggleSelectAll}
//                 className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all duration-200
//                   border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/30 active:scale-95"
//               >
//                 {allSelected ? (
//                   <>
//                     <CheckCircle2 className="w-4 h-4" />
//                     Deseleccionar todo
//                   </>
//                 ) : (
//                   <>
//                     <Circle className="w-4 h-4" />
//                     Seleccionar todo
//                   </>
//                 )}
//               </button>
//             )}
//           </div>

//           <div className="p-8 space-y-10">
//             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
//               {/* Existing Images — selectable */}
//               {form.images?.map((img, index) => {
//                 const isSelected = selectedImages.has(index);
//                 return (
//                   <div
//                     key={`existing-${index}`}
//                     onClick={() => toggleImageSelection(index)}
//                     className={`relative group rounded-3xl overflow-hidden aspect-square bg-gray-100 cursor-pointer
//                       ring-2 shadow-sm transition-all duration-200
//                       ${
//                         isSelected
//                           ? "ring-orange-500 scale-[0.97] shadow-orange-100"
//                           : "ring-gray-100 hover:ring-orange-200 hover:scale-[0.98]"
//                       }`}
//                   >
//                     <Image
//                       src={img}
//                       alt={`Imagen ${index + 1}`}
//                       fill
//                       className={`object-cover transition-all duration-500 ${isSelected ? "brightness-75" : "group-hover:scale-110"}`}
//                     />

//                     {/* Overlay on selected */}
//                     <div
//                       className={`absolute inset-0 transition-all duration-300 ${
//                         isSelected
//                           ? "bg-orange-900/20"
//                           : "bg-black/0 group-hover:bg-linear-to-t group-hover:from-black/50 group-hover:via-transparent"
//                       }`}
//                     />

//                     {/* Checkbox indicator */}
//                     <div
//                       className={`absolute top-3 right-3 transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"}`}
//                     >
//                       <div
//                         className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-200
//                         ${
//                           isSelected
//                             ? "bg-orange-500 border-orange-500"
//                             : "bg-white/80 border-white backdrop-blur-sm"
//                         }`}
//                       >
//                         {isSelected ? (
//                           <CheckCircle2 className="w-4 h-4 text-white" />
//                         ) : (
//                           <Circle className="w-4 h-4 text-gray-400" />
//                         )}
//                       </div>
//                     </div>

//                     {/* Badge */}
//                     <div
//                       className={`absolute bottom-3 left-3 transition-all duration-200 ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 translate-y-[10px] group-hover:translate-y-0"}`}
//                     >
//                       <span
//                         className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border
//                         ${
//                           isSelected
//                             ? "bg-orange-500 text-white border-orange-400"
//                             : "bg-white/30 backdrop-blur-md text-white border-white/20"
//                         }`}
//                       >
//                         {isSelected ? "Seleccionada" : "Digital"}
//                       </span>
//                     </div>
//                   </div>
//                 );
//               })}

//               {/* New Files */}
//               {form.files?.map((file, index) => (
//                 <div
//                   key={`new-${index}`}
//                   className="relative group rounded-3xl overflow-hidden aspect-square bg-orange-50/50 ring-2 ring-dashed ring-orange-200"
//                 >
//                   <Image
//                     src={URL.createObjectURL(file)}
//                     alt={`Nueva ${index + 1}`}
//                     fill
//                     className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
//                     onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeFile(index)}
//                     className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-500 hover:text-orange-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                   <div className="absolute bottom-3 left-3">
//                     <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
//                       Nueva
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="relative group">
//               <input
//                 type="file"
//                 id="image-upload"
//                 multiple
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleFileSelect}
//               />
//               <label
//                 htmlFor="image-upload"
//                 className="flex flex-col items-center justify-center gap-4 w-full p-12 rounded-[40px] border-2 border-dashed border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 text-gray-400 hover:text-orange-600 cursor-pointer transition-all duration-500"
//               >
//                 <div className="p-5 rounded-[24px] bg-gray-50 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-500">
//                   <Plus className="w-8 h-8" />
//                 </div>
//                 <div className="text-center">
//                   <span className="text-lg font-black tracking-tight block">
//                     Añadir contenido visual
//                   </span>
//                   <span className="text-sm font-bold opacity-60 mt-1 block">
//                     Sube archivos JPG, PNG o WebP de alta calidad
//                   </span>
//                 </div>
//               </label>
//             </div>
//           </div>
//         </section>

//         {/* Botón de guardar */}
//         <div className="sticky bottom-8 z-10 px-8 py-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl shadow-orange-100">
//           <button
//             type="submit"
//             disabled={updateMutation.isPending}
//             className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[24px] bg-orange-600 text-white text-base font-black hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-[0.98]"
//           >
//             {updateMutation.isPending ? (
//               <Loader2 className="w-6 h-6 animate-spin" />
//             ) : (
//               <Save className="w-6 h-6" />
//             )}
//             Sincronizar cambios
//           </button>
//         </div>
//       </form>

//       {/* Floating multi-delete action bar */}
//       <div
//         className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out
//           ${
//             selectedImages.size > 0
//               ? "opacity-100 translate-y-0 pointer-events-auto"
//               : "opacity-0 translate-y-6 pointer-events-none"
//           }`}
//       >
//         <div className="flex items-center gap-4 px-6 py-4 rounded-[28px] bg-gray-950 shadow-2xl shadow-black/40 border border-white/10">
//           <div className="flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-inner">
//               <span className="text-white text-sm font-black leading-none">
//                 {selectedImages.size}
//               </span>
//             </div>
//             <span className="text-white text-sm font-bold">
//               {selectedImages.size === 1
//                 ? "imagen seleccionada"
//                 : "imágenes seleccionadas"}
//             </span>
//           </div>

//           <div className="w-px h-8 bg-white/10" />

//           <button
//             type="button"
//             onClick={() => setSelectedImages(new Set())}
//             className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors px-2 py-1 rounded-xl hover:bg-white/10"
//           >
//             Cancelar
//           </button>

//           <button
//             type="button"
//             onClick={deleteSelectedImages}
//             disabled={isDeletingSelected}
//             className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-red-500 hover:bg-red-600 text-white text-sm font-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-red-500/30"
//           >
//             {isDeletingSelected ? (
//               <Loader2 className="w-4 h-4 animate-spin" />
//             ) : (
//               <Trash2 className="w-4 h-4" />
//             )}
//             Eliminar{" "}
//             {selectedImages.size > 1 ? `${selectedImages.size} fotos` : "foto"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { sileo } from "sileo";
import {
  useProperty,
  useUpdateProperty,
  useDeletePropertyImage,
  useDeletePropertyVideo,
} from "@/hooks/use-properties";
import type { UpdatePropertyPayload } from "@/hooks/use-properties";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  X,
  MapPin,
  Users,
  DollarSign,
  FileText,
  ImageIcon,
  ListChecks,
  Video,
  Globe,
  AlertCircle,
  Trash2,
  CheckCircle2,
  Circle,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PropertyEditFormProps {
  propertyId: string;
}

export function PropertyEditForm({ propertyId }: PropertyEditFormProps) {
  const { data: property, isLoading, isError } = useProperty(propertyId);
  const updateMutation = useUpdateProperty();
  const deleteImageMutation = useDeletePropertyImage();
  const deleteVideoMutation = useDeletePropertyVideo();

  const [form, setForm] = useState<UpdatePropertyPayload>({});
  const [newFeature, setNewFeature] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  // Multi-select state
  const [selectedImages, setSelectedImages] = useState<Set<number>>(new Set());
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  // Delete video dialog state
  const [showDeleteVideoDialog, setShowDeleteVideoDialog] = useState(false);

  useEffect(() => {
    if (updateMutation.isSuccess) {
      sileo.success({ title: "¡Propiedad actualizada exitosamente!" });
    }
  }, [updateMutation.isSuccess]);

  useEffect(() => {
    if (updateMutation.isError) {
      sileo.error({
        title: "Error al actualizar la propiedad",
        description: "Intentalo de nuevo.",
      });
    }
  }, [updateMutation.isError]);

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title,
        description: property.description,
        location: property.location,
        capacity: property.capacity,
        price: property.price,
        seasonPrices: property.seasonPrices,
        images: property.images,
        features: property.features,
        video: property.video,
        coordinates: property.coordinates,
      });
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateMutation.mutateAsync({ id: propertyId, payload: form });
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm((prev) => ({
        ...prev,
        features: [...(prev.features || []), newFeature.trim()],
      }));
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }));
  };

  const addImage = () => {
    if (newImageUrl.trim()) {
      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImageUrl.trim()],
      }));
      setNewImageUrl("");
    }
  };

  // Toggle individual image selection
  const toggleImageSelection = (index: number) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Select / deselect all
  const toggleSelectAll = () => {
    if (selectedImages.size === (form.images?.length || 0)) {
      setSelectedImages(new Set());
    } else {
      setSelectedImages(new Set((form.images || []).map((_, i) => i)));
    }
  };

  // Delete all selected images
  const deleteSelectedImages = async () => {
    if (selectedImages.size === 0) return;

    setIsDeletingSelected(true);
    const indices = Array.from(selectedImages).sort((a, b) => b - a); // descending to keep indices stable

    try {
      await Promise.all(
        indices.map((index) => {
          const imageUrl = form.images?.[index];
          if (!imageUrl) return Promise.resolve();
          return deleteImageMutation.mutateAsync({ id: propertyId, imageUrl });
        }),
      );

      // Remove from local state (descending order to preserve indices)
      setForm((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => !selectedImages.has(i)),
      }));

      sileo.success({
        title: `${selectedImages.size} ${selectedImages.size === 1 ? "imagen eliminada" : "imágenes seleccionadas"} correctamente`,
      });
      setSelectedImages(new Set());
    } catch (error) {
      sileo.error({ title: "Error al eliminar las imágenes seleccionadas" });
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setForm((prev) => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setForm((prev) => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index),
    }));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm((prev) => ({
        ...prev,
        videoFile: file,
      }));
    }
  };

  const removeVideoFile = () => {
    setForm((prev) => ({
      ...prev,
      videoFile: undefined,
    }));
  };

  const removeCurrentVideo = () => {
    setShowDeleteVideoDialog(true);
  };

  const confirmDeleteVideo = async () => {
    const videoUrl = form.video;
    if (!videoUrl) return;

    try {
      await deleteVideoMutation.mutateAsync({
        id: propertyId,
        videoUrl,
      });

      setForm((prev) => ({ ...prev, video: "" }));
      sileo.success({ title: "Video eliminado correctamente" });
    } catch (error) {
      sileo.error({ title: "Error al eliminar el video" });
    } finally {
      setShowDeleteVideoDialog(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-40 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !property) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertCircle className="w-7 h-7 text-red-400" />
        </div>
        <p className="text-gray-700 font-medium mb-1">
          No se pudo cargar la propiedad
        </p>
        <p className="text-gray-400 text-sm mb-4">
          Verifica que el ID sea correcto
        </p>
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/90 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al listado
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all duration-200 shadow-sm";
  const labelClass =
    "block text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2.5 px-1";

  const totalImages = form.images?.length || 0;
  const allSelected = selectedImages.size === totalImages && totalImages > 0;

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50/50 min-h-[calc(100vh-4rem)]">
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between sticky top-[64px] z-10 bg-gray-50/80 backdrop-blur-xl py-6 -mx-6 px-6 mb-2">
          <div className="flex items-center gap-5">
            <Link
              href="/properties"
              className="p-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all hover:scale-105 active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
            </Link>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                {property.title}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  {property.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-lg text-gray-900 tracking-tight">
                Información básica
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Detalles principales
              </p>
            </div>
          </div>
          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className={labelClass}>Título Premium</label>
                <input
                  type="text"
                  value={form.title || ""}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="Ej: Mansión del Sol en Copacabana"
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Ubicación Geográfica</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    value={form.location || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className={`${inputClass} pl-11`}
                    placeholder="Ej: Copacabana, Antioquia"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Reseña del Alojamiento</label>
              <textarea
                rows={6}
                value={form.description || ""}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className={`${inputClass} resize-none py-4 leading-relaxed`}
                placeholder="Describe la experiencia única que ofrece esta propiedad..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className={labelClass}>Capacidad Máxima</label>
                <div className="relative group">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    value={form.capacity || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        capacity: Number(e.target.value),
                      }))
                    }
                    className={`${inputClass} pl-11`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Precio por Noche (COP)</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input
                    type="number"
                    value={form.seasonPrices?.base || form.price || ""}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        seasonPrices: {
                          ...prev.seasonPrices,
                          base: Number(e.target.value),
                          baja: prev.seasonPrices?.baja ?? 0,
                          media: prev.seasonPrices?.media ?? 0,
                          alta: prev.seasonPrices?.alta ?? 0,
                          especiales: prev.seasonPrices?.especiales ?? null,
                        },
                      }))
                    }
                    className={`${inputClass} pl-11 font-black text-gray-900`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Video de la Finca</label>
              <div className="space-y-4">
                {form.video || form.videoFile ? (
                  <div className="relative group rounded-2xl overflow-hidden bg-gray-900 aspect-video ring-1 ring-gray-200 shadow-sm max-h-[400px] mx-auto">
                    {form.videoFile ? (
                      <video
                        src={URL.createObjectURL(form.videoFile)}
                        className="w-full h-full object-contain"
                        controls
                      />
                    ) : (
                      <video
                        src={form.video}
                        className="w-full h-full object-contain"
                        controls
                      />
                    )}
                    <button
                      type="button"
                      onClick={
                        form.videoFile ? removeVideoFile : removeCurrentVideo
                      }
                      className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-500 hover:text-red-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full border border-white/20">
                        {form.videoFile ? "Por subir" : "Actual"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoSelect}
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex flex-col items-center justify-center gap-2 w-full p-8 rounded-2xl border-2 border-dashed border-gray-100 hover:border-primary/30 hover:bg-primary/5 text-gray-400 hover:text-primary cursor-pointer transition-all duration-300"
                    >
                      <Video className="w-8 h-8 mb-1" />
                      <span className="text-sm font-black uppercase tracking-widest">
                        Subir Video de la Propiedad
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Coordinates */}
        <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-lg text-gray-900 tracking-tight">
                Coordenadas
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                Ubicación exacta en el mapa
              </p>
            </div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className={labelClass}>Latitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.coordinates?.lat || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      coordinates: {
                        ...prev.coordinates!,
                        lat: Number(e.target.value),
                      },
                    }))
                  }
                  className={inputClass}
                />
              </div>
              <div className="space-y-1">
                <label className={labelClass}>Longitud</label>
                <input
                  type="number"
                  step="any"
                  value={form.coordinates?.lng || ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      coordinates: {
                        ...prev.coordinates!,
                        lng: Number(e.target.value),
                      },
                    }))
                  }
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <ListChecks className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-black text-lg text-gray-900 tracking-tight">
                Características
              </h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {form.features?.length || 0} Amenidades registradas
              </p>
            </div>
          </div>
          <div className="p-8 space-y-6">
            <div className="flex flex-wrap gap-3">
              {form.features?.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-100 text-sm font-bold text-gray-700 group/tag hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-gray-300 hover:text-orange-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
              {!form.features?.length && (
                <div className="w-full py-8 border-2 border-dashed border-gray-50 rounded-[24px] flex flex-col items-center justify-center text-gray-300">
                  <ListChecks className="w-8 h-8 mb-2 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">
                    Sin características
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addFeature())
                }
                placeholder="Agrega una nueva característica..."
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addFeature}
                disabled={!newFeature.trim()}
                className="px-6 rounded-2xl bg-gray-900 hover:bg-black text-white shadow-md transition-all active:scale-95 disabled:opacity-20"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="rounded-[32px] bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50 bg-gray-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-black text-lg text-gray-900 tracking-tight">
                  Multimedia
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {(form.images?.length || 0) + (form.files?.length || 0)} Fotos
                  seleccionadas
                </p>
              </div>
            </div>

            {/* Select All / Deselect All toggle — only when there are existing images */}
            {totalImages > 0 && (
              <button
                type="button"
                onClick={toggleSelectAll}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all duration-200
                  border-gray-200 text-gray-500 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/30 active:scale-95"
              >
                {allSelected ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Deseleccionar todo
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    Seleccionar todo
                  </>
                )}
              </button>
            )}
          </div>

          <div className="p-8 space-y-10">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {/* Existing Images — selectable */}
              {form.images?.map((img, index) => {
                const isSelected = selectedImages.has(index);
                return (
                  <div
                    key={`existing-${index}`}
                    onClick={() => toggleImageSelection(index)}
                    className={`relative group rounded-3xl overflow-hidden aspect-square bg-gray-100 cursor-pointer
                      ring-2 shadow-sm transition-all duration-200
                      ${
                        isSelected
                          ? "ring-orange-500 scale-[0.97] shadow-orange-100"
                          : "ring-gray-100 hover:ring-orange-200 hover:scale-[0.98]"
                      }`}
                  >
                    <Image
                      src={img}
                      alt={`Imagen ${index + 1}`}
                      fill
                      className={`object-cover transition-all duration-500 ${isSelected ? "brightness-75" : "group-hover:scale-110"}`}
                    />

                    {/* Overlay on selected */}
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${
                        isSelected
                          ? "bg-orange-900/20"
                          : "bg-black/0 group-hover:bg-linear-to-t group-hover:from-black/50 group-hover:via-transparent"
                      }`}
                    />

                    {/* Checkbox indicator */}
                    <div
                      className={`absolute top-3 right-3 transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 transition-all duration-200
                        ${
                          isSelected
                            ? "bg-orange-500 border-orange-500"
                            : "bg-white/80 border-white backdrop-blur-sm"
                        }`}
                      >
                        {isSelected ? (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>

                    {/* Badge */}
                    <div
                      className={`absolute bottom-3 left-3 transition-all duration-200 ${isSelected ? "opacity-100 translate-y-0" : "opacity-0 group-hover:opacity-100 translate-y-[10px] group-hover:translate-y-0"}`}
                    >
                      <span
                        className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border
                        ${
                          isSelected
                            ? "bg-orange-500 text-white border-orange-400"
                            : "bg-white/30 backdrop-blur-md text-white border-white/20"
                        }`}
                      >
                        {isSelected ? "Seleccionada" : "Digital"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* New Files */}
              {form.files?.map((file, index) => (
                <div
                  key={`new-${index}`}
                  className="relative group rounded-3xl overflow-hidden aspect-square bg-orange-50/50 ring-2 ring-dashed ring-orange-200"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={`Nueva ${index + 1}`}
                    fill
                    className="object-cover opacity-90 transition-transform duration-500 group-hover:scale-110"
                    onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-white/90 text-gray-500 hover:text-orange-600 shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-[-10px] group-hover:translate-y-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-3 py-1.5 rounded-full shadow-lg">
                      Nueva
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative group">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center gap-4 w-full p-12 rounded-[40px] border-2 border-dashed border-gray-100 hover:border-orange-200 hover:bg-orange-50/20 text-gray-400 hover:text-orange-600 cursor-pointer transition-all duration-500"
              >
                <div className="p-5 rounded-[24px] bg-gray-50 group-hover:bg-orange-100 group-hover:scale-110 transition-all duration-500">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <span className="text-lg font-black tracking-tight block">
                    Añadir contenido visual
                  </span>
                  <span className="text-sm font-bold opacity-60 mt-1 block">
                    Sube archivos JPG, PNG o WebP de alta calidad
                  </span>
                </div>
              </label>
            </div>
          </div>
        </section>

        {/* Botón de guardar */}
        <div className="sticky bottom-8 z-10 px-8 py-6 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[40px] shadow-2xl shadow-orange-100">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[24px] bg-orange-600 text-white text-base font-black hover:bg-orange-700 shadow-xl shadow-orange-200 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1 active:scale-[0.98]"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Save className="w-6 h-6" />
            )}
            Sincronizar cambios
          </button>
        </div>
      </form>

      {/* Floating multi-delete action bar */}
      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-out
          ${
            selectedImages.size > 0
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-6 pointer-events-none"
          }`}
      >
        <div className="flex items-center gap-4 px-6 py-4 rounded-[28px] bg-gray-950 shadow-2xl shadow-black/40 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center shadow-inner">
              <span className="text-white text-sm font-black leading-none">
                {selectedImages.size}
              </span>
            </div>
            <span className="text-white text-sm font-bold">
              {selectedImages.size === 1
                ? "imagen seleccionada"
                : "imágenes seleccionadas"}
            </span>
          </div>

          <div className="w-px h-8 bg-white/10" />

          <button
            type="button"
            onClick={() => setSelectedImages(new Set())}
            className="text-gray-400 hover:text-white text-xs font-black uppercase tracking-widest transition-colors px-2 py-1 rounded-xl hover:bg-white/10"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={deleteSelectedImages}
            disabled={isDeletingSelected}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[16px] bg-red-500 hover:bg-red-600 text-white text-sm font-black transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-red-500/30"
          >
            {isDeletingSelected ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            Eliminar{" "}
            {selectedImages.size > 1 ? `${selectedImages.size} fotos` : "foto"}
          </button>
        </div>
      </div>

      {/* Delete Video Confirmation Dialog */}
      <AlertDialog
        open={showDeleteVideoDialog}
        onOpenChange={setShowDeleteVideoDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar video actual?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el video de la propiedad. Podrás subir uno
              nuevo después de guardar los cambios.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDeleteVideo();
              }}
              disabled={deleteVideoMutation.isPending}
              className="bg-red-500! hover:bg-red-600 text-white"
            >
              {deleteVideoMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
