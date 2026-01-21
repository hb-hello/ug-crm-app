import { Button, Dialog, Portal, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: ReactNode;
    confirmText?: string;
    cancelText?: string;
    confirmColorPalette?: string;
    isLoading?: boolean;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Delete',
    cancelText = 'Cancel',
    confirmColorPalette = 'red',
    isLoading = false,
}: ConfirmationDialogProps) {
    return (
        <Dialog.Root open={isOpen} onOpenChange={(details) => !details.open && onClose()}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>{description}</Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
                                    {cancelText}
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette={confirmColorPalette}
                                size="sm"
                                onClick={onConfirm}
                                loading={isLoading}
                            >
                                {confirmText}
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
