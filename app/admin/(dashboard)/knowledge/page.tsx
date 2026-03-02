"use client";

import { useState, useRef } from "react";
import {
  Brain,
  UploadCloud,
  FileText,
  X,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sileo } from "sileo";

export default function KnowledgeBasePage() {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState("normas");
  const [namespace, setNamespace] = useState("fincas");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (
        droppedFile.type === "application/pdf" ||
        droppedFile.name.endsWith(".txt") ||
        droppedFile.name.endsWith(".csv")
      ) {
        setFile(droppedFile);
      } else {
        sileo.error({
          title: "Formato no válido",
          description: "Por favor sube un archivo PDF, TXT o CSV.",
        });
      }
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleUpload = async () => {
    if (!file) {
      sileo.error({
        title: "Archivo requerido",
        description: "Por favor selecciona un archivo para subir.",
      });
      return;
    }
    if (!category.trim() || !namespace.trim()) {
      sileo.error({
        title: "Campos requeridos",
        description: "Categoría y Namespace son requeridos.",
      });
      return;
    }
    setIsUploading(true);
    setUploadProgress(10);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);
    formData.append("namespace", namespace);
    try {
      // simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      const response = await fetch("/api/knowledge/upload", {
        method: "POST",
        body: formData,
      });
      clearInterval(progressInterval);
      setUploadProgress(100);
      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }
      sileo.success({
        title: "¡Archivo subido!",
        description:
          "El documento ha sido indexado correctamente en la base de conocimiento.",
      });
      // Reset form
      setTimeout(() => {
        removeFile();
        setUploadProgress(0);
        setIsUploading(false);
      }, 1000);
    } catch (error) {
      sileo.error({
        title: "Error",
        description:
          "Ocurrió un problema al subir el archivo. Intenta de nuevo.",
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-6 md:space-y-10 bg-transparent min-h-[calc(100vh-4rem)] relative">
      {/* Header */}
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-linear-to-br from-gray-900 via-gray-800 to-gray-500 bg-clip-text text-transparent flex items-center gap-3">
            <Brain className="w-8 h-8 md:w-10 md:h-10 text-orange-500" />
            Base de Conocimiento
          </h1>
          <p className="text-[10px] md:text-sm text-gray-500 mt-2 font-bold uppercase tracking-wider opacity-60">
            Algoritmos Inteligentes (RAG)
          </p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl md:rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden"
        >
          {/* Header Card */}
          <div className="bg-[linear-gradient(to_bottom_right,var(--color-orange-50),var(--color-white))] p-6 md:p-8 border-b border-gray-100 flex items-start gap-4">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-inner">
              <UploadCloud className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Entrenamiento IA
              </h2>
              <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium leading-relaxed">
                Sube documentos para nutrir la base de conocimiento del
                asistente virtual. El sistema procesará automáticamente el texto
                para responder consultas futuras.
              </p>
            </div>
          </div>
          <div className="p-6 md:p-8 space-y-8">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isUploading}
                  placeholder="Ej: normas, politicas, faq"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-semibold disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                  Namespace
                </label>
                <input
                  type="text"
                  value={namespace}
                  onChange={(e) => setNamespace(e.target.value)}
                  disabled={isUploading}
                  placeholder="Ej: fincas"
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500/50 transition-all font-semibold disabled:opacity-50"
                />
              </div>
            </div>
            {/* Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest pl-1">
                Documento Fuente
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`
                   relative group border-2 border-dashed rounded-[2rem] p-8 transition-all duration-300 flex flex-col items-center justify-center min-h-[240px] overflow-hidden
                   ${isUploading ? "opacity-50 pointer-events-none" : ""}
                   ${file ? "border-orange-500/30 bg-orange-50/30" : "border-gray-200 hover:border-orange-400 hover:bg-orange-50/10"}
                 `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.txt,.csv"
                />
                <AnimatePresence mode="wait">
                  {!file ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex flex-col items-center text-center space-y-5"
                    >
                      <div className="w-20 h-20 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-orange-500 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 ease-out z-10 relative">
                        <UploadCloud className="w-10 h-10" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-base font-black text-gray-900 tracking-tight">
                          Arrastra y suelta tu archivo aquí
                        </p>
                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                          Soporta PDF, TXT, CSV (Max. 10MB)
                        </p>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-8 py-3 rounded-2xl bg-white border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all shadow-sm active:scale-95 relative z-10"
                        type="button"
                      >
                        Explorar Archivos
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="file"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="w-full flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-orange-100 shadow-md relative z-10"
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-12 h-12 rounded-xl bg-[linear-gradient(to_bottom_right,var(--color-orange-400),var(--color-orange-600))] text-white flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/20">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden flex-1 text-left">
                          <p className="text-sm font-black text-gray-900 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile();
                        }}
                        disabled={isUploading}
                        className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer shrink-0"
                        title="Eliminar archivo"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* Upload Progress Overlay */}
                <AnimatePresence>
                  {isUploading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center z-20 p-8"
                    >
                      <RefreshCw className="w-10 h-10 text-orange-500 animate-spin mb-5" />
                      <p className="text-base font-black text-gray-900 tracking-tight">
                        Procesando y Vectorizando Documento
                      </p>
                      <p className="text-xs text-gray-500 font-bold mt-1 tracking-widest uppercase">
                        Por favor espera...
                      </p>
                      <div className="w-full max-w-sm h-3 bg-gray-100 rounded-full mt-6 overflow-hidden shadow-inner">
                        <motion.div
                          className="h-full bg-[linear-gradient(to_right,var(--color-orange-400),var(--color-orange-600))]"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.4, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {/* Submit */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-black shadow-xl shadow-gray-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin shrink-0" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 shrink-0" />
                    Procesar Archivo
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
        {/* Info Alert */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 flex items-start md:items-center gap-4 p-5 md:p-6 rounded-[2rem] bg-indigo-50/50 border border-indigo-100 shadow-sm"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-black text-gray-900 tracking-tight">
              Procesamiento de Lenguaje Natural (RAG)
            </h4>
            <p className="text-xs font-semibold text-gray-600 mt-1 leading-relaxed max-w-3xl">
              Los documentos cargados se dividen en fragmentos lógicos
              ("chunks") y se transforman en vectores matemáticos de alta
              dimensionalidad. Esto permite que el motor de IA busque contexto
              relevante en tiempo real para generar respuestas precisas y
              naturales.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
