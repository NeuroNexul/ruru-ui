"use client";

import React, {
  useState,
  useContext,
  useCallback,
  ReactNode,
  createContext,
  useEffect,
} from "react";
import {
  AnimatePresence,
  ForwardRefComponent,
  HTMLMotionProps,
  motion,
} from "framer-motion";
import { cn } from "@/utils/cn";
import { Button, ButtonProps } from "./button";

/**
 * Represents the props for the Modal component.
 */
export interface ModalContextProps {
  /**
   * The state of the modal.
   *
   * @type {boolean}
   */
  isOpen: boolean;
  /**
   *
   * Open the modal.
   *
   * @returns {void}
   */
  openModal: () => void;
  /**
   *
   * Close the modal.
   *
   * @returns {void}
   */
  closeModal: () => void;
}

/**
 * Represents the props for the Modal component.
 */
export interface ModalProps
  extends Partial<ForwardRefComponent<HTMLDivElement, HTMLMotionProps<"div">>> {
  /**
   * The children of the Modal component.
   */
  children: ReactNode;
  /**
   *
   * The function to call when the user clicks outside the modal.
   *
   * @returns {void}
   */
  onClickOutside?: () => void;
}

/**
 * Represents the props for the Modal component.
 */
export interface ModalActionProps extends ButtonProps {
  /**
   * The children of the Modal component.
   */
  fullWidth?: boolean;
  /**
   * The function to call when the user clicks the action.
   *
   * @returns {void} | {Promise<void>}
   */
  onClick?: () => void | Promise<void>;
}

/**
 * Represents the props for the Modal component.
 */
export interface TriggerProps extends ButtonProps {
  /**
   * The children of the Modal component.
   */
  children: ReactNode;
  /**
   *
   * The function to call when the user clicks the trigger.
   *
   * @returns {void}
   */
  onClick?: () => void;
  /**
   *
   * Render as child component.
   *
   * @default false
   * @type {boolean}
   */
  asChild?: boolean;
}

/**
 * Represents the props for the Modal component.
 */
export interface DivProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {}

/**
 * Represents the props for the Modal component.
 */
export interface PTagProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {}

/**
 * Represents the Modal component.
 *
 * @param {ModalProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 *
 */
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

/**
 * Represents the Modal component.
 *
 * @param {ModalProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 *
 */
export const ModalProvider = ({
  children,
}: {
  children: ReactNode;
}): React.ReactElement => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

/**
 * Represents the Modal component.
 *
 * @returns {ModalContextProps}
 *
 */
export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

/**
 * Represents the Modal component.
 *
 * @param {ModalProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 *
 */
const Modal = ({
  children,
  onClickOutside,
  ...props
}: ModalProps): React.ReactElement => {
  const { isOpen, closeModal } = useModal();

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeModal]);

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: -50,
      rotateX: "0deg",
      transition: { duration: 0.15 },
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: "0deg",
      transition: { duration: 0.15 },
    },
    exit: {
      opacity: 0,
      y: -50,
      rotateX: "-10deg",
      transition: { duration: 0.15 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed w-full h-full bg-[rgba(0,0,0,0.5)] flex justify-center items-center z-[999] left-0 top-0"
          onClick={onClickOutside ? onClickOutside : closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          {...props}
        >
          <motion.div
            className="bg-background border w-full max-w-[500px] shadow-[0_2px_10px_rgba(0,0,0,0.1)] rounded-lg"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * Represents the Modal component.
 *
 * @param {TriggerProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Trigger = ({
  children,
  onClick,
  asChild = false,
}: TriggerProps): React.ReactElement => {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal();
    if (onClick) {
      onClick();
    }
  };

  if (asChild) {
    return (
      <div onClick={handleClick} className="cursor-pointer">
        {children}
      </div>
    );
  }

  return <Button onClick={handleClick}>{children}</Button>;
};

/**
 * Represents the Modal component.
 *
 * @param {DivProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Body = ({ children, ...props }: DivProps): React.ReactElement => (
  <div className="mb-5" {...props}>
    {children}
  </div>
);

/**
 * Represents the Modal component.
 *
 * @param {DivProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Header = ({
  children,
  className,
  ...props
}: DivProps): React.ReactElement => (
  <div className={cn("mb-4 p-3 border-b", className)} {...props}>
    {children}
  </div>
);

/**
 * Represents the Modal component.
 *
 * @param {PTagProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Title = ({
  children,
  className,
  ...props
}: PTagProps): React.ReactElement => (
  <p className={cn("text-2xl", className)} {...props}>
    {children}
  </p>
);

/**
 * Represents the Modal component.
 *
 * @param {DivProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Content = ({
  children,
  className,
  ...props
}: DivProps): React.ReactElement => (
  <div className={cn("p-3", className)} {...props}>
    {children}
  </div>
);

/**
 * Represents the Modal component.
 *
 * @param {DivProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Subtitle = ({
  children,
  className,
  ...props
}: DivProps): React.ReactElement => (
  <p className={cn("text-sm text-muted-foreground mt-2", className)} {...props}>
    {children}
  </p>
);

/**
 * Represents the Modal component.
 *
 * @param {DivProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Actions = ({
  children,
  className,
  ...props
}: DivProps): React.ReactElement => (
  <div
    className={cn(
      "bg-card border-t p-3 flex justify-between gap-2.5 rounded-br-[10px] rounded-bl-[10px] w-full",
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

/**
 * Represents the Modal component.
 *
 * @param {ModalActionProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Action = ({
  fullWidth = false,
  onClick,
  className,
  ...props
}: ModalActionProps): React.ReactElement => {
  const { closeModal } = useModal();

  const handleClick = async () => {
    if (onClick) {
      await onClick();
    }
    closeModal();
  };

  return (
    <Button
      className={cn("text-base", className, fullWidth && "w-full")}
      onClick={handleClick}
      {...props}
    >
      {props.children}
    </Button>
  );
};

/**
 * Represents the Modal component.
 *
 * @param {ModalActionProps} props - The props for the Modal component.
 * @returns {React.ReactElement}
 */
Modal.Close = (props: ModalActionProps): React.ReactElement => (
  <Modal.Action {...props} onClick={useModal().closeModal}>
    {props.children}
  </Modal.Action>
);

export default Modal;
