"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Info } from "lucide-react";

interface BookingQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function BookingQuestionsModal({
  isOpen,
  onClose,
  onConfirm,
}: BookingQuestionsModalProps) {
  const [answers, setAnswers] = useState({
    familyOnly: "",
    events: "",
    pets: "",
  });

  const isFormValid = answers.familyOnly && answers.events && answers.pets;

  const handleConfirm = () => {
    if (isFormValid) {
      onConfirm();
    }
  };

  const questions = [
    {
      id: "familyOnly",
      text: "¿El plan de su visita es exclusivamente para descanso familiar?",
    },
    {
      id: "events",
      text: "¿Tienen pensado traer sonido profesional, bafles grandes o decoración para eventos?",
    },
    {
      id: "pets",
      text: "¿Viajan con alguna mascota?",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl rounded-3xl h-[90%] max-h-[800px]">
        <div className="bg-black p-6 text-white">
          <DialogHeader>
            {/* <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-white" />
            </div> */}
            <DialogTitle className="text-2xl font-black tracking-tight">
              Información Importante
            </DialogTitle>
            <p className="text-white text-sm font-medium mt-1">
              Por favor responde estas breves preguntas antes de continuar con
              tu reserva.
            </p>
          </DialogHeader>
        </div>

        <div className="p-8 space-y-8 bg-white overflow-y-auto">
          {questions.map((q) => (
            <div key={q.id} className="space-y-4">
              <Label className="text-base font-bold text-gray-800 leading-tight block">
                {q.text}
              </Label>
              <RadioGroup
                value={answers[q.id as keyof typeof answers]}
                onValueChange={(val) =>
                  setAnswers((prev) => ({ ...prev, [q.id]: val }))
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors flex-1 cursor-pointer">
                  <RadioGroupItem
                    value="SI"
                    id={`${q.id}-si`}
                    className="text-orange-600"
                  />
                  <Label
                    htmlFor={`${q.id}-si`}
                    className="flex-1 font-bold text-sm cursor-pointer"
                  >
                    SÍ
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors flex-1 cursor-pointer">
                  <RadioGroupItem
                    value="NO"
                    id={`${q.id}-no`}
                    className="text-orange-600"
                  />
                  <Label
                    htmlFor={`${q.id}-no`}
                    className="flex-1 font-bold text-sm cursor-pointer"
                  >
                    NO
                  </Label>
                </div>
              </RadioGroup>
            </div>
          ))}
        </div>

        <DialogFooter className="p-6 bg-gray-50 border-t border-gray-100 mt-0">
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid}
            className="w-full h-12 text-base font-black bg-black hover:bg-black/80 text-white rounded-xl shadow-lg shadow-neutral-500 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            Continuar a la reserva
            <Check className="ml-2 w-5 h-5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
