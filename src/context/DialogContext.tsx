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
  hideButtons?: boolean;
  autoClose?: number; // Tiempo en ms para cerrar automáticamente
}

interface DialogContextType {
  showDialog: (options: DialogOptions) => void;
  showError: (message: string, title?: string) => void;
  showSuccess: (message: string, title?: string, hideButtons?: boolean, autoClose?: number) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string, hideButtons?: boolean, autoClose?: number) => void;
  showConfirm: (message: string, onConfirm: () => void | Promise<void>, title?: string) => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [dialog, setDialog] = useState<DialogOptions & { open: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const showDialog = (options: DialogOptions) => {
    // Si hay un diálogo abierto, cerrarlo primero y esperar antes de mostrar el nuevo
    if (dialog?.open) {
      closeDialog();
      // Esperar un momento más largo para asegurar que el estado se actualice
      setTimeout(() => {
        setDialog({ ...options, open: true });
        
        // Si tiene autoClose, cerrar automáticamente después del tiempo especificado
        if (options.autoClose) {
          setTimeout(() => {
            closeDialog();
          }, options.autoClose);
        }
      }, 200);
    } else {
      setDialog({ ...options, open: true });
      
      // Si tiene autoClose, cerrar automáticamente después del tiempo especificado
      if (options.autoClose) {
        setTimeout(() => {
          closeDialog();
        }, options.autoClose);
      }
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (dialog?.onConfirm) {
      try {
        setLoading(true);
        // Cerrar el diálogo de confirmación primero
        closeDialog();
        // Esperar un momento para que el estado se actualice
        await new Promise(resolve => setTimeout(resolve, 100));
        // Luego ejecutar el callback
        await dialog.onConfirm();
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

  const showSuccess = (message: string, title: string = 'Éxito', hideButtons: boolean = false, autoClose?: number) => {
    showDialog({
      title,
      message,
      type: 'success',
      confirmText: hideButtons ? undefined : 'Aceptar',
      hideButtons,
      autoClose,
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

  const showInfo = (message: string, title: string = 'Información', hideButtons: boolean = false, autoClose?: number) => {
    showDialog({
      title,
      message,
      type: 'info',
      confirmText: hideButtons ? undefined : 'Aceptar',
      hideButtons,
      autoClose,
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
        <div 
          className="dialog-overlay" 
          onClick={dialog.hideButtons ? undefined : (dialog.type === 'confirm' ? undefined : handleCancel)}
        >
          <div className={`dialog ${dialog.type || 'info'} ${dialog.hideButtons ? 'no-buttons' : ''}`} onClick={(e) => e.stopPropagation()}>
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
              {!dialog.hideButtons && dialog.type !== 'confirm' && (
                <button className="dialog-close" onClick={handleCancel} disabled={loading}>
                  ×
                </button>
              )}
            </div>
            <div className="dialog-body">
              <p className="dialog-message">{dialog.message}</p>
              {dialog.hideButtons && (
                <div className="dialog-loading-spinner">
                  <div className="spinner"></div>
                </div>
              )}
            </div>
            {!dialog.hideButtons && (
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
            )}
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

