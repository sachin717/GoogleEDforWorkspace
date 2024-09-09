import { position } from "html2canvas/dist/types/css/property-descriptors/position";
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

export const useCustomStyles = (ThemeMode="light") => {
    // console.log("Hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh jai shree ram")
    const customStylesselect = {
        // control: (provided, state) => ({
        //     ...provided,
        //     border: state.isFocused ? ThemeMode == 'light' ? '2px red solid' : '2px red solid' : provided.border,
        //     minHeight: state.isFocused ? '32px !important' : '32px !important',
        //     boxShadow: state.isFocused ? ThemeMode == 'light' ? '0 0 3px var(--lightdarkColor) solid' : '0 0 3px var(--lightdarkBGTable)' : provided.boxShadow,
        //     borderRadius: state.isFocused ? '0px' : '0px',
        //     backgroundColor: ThemeMode== 'dark' ? '#333' : 'white',

        //     ':hover': {
        //         border: state.isFocused ? ThemeMode == 'light' ? '2px var(--lightdarkColor) solid' : '2px var(--lightdarkBG) solid' : provided.border,
        //         minHeight: state.isFocused ? '32px !important' : '32px !important',
        //         borderRadius: state.isFocused ? '0px' : '0px',

        //     }
        // }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: ThemeMode== 'dark' ? '#333' : 'white',
            zIndex:"100000000000000000000000000000000000000000 !important",
            maxHeight:"150px !important",
            
           
        }),
        
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? ThemeMode == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBG)' : ThemeMode== 'dark' ? '#333' : 'white',
            borderRadius: state.isFocused ? '0px' : '0px',
            color: ThemeMode== 'dark' ? '#fff' : state.isSelected ? '#fff' : '#333',

            ':hover': {
                backgroundColor: state.isSelected ? ThemeMode == 'light' ? 'var(--lightdarkColor)' : 'var(--lightdarkBG)' : 'var(--lightdarkBGTable)',
                borderRadius: state.isFocused ? '0px' : '0px',
                color: ThemeMode== 'dark' ? '#fff' : state.isSelected ? '#fff' : '#333',

            }
        }),
        placeholder: (provided) => ({
            ...provided,
            color: ThemeMode=== "dark" ? "#fff" : "#333"
        }),
        singleValue: (provided, state) => ({
            ...provided,
            color: state.isSelected ? 'white' : ThemeMode== 'dark' ? '#fff' : '#333',
            backgroundColor: state.isSelected ? 'var(--lightdarkBG)' : ThemeMode== 'dark' ? '#333' : 'white',
        })
    };
    return customStylesselect;
};

 