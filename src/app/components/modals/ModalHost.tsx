import { ServiceDetailModal } from "./ServiceDetailModal";
import { CategoryServicesModal } from "./CategoryServicesModal";

export function ModalHost() {
  return (
    <>
      <CategoryServicesModal />
      <ServiceDetailModal />
    </>
  );
}
