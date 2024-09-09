import { useEffect, useLayoutEffect } from 'react';

interface CustomSweetAlertProps {
    desiredWidth: string;
    saved?: boolean;
    error?: boolean;
    newerror?: boolean;
    saveddelete?: boolean;
    errordelete?: boolean;
}

const useCustomSwalContainerStyle = ({
    desiredWidth,
    saved,
    error,
    newerror,
}: any) => {
    useLayoutEffect(() => {
        let container = document.querySelector('.swal2-container') as HTMLDivElement;
        // console.log('anish', container);
        if (container && (saved || error || newerror)) {
            container.style.position="absolute";
            container.style.top="50%";
            container.style.right="0";
            container.style.transform="translateY(-50%)";
        }
        return () => {
            const container = document.querySelector('.swal2-container') as HTMLDivElement;
            if (container) {
                container.style.position="absolute";
                container.style.top="50%";
                container.style.right="0";
                container.style.transform="translateY(-50%)";
            }
        };
    }, [desiredWidth, saved, error, newerror]);
}

const useCustomSwalContainerStyleSpecialCase = ({ desiredWidth, saveddelete, errordelete }: CustomSweetAlertProps) => {
    useEffect(() => {
        let container = document.querySelector('.swal2-container') as HTMLDivElement;
        console.log('anish', container);
        if (container && (saveddelete || errordelete)) {
            container.style.position="absolute";
            container.style.top="50%";
            container.style.right="0";
            container.style.transform="translateY(-50%)";

        }
        return () => {
            const container = document.querySelector('.swal2-container') as HTMLDivElement;
            if (container) {
                container.style.position="absolute";
                container.style.top="50%";
                container.style.right="0";
                container.style.transform="translateY(-50%)";

            }
        };
    }, [desiredWidth, saveddelete, errordelete]);
}

const useCustomSwalContainerStyleSpecialPositionFixed = ({ desiredWidth, saved, error }: CustomSweetAlertProps) => {
    useEffect(() => {
        let container = document.querySelector('.swal2-container') as HTMLDivElement;
        console.log('anish', container);
        if (container && (saved || error)) {
            container.style.position="fixed";
            container.style.top="50%";
            container.style.right="0";
            container.style.transform="translateY(-50%)";

        }
        return () => {
            const container = document.querySelector('.swal2-container') as HTMLDivElement;
            if (container) {
                container.style.position="fixed";
                container.style.top="50%";
                container.style.right="0";
                container.style.transform="translateY(-50%)";

            }
        };
    }, [desiredWidth, saved, error]);
}

export { useCustomSwalContainerStyle, useCustomSwalContainerStyleSpecialCase, useCustomSwalContainerStyleSpecialPositionFixed };
