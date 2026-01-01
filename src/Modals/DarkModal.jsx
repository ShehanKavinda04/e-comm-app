import { Modal } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";
import Login from "../page/Login/Login";
// import RegisterComponent from "../page/Login/RegisterComponent";
// import Forgatepass1 from "../page/Login/Forgatepass1";
// import Forgatepassword2 from "../page/Login/Forgatepassword2";

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
          <Login onSuccess={handleClose} />
          {/* <RegisterComponent />
          <Forgatepass1 />
          <Forgatepassword2 /> */}


        </div>
      </div>
    </Modal>
  );
};

export default forwardRef(DarkModal);
