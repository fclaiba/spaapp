import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { ServiceCategory, ServiceDefinition } from "../../data/spa";

export type ModalState =
  | { type: "none" }
  | { type: "service"; service: ServiceDefinition; categoryId: string }
  | { type: "category"; category: ServiceCategory };

interface ModalContextValue {
  modal: ModalState;
  openService: (service: ServiceDefinition, categoryId: string) => void;
  openCategory: (category: ServiceCategory) => void;
  close: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalState>({ type: "none" });

  const openService = useCallback(
    (service: ServiceDefinition, categoryId: string) =>
      setModal({ type: "service", service, categoryId }),
    [],
  );

  const openCategory = useCallback(
    (category: ServiceCategory) => setModal({ type: "category", category }),
    [],
  );

  const close = useCallback(() => setModal({ type: "none" }), []);

  return (
    <ModalContext.Provider value={{ modal, openService, openCategory, close }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
