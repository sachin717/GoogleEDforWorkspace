import React, { useState, useRef, useEffect } from 'react';
import { DefaultButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { IPersonaProps, Persona } from '@fluentui/react/lib/Persona';
import { NormalPeoplePicker, IBasePickerSuggestionsProps } from '@fluentui/react/lib/Pickers';
import { employmentTypeDataSample } from '../Charts/SampleData';
import { removeDuplicatesFromObject } from '../Helpers/HelperFunctions';
let data=[];
// Employees data
const employees = [
  {
    DOB: '1979-02-24',
    DOJ: '2018-03-21',
    CF1: 'Customer Support',
    firstName: 'Charlotte',
    lastName: 'Johnson',
    name: 'Charlotte Johnson',
    email: 'charlotte.johnson@example.com',
    id: 'krbstjo05i7wyn76mahqrq',
    job: 'Operations Manager',
    initials: 'CJ',
    department: 'Product',
    workphone: '01724459861',
    mobile: '01724251063',
    manager: 'ethan.d@megazap.us',
    employeeid: '54',
    costcenter: '93',
    buildingid: '128',
    floorname: 'JKL',
    floorsection: 'central area',
    location: '115 JKL',
    address: '789 Pine Road',
    image: 'https://example.com/image6.jpg',
    gender: 'Male',
    employmentType: 'Temporary'
  },
  {
    DOB: '1979-01-24',
    DOJ: '2021-01-06',
    CF1: 'Legal',
    firstName: 'Sophia',
    lastName: 'Johnson',
    name: 'Sophia Johnson',
    email: 'sophia.johnson@example.com',
    id: '59oz9x71c0mjdbioiz2edn',
    job: 'HR Manager',
    initials: 'SJ',
    department: 'Sales',
    workphone: '01724603127',
    mobile: '01724982489',
    manager: 'michael.s@megazap.us',
    employeeid: '14',
    costcenter: '38',
    buildingid: '111',
    floorname: 'STU',
    floorsection: 'north wing',
    location: '115 JKL',
    address: '123 Elm Street',
    image: 'https://example.com/image6.jpg',
    gender: 'Male',
    employmentType: 'Part-Time'
  },
  {
    DOB: '1979-06-19',
    DOJ: '2015-02-10',
    CF1: 'Operations',
    firstName: 'John',
    lastName: 'Moore',
    name: 'John Moore',
    email: 'john.moore@example.com',
    id: 'kslicbstaurlxf0w3unobg',
    job: 'Product Manager',
    initials: 'JM',
    department: 'Operations',
    workphone: '01724943674',
    mobile: '01724447527',
    manager: 'ethan.d@megazap.us',
    employeeid: '62',
    costcenter: '50',
    buildingid: '114',
    floorname: 'JKL',
    floorsection: 'north wing',
    location: '122 DEF',
    address: '123 Elm Street',
    image: 'https://example.com/image1.jpg',
    gender: 'Male',
    employmentType: 'Temporary'
  }
];

const suggestionProps: IBasePickerSuggestionsProps = {
  suggestionsHeaderText: 'Suggested People',
  mostRecentlyUsedHeaderText: 'Suggested Contacts',
  noResultsFoundText: 'No results found',
  loadingText: 'Loading',
  showRemoveButtons: true,
  suggestionsAvailableAlertText: 'People Picker Suggestions available',
  suggestionsContainerAriaLabel: 'Suggested contacts',
};

const checkboxStyles = {
  root: {
    marginTop: 10,
  },
};

const defaultButtonStyles: Partial<IButtonStyles> = { root: { height: 'auto' } };

const CustomPeoplePicker = (props) => {
  const [currentSelectedItems, setCurrentSelectedItems] = useState<any>([]);
  const [currentSelectedItemsBackup, setCurrentSelectedItemsBackup] = useState<any>([]);
  const [delayResults, setDelayResults] = useState(false);
  const [isPickerDisabled, setIsPickerDisabled] = useState(false);
  const [peopleList] = useState<any>(props.user?.map(employee => ({
    text: employee.name,
    secondaryText: employee.job,
    imageUrl: employee.image,
    id: employee.id,
    email: employee.email,
    title: employee.job,
    department: employee.department,
    address: employee.location,
    phone: employee.workphone,
    location:employee.location,
    employmentType:employee.employmentType,
    gender:employee.gender,
    DOJ:employee.DOJ,
    DOB:employee.DOB,
    name:employee.name,

  })));
useEffect(()=>{
if(props.dashboardFeatureAddBtnClick>0){

    setCurrentSelectedItems([]);
}


},[props.dashboardFeatureAddBtnClick])
  const picker = useRef(null);

  const onFilterChanged = (
    filterText: string,
    currentPersonas: IPersonaProps[],
    limitResults?: number,
  ): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (filterText) {
      let filteredPersonas: IPersonaProps[] = filterPersonasByText(filterText);
      filteredPersonas = removeDuplicates(filteredPersonas, currentPersonas);
      filteredPersonas = limitResults ? filteredPersonas.slice(0, limitResults) : filteredPersonas;
      return filterPromise(filteredPersonas);
    } else {
      return [];
    }
  };

  const filterPersonasByText = (filterText: string): IPersonaProps[] => {
    return peopleList.filter(item => doesTextStartWith(item.text as string, filterText));
  };

  const filterPromise = (personasToReturn: IPersonaProps[]): IPersonaProps[] | Promise<IPersonaProps[]> => {
    if (delayResults) {
      return convertResultsToPromise(personasToReturn);
    } else {
      return personasToReturn;
    }
  };

  const onItemsChange = (items:any): void => {
    setCurrentSelectedItems(items);
    setCurrentSelectedItemsBackup(items)
  
    console.log(picker.current.props.selectedItems)


   
    props.onUserSelect((prev)=>[...prev,...items]);

      console.log(items);
      
      
  };

  const controlledItems = [];
  for (let i = 0; i < 5; i++) {
    const item = peopleList[i];
    if (currentSelectedItems!.indexOf(item) === -1) {
      controlledItems.push(peopleList[i]);
    }
  }

  const onDisabledButtonClick = (): void => {
    setIsPickerDisabled(!isPickerDisabled);
  };

  const onToggleDelayResultsChange = (): void => {
    setDelayResults(!delayResults);
  };

  return (
    <div>
      <NormalPeoplePicker
        onResolveSuggestions={onFilterChanged}
        getTextFromItem={getTextFromItem}
        pickerSuggestionsProps={suggestionProps}
        className={'ms-PeoplePicker'}
        key={'controlled'}
        selectionAriaLabel={'Selected contacts'}
        removeButtonAriaLabel={'Remove'}
        selectedItems={currentSelectedItems}
        onChange={onItemsChange}
        inputProps={{
          onBlur: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onBlur called'),
          onFocus: (ev: React.FocusEvent<HTMLInputElement>) => console.log('onFocus called'),
          'aria-label': 'Contacts',
        }}
        componentRef={picker}
        resolveDelay={300}
        disabled={isPickerDisabled}
      />
    </div>
  );
};

function doesTextStartWith(text: string, filterText: string): boolean {
  return text.toLowerCase().indexOf(filterText.toLowerCase()) === 0;
}

function removeDuplicates(personas: IPersonaProps[], possibleDupes: IPersonaProps[]) {
  return personas.filter(persona => !listContainsPersona(persona, possibleDupes));
}

function listContainsPersona(persona: any, personas: any[]) {
  if (!personas || !personas.length || personas.length === 0) {
    return false;
  }
  return personas.some(item => item.text === persona.text);
}

function convertResultsToPromise(results: IPersonaProps[]): Promise<IPersonaProps[]> {
  return new Promise<IPersonaProps[]>((resolve) => setTimeout(() => resolve(results), 2000));
}

function getTextFromItem(persona: any): string {
  return persona.text as string;
}

export default CustomPeoplePicker;
