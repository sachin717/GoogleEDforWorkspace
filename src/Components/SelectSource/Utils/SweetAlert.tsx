import Swal, { SweetAlertOptions } from "sweetalert2";


 
export const SweetAlerts = (Id?: string,InPanel?:boolean) => {
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
        timer:3000,

        focusCancel: true,
        didOpen: () => {
          if(InPanel){
         
          const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
          if (swalContainer) {
            swalContainer.style.position = 'absolute';
          }else{
            swalContainer.style.position = 'relative';
          }
        
        }
        },
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
        focusCancel: true,
        cancelButtonText: "Cancel",
        denyButtonText: "Continue",
        confirmButtonText:"Confirm",
        didOpen: () => {
          if(InPanel){
         
          const swalContainer = document.querySelector('.swal2-container') as HTMLElement;
          if (swalContainer) {
            swalContainer.style.position = 'absolute';
          }else{
            swalContainer.style.position = 'relative';
          }
        
        }
        },
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
        focusCancel: true,
        cancelButtonText:"Cancel",
        denyButtonText: "Continue",
        confirmButtonText:"Confirm",
        ...props,
      });
    },
   
  };
};