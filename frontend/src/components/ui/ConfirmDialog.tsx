import { Modal, Button } from "@heroui/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "danger",
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="sm">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <div className="flex gap-3 items-center text-red-600">
                <AlertTriangle className="h-6 w-6" />
                <Modal.Heading>{title}</Modal.Heading>
              </div>
            </Modal.Header>
            <Modal.Body className="p-6">
              <p className="text-gray-600">{message}</p>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                {cancelText}
              </Button>
              <Button
                variant={variant === "danger" ? "danger" : "primary"}
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
