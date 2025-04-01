"use client";

import { useCallback, useMemo, useState } from "react";

import Modal from "../../components/ui/Modal";

export default function useModal() {
  const [modalContent, setModalContent] = useState<{
    content: string;
    title: string;
  } | null>(null);

  const onClose = useCallback(() => {
    setModalContent(null);
  }, []);

  const modal = useMemo(() => {
    if (modalContent === null) {
      return null;
    }
    const { title, content } = modalContent;
    return (
      <Modal onClose={onClose} title={title} open={!!modalContent}>
        {content}
      </Modal>
    );
  }, [modalContent, onClose]);

  const showModal = useCallback(
    (
      title: string,
       
      getContent: (fn: () => void) => string,
    ) => {
      setModalContent({
        content: getContent(onClose),
        title,
      });
    },
    [onClose],
  );

  return [modal, showModal];
}
