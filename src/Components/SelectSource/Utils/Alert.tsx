import React, { useEffect, useLayoutEffect } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';
/*                              NOTES - ANISH
type: SweetAlertIcon, title: string, text: string, isBehindVisible: boolean, IsConfirmBtn: boolean

    - type -> success, error, warning, info, question
    - title -> success, error, warning, info, question
    - isBehindVisible -> true, false - Background is visible or not
    - IsConfirmBtn -> true, false - Confirm button is visible or not
    - CustomClass -> Custom Class for popup and title - Will Be In Future.
*/

interface CustomSweetAlertProps {
    type: any ;
    title: string;
    text: string;
    isBehindVisible: boolean;
    isConfirmBtn: boolean;
    countdown?: number;
    popupCustomClass?: string;
    id?: string;
    deleteAttachUpdate ? :any;
    showCancelButton ? :boolean;
    cancelButtonText ? : string;
    confirmButtonText ? : string;
}

const Alert: React.FC<CustomSweetAlertProps> = ({
    type,
    title,
    text,
    isBehindVisible,
    isConfirmBtn,
    countdown,
    popupCustomClass,
    id,
    deleteAttachUpdate,
    cancelButtonText,
    showCancelButton,
    confirmButtonText
}) => {
    useLayoutEffect(() => {
        const showSweetAlert = () => {
            const config:any = {
                icon: type,
                text,
                target: id,
                customClass: {
                    popup: popupCustomClass,
                    title: 'sweet-custom-title-class',
                },
                backdrop: isBehindVisible, //  overlay based on condiiton.
                showConfirmButton: isConfirmBtn,
                showCancelButton,
                cancelButtonText,
                confirmButtonText,
                timer: countdown,
                allowOutsideClick: false,
            };

            if (title !== 'Skip' && title !== null && title !== undefined && title !== '') {
                config['title'] = title;
            } else {
                config['title'] = null;
            }

            Swal.fire(config)
            .then((response:any) =>{
                console.log('deleteAttachUpdate', deleteAttachUpdate);
                console.log(response);
                if(response.isConfirmed){
                    deleteAttachUpdate();
                }
            })
        };
        showSweetAlert();
        // Clean up the event - unmounts
        return () => {

        };
    }, [type, title, text, isBehindVisible, isConfirmBtn, countdown, popupCustomClass, id]);

    return null;
};

export default Alert;


/*                              CSS IF NEED OVERFLOW.
 // <------------------------ SWEET ALETER Custom overlay style  ---------------------------->
  .custom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); // opacity
    z-index: 9999; //z-index is higher than the SweetAlert popup
    pointer-events: auto; // prevent interactions
  }

*/