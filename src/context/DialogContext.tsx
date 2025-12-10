import { createContext, useContext, useState, ReactNode } from 'react';
import './DialogContext.css';

export type DialogType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface DialogOptions {
  title?: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  showConfirm: (message: string, onConfirm: () => void | Promise<void>, title?: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogOptions & { open: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const showDialog = (options: DialogOptions) => {
    setDialog({ ...options, open: true });
  };

  const closeDialog = () => {
    setDialog(null);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (dialog?.onConfirm) {
      try {
        setLoading(true);
        await dialog.onConfirm();
        closeDialog();
      } catch (error) {
        setLoading(false);
        console.error('Error en confirmación del diálogo:', error);
      }
    } else {
      closeDialog();
    }
  };

  const handleCancel = () => {
    if (dialog?.onCancel) {
      dialog.onCancel();
    }
    closeDialog();
  };

  const showError = (message: string, title: string = 'Error') => {
    showDialog({
      title,
      message,
      type: 'error',
      confirmText: 'Aceptar',
    });
  };

  const showSuccess = (message: string, title: string = 'Éxito') => {
    showDialog({
      title,
      message,
      type: 'success',
      confirmText: 'Aceptar',
    });
  };

  const showWarning = (message: string, title: string = 'Advertencia') => {
    showDialog({
      title,
      message,
      type: 'warning',
      confirmText: 'Aceptar',
    });
  };

  const showInfo = (message: string, title: string = 'Información') => {
    showDialog({
      title,
      message,
      type: 'info',
      confirmText: 'Aceptar',
    });
  };

  const showConfirm = (
    message: string,
    onConfirm: () => void | Promise<void>,
    title: string = 'Confirmar'
  ) => {
    showDialog({
      title,
      message,
      type: 'confirm',
      confirmText: 'Confirmar',
      cancelText: 'Cancelar',
      onConfirm,
    });
  };

  return (
    <DialogContext.Provider
      value={{ showDialog, showError, showSuccess, showWarning, showInfo, showConfirm }}
    >
      {children}
      {dialog?.open && (
        <div className="dialog-overlay" onClick={dialog.type === 'confirm' ? undefined : handleCancel}>
          <div className={`dialog ${dialog.type || 'info'}`} onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-header-content">
                <div className={`dialog-icon ${dialog.type || 'info'}`}>
                  {dialog.type === 'error' && '❌'}
                  {dialog.type === 'success' && '✅'}
                  {dialog.type === 'warning' && '⚠️'}
                  {dialog.type === 'info' && 'ℹ️'}
                  {dialog.type === 'confirm' && '❓'}
                </div>
                <h3 className="dialog-title">{dialog.title || 'Mensaje'}</h3>
              </div>
              {dialog.type !== 'confirm' && (
                <button className="dialog-close" onClick={handleCancel} disabled={loading}>
                  ×
                </button>
              )}
            </div>
            <div className="dialog-body">
              <p className="dialog-message">{dialog.message}</p>
            </div>
            <div className="dialog-footer">
              {dialog.type === 'confirm' && (
                <button
                  className="btn btn-secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {dialog.cancelText || 'Cancelar'}
                </button>
              )}
              <button
                className={`btn ${
                  dialog.type === 'error' 
                    ? 'btn-danger' 
                    : dialog.type === 'confirm' 
                    ? 'btn-primary' 
                    : dialog.type === 'success'
                    ? 'btn-success'
                    : dialog.type === 'warning'
                    ? 'btn-warning'
                    : 'btn-primary'
                }`}
                onClick={handleConfirm}
                disabled={loading}
              >
                {loading ? 'Cargando...' : dialog.confirmText || 'Aceptar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog debe usarse dentro de un DialogProvider');
  }
  return context;
};

