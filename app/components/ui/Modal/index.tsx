"use client";

import { PropsWithChildren } from "react";
import { Box, Divider, Modal, Typography } from "@mui/material";

export default function ModalWrapper({
  open,
  onClose,
  children,
  title,
}: PropsWithChildren<{ open: boolean; title: string; onClose: () => void }>) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          minWidth: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
        }}
      >
        <Typography
          sx={{ px: 1 }}
          id="modal-modal-title"
          variant="h6"
          component="h2"
        >
          {title}
        </Typography>
        <Divider />
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
    </Modal>
  );
}
