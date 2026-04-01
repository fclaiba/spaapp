import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { ServiceDefinition } from "../../data/spa";

export type ModalState =
  | { type: "none" }
  | { type: "service"; service: ServiceDefinition; categoryId: string };

interface ModalContextValue {
  modal: ModalState;
  openService: (service: ServiceDefinition, categoryId: string) => void;
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

  const close = useCallback(() => setModal({ type: "none" }), []);

  return (
    <ModalContext.Provider value={{ modal, openService, close }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
