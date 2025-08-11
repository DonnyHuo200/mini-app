import classNames from "classnames";

import { Cross1Icon } from "@radix-ui/react-icons";
import { Dialog } from "@radix-ui/themes";

const DialogWrapper = ({
  open,
  onOpenChange,
  children,
  closeIcon,
  title,
  description,
  className
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: React.ReactNode | null;
  closeIcon?: boolean;
  title?: string;
  description?: React.ReactNode | string;
  className?: string;
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        className={classNames(className, "!max-w-[460px] mx-auto")}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Dialog.Title>
          <span className="text-xl font-MatterSQ-Medium">{title}</span>
        </Dialog.Title>
        <Dialog.Description>
          <span className="text-gray-500 text-sm">{description}</span>
        </Dialog.Description>
        {children}

        {closeIcon && (
          <div
            className="absolute top-6 right-6"
            onClick={() => onOpenChange(false)}
          >
            <Cross1Icon width={16} height={16} />
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DialogWrapper;
