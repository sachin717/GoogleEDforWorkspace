import Swal, { SweetAlertOptions } from "sweetalert2";
import '../Edp.module.scss'

export const ReusableAlert = (Id?: string) => {

  return {
    SweetAlert(
      type: "success" | "error" | "info", 
      message: string,
      props?: SweetAlertOptions
    ) {
      return Swal.fire({
        icon: type,
        target: Id,
        heightAuto: false,

        showConfirmButton: false,
        text: message,
        width: "330px",
        timer: 300000,
        ...props,
      });
    },
    SweetPrompt(
      type: "question" | "warning",
      message: string,
      props?: SweetAlertOptions
    ) {
      return Swal.fire({
        icon: type,
        target: Id,
        heightAuto: false,
        text: message,
        width: "330px",
        showCancelButton: true,
        cancelButtonText: "Cancel",
        denyButtonText: "Continue",
        confirmButtonText: "Confirm",
        ...props,
      });
    },
    SweetSyncPrompt(
      type: "question" | "warning",
      heading:string,
      message: string,
      props?: SweetAlertOptions
    ) {
      return Swal.fire({
        icon: type,
        target: Id,
        heightAuto: false,
        text: message,
        width: "430px",
        title:heading,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        denyButtonText: "Continue",
        confirmButtonText:"Confirm",
        ...props,
      });
    },
   
  };
};