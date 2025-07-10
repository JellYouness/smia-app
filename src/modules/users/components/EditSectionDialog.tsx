import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Any } from '@common/defs/types';

interface EditSectionDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: (data?: Any) => void;
  loading?: boolean;
}

const EditSectionDialog = ({
  open,
  onClose,
  title,
  children,
  onSave,
  loading = false,
}: EditSectionDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit {title}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 1 }}>{children}</Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        {onSave && (
          <Button onClick={() => onSave()} variant="contained" disabled={loading}>
            Save Changes
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditSectionDialog;
