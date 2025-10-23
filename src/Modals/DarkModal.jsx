import { Modal } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import Login from "../page/Login/Login";

const DarkModal = (props, ref) => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  useImperativeHandle(ref, () => ({
    handleOpen: () => setOpen(true),
  }));

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex justify-center items-center h-screen">
        <div>
          <Login />
        </div>
      </div>
    </Modal>
  );
};

export default forwardRef(DarkModal);
