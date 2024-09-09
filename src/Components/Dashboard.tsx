import React, { useEffect, useState } from 'react';
import {
  CommandBarButton,
  DatePicker,
  Dropdown,
  Icon,
  TextField,
} from "@fluentui/react";
import LineChart, { ColorArray } from './Charts/LineChart';
import {  averageAgeByDepartmentDataSample, averageAgeByLocationDataSample, averageTenureByDepartmentDataSample, averageTenureByLocationDataSample, employmentTypeDataSample, emptyBarData, emptyDoughnutData, emptyLineData, genderDiversityByDepartmentDataSample,genderDiversityByLocationDataSample, newEmployeesDataSample,  totalEmployeesByDepartmentDataSample } from './Charts/SampleData';
import BarCharts from './Charts/BarChart';
import DonutChart from './Charts/DonutCharts';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { Pivot, PivotItem } from '@fluentui/react/lib/Pivot';
import styles from "./SCSS/Ed.module.scss"
import { Label, Checkbox, PrimaryButton, Toggle, IconButton, Stack, ChoiceGroup, TeachingBubble, DirectionalHint } from '@fluentui/react';
import Alert from './Utils/Alert';
import "./SelectSource/Edp.scss"
import {useSttings} from "./SelectSource/store"
import { useCustomSwalContainerStyle } from './SelectSource/Utils/useCustomSwalContainerStyle';
// import { updateData } from './Utils/ApiCalls/ApiCalls';
import { updateSettingData } from './Helpers/HelperFunctions';
import { useLanguage } from '../Language/LanguageContext';
import CustomPeoplePicker from './Utils/CustomPeoplePicker';
import UserSearchBox from './SelectSource/UserSearchBox';
import Department from './SelectSource/Department';
import { gapi } from 'gapi-script';
import { useFields } from '../context/store';
// import "./SelectSource/Edp.scss"
// Define the container style
const containerStyle: React.CSSProperties = {
  display: 'grid',
  gap: '4px',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gridAutoRows:'70px',
  position: 'relative',
  width: 'calc(100% - 30px)',
  padding: '15px',
  boxSizing: 'border-box',
};

// Define the style for individual items
const itemStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid #ddd',
  backgroundColor:"#0078d4",
  padding: '10px',
  color:"white",

  textAlign: 'center',
};

const iconContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  // justifyContent: 'center',
  // alignItems: 'center',
  color:"rgb(0, 108, 190)",
  cursor:"pointer",
  marginLeft: 'auto', // Ensure it's aligned to the right
  marginRight: '15px',
  marginTop:"15px" // Add space from the grid container
};
const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '30% 30% 30%',
  // gridTemplateColumns: '1rf 1fr 1fr',
  // columnGap: '42px',
  backgroundColor:"#f5f5f5",
  padding:"20px 0px",
  // rowGap:"10px",
  gap: '5px 20px',  // If 'gap' should be something different, adjust accordingly
  placeContent: 'space-evenly',
};


const Dashboard= ({users,settingData,setSettings,setShowHomePage,setShowOrgChart,setshowDashboard}) => {
  const [OpenPanel, setOpenPanel] = useState(false);
  const [addmsg, setAddmsg] = useState(false);
  const [selectedUserPeoplePicker, setSelectedUserPeoplePicker] = useState(null);
  const [teachingBubbleAction, setTeachingBubbleAction] = useState(false);
  const [teachingBubbleUUD, setTeachingBubbleUUD] = useState(false);
  const [isOpenCSV, setIsOpenCSV] = useState(false);
  const [databyMonth, setDatabyMonth] = useState(true);
  const [dept, setDept] = useState(true);
  const [fullTimeCount, setFullTimeCount] = useState(0);
  const [avgTenureHeader, setAvgTenureHeader] = useState(0);
  const [genderDiversityRatioForHeader, setGenderDiversityRatioForHeader] = useState<any>(0);
  const [avgAgeHeader, setAvgAgeHeader] = useState(0);
  const [empType, setEmpType] = useState(true);
  const [avg, setAvg] = useState(true);
  const [agebylocation, setAgebylocation] = useState(true);
  const [avgTenByDept, setAvgTenByDept] = useState(true);
  const [den, setDen] = useState(true);
  const [deptbylocation, setDeptbylocation] = useState(true);
  const [AvgTenByLoc, setAvgTenByLoc] = useState(true);
  const [showSampleData, setShowSampleData] = useState(false);
  const [sampleData, setSampleData] = useState(false);
  const [genDivByDept, setGenDivByDept] = useState(true);
  const [genDivByLoc, setGenDivByLoc] = useState(true);
  const [selectedKeysUserlist, setSelectedKeysUserlist] = useState([]);
  const [loadingAL, setLoadingAL] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [isOpenUpdatePanel, setOpenUpdatePanel] = useState(false);
  const customSwalProps = {
    addmsg,setAddmsg
  };
  useCustomSwalContainerStyle(customSwalProps);
  const {
    languagePartUpdate,
    setLanguagePartUpdate,
    translation,
    setTranslation,
    languages,
    setLanguage,
    getTranslation,
  } = useLanguage();
  const{appSettings,setAppSettings}=useSttings();
  const toggleTeachingBubbleAction = () => setTeachingBubbleAction(!teachingBubbleAction);
  const toggleTeachingBubbleUUD = () => setTeachingBubbleUUD(!teachingBubbleUUD);
  const openPanelCustomPanel = () => setIsOpenCSV(true);
  const dismissPanelCustomPanel = () => setIsOpenCSV(false);
  const openPanelCSV = () => setIsOpenCSV(true);
  const dismissPanelCSV = () => setIsOpenCSV(false);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateOfJoin, setDateOfJoin] = useState(null);
  const [employmentType, setEmploymentType] = useState('');
  const [genderType, setGenderType] = useState('');

  const onTextChangedesign = (e) => setSelectedTitle(e.target.value);
  const onTextChangedept = (e) => setSelectedDept(e.target.value);
  const onTextChangeemail = (e) => setSelectedEmail(e.target.value);
  const onTextChangeofc = (e) => setSelectedLoc(e.target.value);
  const ondobChange = (date) => setDateOfBirth(date);
  const ondojChange = (date) => setDateOfJoin(date);
  const onTextChangeetype = (e, option) => setEmploymentType(option.key);
  const onTextChangegender = (e, option) => setGenderType(option.key);
  const { unFormatedUserData,setUnFormatedUserData } = useFields();
  console.log("unformated",unFormatedUserData);
  function createUpdateObject(selectedDept, genderType, employmentType,DOB) {
    let updateObject :any= {};

  
    if (selectedDept) {
        updateObject.organizations = [{ department: selectedDept }];
    }

    if (genderType || employmentType ||DOB) {
        updateObject.customSchemas = {};
        
        if (genderType) {
            updateObject.customSchemas.OtherFields = { Gender: genderType };
        }
        if (DOB) {
            updateObject.customSchemas.OtherFields = { DOB: DOB };
        }

        if (employmentType) {
            if (!updateObject.customSchemas.OtherFields) {
                updateObject.customSchemas.OtherFields = {};
            }
            updateObject.customSchemas.OtherFields.employmentType = employmentType;
        }
    }

    return updateObject;
}

  const updateRecord = async() => {
    // Handle form submission
    console.log({
      selectedTitle,
      selectedDept,
      selectedEmail,
      selectedLoc,
      dateOfBirth,
      dateOfJoin,
      employmentType,
      genderType
    });
    let user=unFormatedUserData.filter((item)=>{
      return item.primaryEmail==selectedEmail as any;
    })
    var date = new Date(dateOfBirth);
    var year=date.getFullYear();
    var month=date.getMonth()+1; 
    var day=date.getDate();
    //var formatted=month+"/"+day+"/"+year;
    var formattedDOB=year+"-"+month.toString().replace(/(^|\D)(\d)(?!\d)/g, "$10$2")+"-"+day.toString().replace(/(^|\D)(\d)(?!\d)/g, "$10$2");
    let updatedData=createUpdateObject(selectedDept, genderType, employmentType,formattedDOB);
  
    console.log(updatedData,"sadfasfasdfasdfsafasdpfasdfosadpofdpofasdfasdpfsdfoasdpofoasdfoaspof")
  
  console.log("[][][][][][]",updatedData)
    try {
    
      await gapi.client.directory.users.patch({
        userKey: selectedEmail,
        resource: updatedData,
      });
  
     
      console.log("User updated successfully.");

  
    } catch (error) {
     
      console.error("Error updating user:", error);
 
    }
  };
  let employees = [
  
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
    },
    {
      DOB: '1977-07-28',
      DOJ: '2023-06-06',
      CF1: 'Product',
      firstName: 'Liam',
      lastName: 'Smith',
      name: 'Liam Smith',
      email: 'liam.smith@example.com',
      id: 'brgxbnqad3f2mka2x2o63y',
      job: 'Product Manager',
      initials: 'LS',
      department: 'Product',
      workphone: '01724213509',
      mobile: '01724701542',
      manager: 'ethan.d@megazap.us',
      employeeid: '97',
      costcenter: '92',
      buildingid: '123',
      floorname: 'DEF',
      floorsection: 'south area',
      location: '112 ABC',
      address: '123 Elm Street',
      image: 'https://example.com/image8.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1980-09-14',
      DOJ: '2019-04-23',
      CF1: 'Sales',
      firstName: 'James',
      lastName: 'Johnson',
      name: 'James Johnson',
      email: 'james.johnson@example.com',
      id: 'qdc1rteakc9hisjo8lpzm',
      job: 'Operations Manager',
      initials: 'JJ',
      department: 'HR',
      workphone: '01724294501',
      mobile: '01724638156',
      manager: 'john.d@megazap.us',
      employeeid: '77',
      costcenter: '96',
      buildingid: '113',
      floorname: 'JKL',
      floorsection: 'north wing',
      location: '122 DEF',
      address: '456 Oak Avenue',
      image: 'https://example.com/image4.jpg',
      gender: 'Female',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1980-06-05',
      DOJ: '2023-03-22',
      CF1: 'Sales',
      firstName: 'Ethan',
      lastName: 'Lee',
      name: 'Ethan Lee',
      email: 'ethan.lee@example.com',
      id: 'uhjyfmzbyvlgor66uk9jk',
      job: 'Accountant',
      initials: 'EL',
      department: 'Sales',
      workphone: '01724822439',
      mobile: '01724168186',
      manager: 'emma.w@megazap.us',
      employeeid: '90',
      costcenter: '64',
      buildingid: '110',
      floorname: 'DEF',
      floorsection: 'north wing',
      location: '122 DEF',
      address: '202 Birch Lane',
      image: 'https://example.com/image9.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1992-02-28',
      DOJ: '2014-04-01',
      CF1: 'R&D',
      firstName: 'Charlotte',
      lastName: 'Lee',
      name: 'Charlotte Lee',
      email: 'charlotte.lee@example.com',
      id: 'f8wolglptxtb6fzh2borq',
      job: 'Marketing Specialist',
      initials: 'CL',
      department: 'Operations',
      workphone: '01724352971',
      mobile: '01724190791',
      manager: 'emma.w@megazap.us',
      employeeid: '57',
      costcenter: '87',
      buildingid: '125',
      floorname: 'VWX',
      floorsection: 'central area',
      location: '117 PQR',
      address: '789 Pine Road',
      image: 'https://example.com/image1.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1999-07-22',
      DOJ: '2011-01-11',
      CF1: 'Customer Support',
      firstName: 'James',
      lastName: 'Moore',
      name: 'James Moore',
      email: 'james.moore@example.com',
      id: '38mfs880494pctjyikanv',
      job: 'Legal Advisor',
      initials: 'JM',
      department: 'IT',
      workphone: '01724491108',
      mobile: '01724790952',
      manager: 'ethan.d@megazap.us',
      employeeid: '30',
      costcenter: '12',
      buildingid: '120',
      floorname: 'VWX',
      floorsection: 'east wing',
      location: '115 JKL',
      address: '789 Pine Road',
      image: 'https://example.com/image8.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1977-10-25',
      DOJ: '2024-04-26',
      CF1: 'Legal',
      firstName: 'Jane',
      lastName: 'Brown',
      name: 'Jane Brown',
      email: 'jane.brown@example.com',
      id: 'hn3htcarz047mnn60im4md',
      job: 'Marketing Specialist',
      initials: 'JB',
      department: 'Legal',
      workphone: '01724968442',
      mobile: '01724983534',
      manager: 'john.d@megazap.us',
      employeeid: '36',
      costcenter: '40',
      buildingid: '116',
      floorname: 'ABC',
      floorsection: 'east wing',
      location: '122 DEF',
      address: '123 Elm Street',
      image: 'https://example.com/image7.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1974-04-12',
      DOJ: '2013-03-03',
      CF1: 'Legal',
      firstName: 'Jane',
      lastName: 'Moore',
      name: 'Jane Moore',
      email: 'jane.moore@example.com',
      id: 'bkcl3i631ebslh9aq75t0s',
      job: 'Sales Executive',
      initials: 'JM',
      department: 'Marketing',
      workphone: '01724279304',
      mobile: '01724544581',
      manager: 'susan.t@megazap.us',
      employeeid: '31',
      costcenter: '49',
      buildingid: '126',
      floorname: 'MNO',
      floorsection: 'west area',
      location: '122 DEF',
      address: '404 Willow Street',
      image: 'https://example.com/image3.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1982-07-31',
      DOJ: '2012-02-10',
      CF1: 'Customer Support',
      firstName: 'Lucas',
      lastName: 'Martinez',
      name: 'Lucas Martinez',
      email: 'lucas.martinez@example.com',
      id: '2s79oe0l8mfu201a0gtq9d',
      job: 'Legal Advisor',
      initials: 'LM',
      department: 'Engineering',
      workphone: '01724445916',
      mobile: '01724297012',
      manager: 'ethan.d@megazap.us',
      employeeid: '34',
      costcenter: '20',
      buildingid: '112',
      floorname: 'MNO',
      floorsection: 'south area',
      location: '112 ABC',
      address: '123 Elm Street',
      image: 'https://example.com/image1.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1972-09-07',
      DOJ: '2019-12-09',
      CF1: 'Product',
      firstName: 'Jane',
      lastName: 'Brown',
      name: 'Jane Brown',
      email: 'jane.brown@example.com',
      id: 'r9kps80g7ygcuw210dbjh',
      job: 'Customer Support Specialist',
      initials: 'JB',
      department: 'IT',
      workphone: '01724574400',
      mobile: '01724379995',
      manager: 'susan.t@megazap.us',
      employeeid: '41',
      costcenter: '68',
      buildingid: '113',
      floorname: 'VWX',
      floorsection: 'south area',
      location: '112 ABC',
      address: '101 Maple Street',
      image: 'https://example.com/image2.jpg',
      gender: 'Male',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1976-12-15',
      DOJ: '2024-04-22',
      CF1: 'HR',
      firstName: 'Sophia',
      lastName: 'Lee',
      name: 'Sophia Lee',
      email: 'sophia.lee@example.com',
      id: '2lc6b1zty7n4gd35zikx7l',
      job: 'Accountant',
      initials: 'SL',
      department: 'Marketing',
      workphone: '01724267973',
      mobile: '01724332499',
      manager: 'olivia.b@megazap.us',
      employeeid: '32',
      costcenter: '17',
      buildingid: '111',
      floorname: 'DEF',
      floorsection: 'west area',
      location: '115 JKL',
      address: '123 Elm Street',
      image: 'https://example.com/image2.jpg',
      gender: 'Female',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1988-03-09',
      DOJ: '2014-04-24',
      CF1: 'Marketing',
      firstName: 'Olivia',
      lastName: 'Williams',
      name: 'Olivia Williams',
      email: 'olivia.williams@example.com',
      id: '8dw6jlm7iuxq0rk5t5xg',
      job: 'Marketing Specialist',
      initials: 'OW',
      department: 'Legal',
      workphone: '01724276346',
      mobile: '01724928852',
      manager: 'olivia.b@megazap.us',
      employeeid: '29',
      costcenter: '93',
      buildingid: '117',
      floorname: 'ABC',
      floorsection: 'central area',
      location: '112 ABC',
      address: '456 Oak Avenue',
      image: 'https://example.com/image7.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1996-01-25',
      DOJ: '2022-01-07',
      CF1: 'HR',
      firstName: 'Charlotte',
      lastName: 'Moore',
      name: 'Charlotte Moore',
      email: 'charlotte.moore@example.com',
      id: 'vutxilgujqjvsc0bqsea',
      job: 'Operations Manager',
      initials: 'CM',
      department: 'HR',
      workphone: '01724524251',
      mobile: '01724321254',
      manager: 'emma.w@megazap.us',
      employeeid: '22',
      costcenter: '14',
      buildingid: '119',
      floorname: 'ABC',
      floorsection: 'north wing',
      location: '117 PQR',
      address: '101 Maple Street',
      image: 'https://example.com/image6.jpg',
      gender: 'Female',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1971-08-07',
      DOJ: '2011-08-05',
      CF1: 'Sales',
      firstName: 'Olivia',
      lastName: 'Brown',
      name: 'Olivia Brown',
      email: 'olivia.brown@example.com',
      id: 'fpjfyoj6ui5c2xnup46h14',
      job: 'Marketing Specialist',
      initials: 'OB',
      department: 'Marketing',
      workphone: '01724140329',
      mobile: '01724714983',
      manager: 'susan.t@megazap.us',
      employeeid: '64',
      costcenter: '88',
      buildingid: '111',
      floorname: 'GHI',
      floorsection: 'east wing',
      location: '112 ABC',
      address: '404 Willow Street',
      image: 'https://example.com/image10.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1980-09-10',
      DOJ: '2022-07-16',
      CF1: 'Engineering',
      firstName: 'Michael',
      lastName: 'Smith',
      name: 'Michael Smith',
      email: 'michael.smith@example.com',
      id: '914s5grboyae4x7c5ycgfs',
      job: 'Accountant',
      initials: 'MS',
      department: 'R&D',
      workphone: '01724203662',
      mobile: '01724540738',
      manager: 'james.j@megazap.us',
      employeeid: '32',
      costcenter: '83',
      buildingid: '113',
      floorname: 'GHI',
      floorsection: 'west area',
      location: '121 ABC',
      address: '123 Elm Street',
      image: 'https://example.com/image4.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1991-10-05',
      DOJ: '2015-02-04',
      CF1: 'Operations',
      firstName: 'Emma',
      lastName: 'Garcia',
      name: 'Emma Garcia',
      email: 'emma.garcia@example.com',
      id: 'qffwmnx7gobdgoprp75nu5',
      job: 'HR Manager',
      initials: 'EG',
      department: 'Engineering',
      workphone: '01724197171',
      mobile: '01724166639',
      manager: 'susan.t@megazap.us',
      employeeid: '18',
      costcenter: '86',
      buildingid: '126',
      floorname: 'JKL',
      floorsection: 'south area',
      location: '114 GHI',
      address: '101 Maple Street',
      image: 'https://example.com/image7.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1995-01-31',
      DOJ: '2014-10-28',
      CF1: 'Sales',
      firstName: 'Michael',
      lastName: 'Smith',
      name: 'Michael Smith',
      email: 'michael.smith@example.com',
      id: 'h7jzhk6nh3rt63i3lyvhld',
      job: 'Accountant',
      initials: 'MS',
      department: 'Finance',
      workphone: '01724846900',
      mobile: '01724208597',
      manager: 'michael.s@megazap.us',
      employeeid: '31',
      costcenter: '15',
      buildingid: '115',
      floorname: 'MNO',
      floorsection: 'central area',
      location: '120 YZ',
      address: '303 Cedar Avenue',
      image: 'https://example.com/image11.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1982-02-01',
      DOJ: '2011-08-15',
      CF1: 'Sales',
      firstName: 'Jane',
      lastName: 'Lee',
      name: 'Jane Lee',
      email: 'jane.lee@example.com',
      id: 'ftd9ukgzwpoqsmqimz3rfq',
      job: 'Product Manager',
      initials: 'JL',
      department: 'Customer Support',
      workphone: '01724373806',
      mobile: '01724287878',
      manager: 'john.d@megazap.us',
      employeeid: '87',
      costcenter: '13',
      buildingid: '118',
      floorname: 'GHI',
      floorsection: 'north wing',
      location: '112 ABC',
      address: '202 Birch Lane',
      image: 'https://example.com/image4.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1998-06-01',
      DOJ: '2014-03-12',
      CF1: 'Finance',
      firstName: 'Ethan',
      lastName: 'Garcia',
      name: 'Ethan Garcia',
      email: 'ethan.garcia@example.com',
      id: '7jjnrq0o8fjyq0n1v7kho',
      job: 'Marketing Specialist',
      initials: 'EG',
      department: 'Sales',
      workphone: '01724424648',
      mobile: '01724734898',
      manager: 'emma.w@megazap.us',
      employeeid: '32',
      costcenter: '21',
      buildingid: '121',
      floorname: 'VWX',
      floorsection: 'north wing',
      location: '121 ABC',
      address: '606 Redwood Boulevard',
      image: 'https://example.com/image8.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1970-08-20',
      DOJ: '2019-01-08',
      CF1: 'Engineering',
      firstName: 'Olivia',
      lastName: 'Smith',
      name: 'Olivia Smith',
      email: 'olivia.smith@example.com',
      id: 'i2rhsgqpkbsepszjth14b',
      job: 'Research Analyst',
      initials: 'OS',
      department: 'HR',
      workphone: '01724188676',
      mobile: '01724577346',
      manager: 'emma.w@megazap.us',
      employeeid: '37',
      costcenter: '30',
      buildingid: '122',
      floorname: 'JKL',
      floorsection: 'east wing',
      location: '112 ABC',
      address: '505 Spruce Drive',
      image: 'https://example.com/image5.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1978-10-16',
      DOJ: '2014-12-29',
      CF1: 'Legal',
      firstName: 'John',
      lastName: 'Johnson',
      name: 'John Johnson',
      email: 'john.johnson@example.com',
      id: 'bpmmpxow8wdga4onbmmu6u',
      job: 'Research Analyst',
      initials: 'JJ',
      department: 'IT',
      workphone: '01724402356',
      mobile: '01724990642',
      manager: 'james.j@megazap.us',
      employeeid: '16',
      costcenter: '92',
      buildingid: '127',
      floorname: 'MNO',
      floorsection: 'east wing',
      location: '117 PQR',
      address: '101 Maple Street',
      image: 'https://example.com/image3.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1991-04-19',
      DOJ: '2013-11-06',
      CF1: 'Legal',
      firstName: 'Mia',
      lastName: 'Miller',
      name: 'Mia Miller',
      email: 'mia.miller@example.com',
      id: 'ok4k1yu7zvo18yesnecxl',
      job: 'Engineer',
      initials: 'MM',
      department: 'Legal',
      workphone: '01724240333',
      mobile: '01724350160',
      manager: 'susan.t@megazap.us',
      employeeid: '41',
      costcenter: '55',
      buildingid: '111',
      floorname: 'DEF',
      floorsection: 'east wing',
      location: '114 GHI',
      address: '808 Ash Avenue',
      image: 'https://example.com/image11.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1981-08-07',
      DOJ: '2010-12-04',
      CF1: 'R&D',
      firstName: 'Lucas',
      lastName: 'Davis',
      name: 'Lucas Davis',
      email: 'lucas.davis@example.com',
      id: 'htnt9dtedrdjw89ibc5hu',
      job: 'Operations Manager',
      initials: 'LD',
      department: 'Customer Support',
      workphone: '01724973044',
      mobile: '01724316312',
      manager: 'james.j@megazap.us',
      employeeid: '64',
      costcenter: '66',
      buildingid: '122',
      floorname: 'GHI',
      floorsection: 'south area',
      location: '122 DEF',
      address: '101 Maple Street',
      image: 'https://example.com/image10.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1983-10-17',
      DOJ: '2012-01-23',
      CF1: 'Sales',
      firstName: 'Charlotte',
      lastName: 'Lee',
      name: 'Charlotte Lee',
      email: 'charlotte.lee@example.com',
      id: '3sa3m5fent96w2msl882qi',
      job: 'Product Manager',
      initials: 'CL',
      department: 'R&D',
      workphone: '01724768575',
      mobile: '01724883416',
      manager: 'james.j@megazap.us',
      employeeid: '49',
      costcenter: '89',
      buildingid: '117',
      floorname: 'DEF',
      floorsection: 'west area',
      location: '120 YZ',
      address: '789 Pine Road',
      image: 'https://example.com/image11.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '2000-05-27',
      DOJ: '2017-09-04',
      CF1: 'Customer Support',
      firstName: 'Lucas',
      lastName: 'Brown',
      name: 'Lucas Brown',
      email: 'lucas.brown@example.com',
      id: '49hlj9v8s8rs7bdwdu2r4',
      job: 'Customer Support Specialist',
      initials: 'LB',
      department: 'Sales',
      workphone: '01724737663',
      mobile: '01724418446',
      manager: 'ethan.d@megazap.us',
      employeeid: '90',
      costcenter: '96',
      buildingid: '124',
      floorname: 'JKL',
      floorsection: 'east wing',
      location: '117 PQR',
      address: '505 Spruce Drive',
      image: 'https://example.com/image1.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1978-06-28',
      DOJ: '2013-06-18',
      CF1: 'Legal',
      firstName: 'Emma',
      lastName: 'Brown',
      name: 'Emma Brown',
      email: 'emma.brown@example.com',
      id: 'tilhebobzaa03t32yhxucgc',
      job: 'Research Analyst',
      initials: 'EB',
      department: 'Legal',
      workphone: '01724168866',
      mobile: '01724684313',
      manager: 'olivia.b@megazap.us',
      employeeid: '62',
      costcenter: '64',
      buildingid: '128',
      floorname: 'STU',
      floorsection: 'west area',
      location: '114 GHI',
      address: '505 Spruce Drive',
      image: 'https://example.com/image8.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1982-05-13',
      DOJ: '2019-12-01',
      CF1: 'IT',
      firstName: 'John',
      lastName: 'Miller',
      name: 'John Miller',
      email: 'john.miller@example.com',
      id: 'ti8fmka37ggir7q7pdba7',
      job: 'Operations Manager',
      initials: 'JM',
      department: 'R&D',
      workphone: '01724111632',
      mobile: '01724639201',
      manager: 'olivia.b@megazap.us',
      employeeid: '75',
      costcenter: '73',
      buildingid: '121',
      floorname: 'JKL',
      floorsection: 'west area',
      location: '114 GHI',
      address: '456 Oak Avenue',
      image: 'https://example.com/image10.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1993-05-22',
      DOJ: '2012-05-04',
      CF1: 'Marketing',
      firstName: 'Jane',
      lastName: 'Garcia',
      name: 'Jane Garcia',
      email: 'jane.garcia@example.com',
      id: '2c6rz92i0rd63g1i9i48m5',
      job: 'IT Support Specialist',
      initials: 'JG',
      department: 'R&D',
      workphone: '01724372099',
      mobile: '01724690274',
      manager: 'james.j@megazap.us',
      employeeid: '70',
      costcenter: '50',
      buildingid: '117',
      floorname: 'VWX',
      floorsection: 'central area',
      location: '122 DEF',
      address: '789 Pine Road',
      image: 'https://example.com/image4.jpg',
      gender: 'Female',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1970-06-23',
      DOJ: '2016-09-27',
      CF1: 'IT',
      firstName: 'John',
      lastName: 'Smith',
      name: 'John Smith',
      email: 'john.smith@example.com',
      id: 'gmogzz9a5nqcbjcyisn8',
      job: 'Sales Executive',
      initials: 'JS',
      department: 'Engineering',
      workphone: '01724981229',
      mobile: '01724281703',
      manager: 'ethan.d@megazap.us',
      employeeid: '77',
      costcenter: '40',
      buildingid: '128',
      floorname: 'ABC',
      floorsection: 'east wing',
      location: '115 JKL',
      address: '789 Pine Road',
      image: 'https://example.com/image10.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1986-04-09',
      DOJ: '2019-02-27',
      CF1: 'Finance',
      firstName: 'Olivia',
      lastName: 'Garcia',
      name: 'Olivia Garcia',
      email: 'olivia.garcia@example.com',
      id: 'ekbbxeiy4psdrez9djan',
      job: 'Research Analyst',
      initials: 'OG',
      department: 'Operations',
      workphone: '01724576928',
      mobile: '01724666635',
      manager: 'michael.s@megazap.us',
      employeeid: '32',
      costcenter: '13',
      buildingid: '123',
      floorname: 'GHI',
      floorsection: 'west area',
      location: '114 GHI',
      address: '808 Ash Avenue',
      image: 'https://example.com/image6.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1999-08-23',
      DOJ: '2024-04-16',
      CF1: 'Legal',
      firstName: 'Sophia',
      lastName: 'Lee',
      name: 'Sophia Lee',
      email: 'sophia.lee@example.com',
      id: '5yevw4mo3tfw4o857zmhd',
      job: 'Product Manager',
      initials: 'SL',
      department: 'HR',
      workphone: '01724401951',
      mobile: '01724965651',
      manager: 'james.j@megazap.us',
      employeeid: '94',
      costcenter: '26',
      buildingid: '112',
      floorname: 'YZ',
      floorsection: 'west area',
      location: '121 ABC',
      address: '202 Birch Lane',
      image: 'https://example.com/image7.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1990-10-14',
      DOJ: '2021-05-01',
      CF1: 'R&D',
      firstName: 'Emma',
      lastName: 'Moore',
      name: 'Emma Moore',
      email: 'emma.moore@example.com',
      id: '64h3715r0bsrskr6wqi3pa',
      job: 'Engineer',
      initials: 'EM',
      department: 'Operations',
      workphone: '01724923107',
      mobile: '01724400823',
      manager: 'john.d@megazap.us',
      employeeid: '66',
      costcenter: '63',
      buildingid: '111',
      floorname: 'PQR',
      floorsection: 'south area',
      location: '114 GHI',
      address: '456 Oak Avenue',
      image: 'https://example.com/image7.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1977-02-04',
      DOJ: '2011-08-30',
      CF1: 'Legal',
      firstName: 'Lucas',
      lastName: 'Garcia',
      name: 'Lucas Garcia',
      email: 'lucas.garcia@example.com',
      id: '0fw4otzcre29xhol22h25x',
      job: 'Sales Executive',
      initials: 'LG',
      department: 'Product',
      workphone: '01724892144',
      mobile: '01724575669',
      manager: 'emma.w@megazap.us',
      employeeid: '53',
      costcenter: '97',
      buildingid: '117',
      floorname: 'VWX',
      floorsection: 'south area',
      location: '122 DEF',
      address: '707 Fir Street',
      image: 'https://example.com/image1.jpg',
      gender: 'Female',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1987-07-15',
      DOJ: '2017-01-05',
      CF1: 'Legal',
      firstName: 'Olivia',
      lastName: 'Brown',
      name: 'Olivia Brown',
      email: 'olivia.brown@example.com',
      id: '6zzelp1i5stiigca83sji',
      job: 'HR Manager',
      initials: 'OB',
      department: 'Sales',
      workphone: '01724196126',
      mobile: '01724361594',
      manager: 'ethan.d@megazap.us',
      employeeid: '10',
      costcenter: '86',
      buildingid: '116',
      floorname: 'ABC',
      floorsection: 'west area',
      location: '114 GHI',
      address: '505 Spruce Drive',
      image: 'https://example.com/image10.jpg',
      gender: 'Female',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1996-08-08',
      DOJ: '2016-05-01',
      CF1: 'Legal',
      firstName: 'Ava',
      lastName: 'Miller',
      name: 'Ava Miller',
      email: 'ava.miller@example.com',
      id: '4ewilt62v854xt3yj36kut',
      job: 'Marketing Specialist',
      initials: 'AM',
      department: 'Engineering',
      workphone: '01724341491',
      mobile: '01724488450',
      manager: 'emma.w@megazap.us',
      employeeid: '47',
      costcenter: '60',
      buildingid: '111',
      floorname: 'JKL',
      floorsection: 'south area',
      location: '120 YZ',
      address: '808 Ash Avenue',
      image: 'https://example.com/image2.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1999-03-28',
      DOJ: '2022-12-07',
      CF1: 'IT',
      firstName: 'Ava',
      lastName: 'Lee',
      name: 'Ava Lee',
      email: 'ava.lee@example.com',
      id: '96c3anpvvz4qrk6lpbm66',
      job: 'HR Manager',
      initials: 'AL',
      department: 'Finance',
      workphone: '01724813734',
      mobile: '01724760883',
      manager: 'john.d@megazap.us',
      employeeid: '31',
      costcenter: '32',
      buildingid: '116',
      floorname: 'ABC',
      floorsection: 'south area',
      location: '117 PQR',
      address: '456 Oak Avenue',
      image: 'https://example.com/image5.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1990-06-20',
      DOJ: '2014-01-01',
      CF1: 'Legal',
      firstName: 'Sophia',
      lastName: 'Moore',
      name: 'Sophia Moore',
      email: 'sophia.moore@example.com',
      id: '9nby29uzx3pxs9937o015',
      job: 'Customer Support Specialist',
      initials: 'SM',
      department: 'Sales',
      workphone: '01724778894',
      mobile: '01724676194',
      manager: 'ethan.d@megazap.us',
      employeeid: '55',
      costcenter: '11',
      buildingid: '117',
      floorname: 'ABC',
      floorsection: 'central area',
      location: '121 ABC',
      address: '404 Willow Street',
      image: 'https://example.com/image3.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1984-08-04',
      DOJ: '2020-03-16',
      CF1: 'HR',
      firstName: 'Michael',
      lastName: 'Williams',
      name: 'Michael Williams',
      email: 'michael.williams@example.com',
      id: 'fwzyfl2678fz90vmahmpi',
      job: 'Legal Advisor',
      initials: 'MW',
      department: 'Marketing',
      workphone: '01724681024',
      mobile: '01724148363',
      manager: 'john.d@megazap.us',
      employeeid: '76',
      costcenter: '58',
      buildingid: '122',
      floorname: 'VWX',
      floorsection: 'central area',
      location: '117 PQR',
      address: '808 Ash Avenue',
      image: 'https://example.com/image8.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1984-11-11',
      DOJ: '2010-10-21',
      CF1: 'HR',
      firstName: 'Michael',
      lastName: 'Lee',
      name: 'Michael Lee',
      email: 'michael.lee@example.com',
      id: 'xpll8adpuov7zyoxnsg9',
      job: 'Legal Advisor',
      initials: 'ML',
      department: 'Product',
      workphone: '01724776708',
      mobile: '01724137275',
      manager: 'ethan.d@megazap.us',
      employeeid: '26',
      costcenter: '99',
      buildingid: '111',
      floorname: 'YZ',
      floorsection: 'south area',
      location: '114 GHI',
      address: '123 Elm Street',
      image: 'https://example.com/image3.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1990-09-09',
      DOJ: '2012-06-04',
      CF1: 'HR',
      firstName: 'Mia',
      lastName: 'Martinez',
      name: 'Mia Martinez',
      email: 'mia.martinez@example.com',
      id: 'kygsqwrxrareax5jiem7xd',
      job: 'Engineer',
      initials: 'MM',
      department: 'R&D',
      workphone: '01724989441',
      mobile: '01724619791',
      manager: 'olivia.b@megazap.us',
      employeeid: '77',
      costcenter: '96',
      buildingid: '124',
      floorname: 'PQR',
      floorsection: 'central area',
      location: '112 ABC',
      address: '606 Redwood Boulevard',
      image: 'https://example.com/image8.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1999-02-20',
      DOJ: '2020-12-29',
      CF1: 'IT',
      firstName: 'Lucas',
      lastName: 'Brown',
      name: 'Lucas Brown',
      email: 'lucas.brown@example.com',
      id: 'pm1sfenuy7brh5jxnz7hxr',
      job: 'Product Manager',
      initials: 'LB',
      department: 'Engineering',
      workphone: '01724331249',
      mobile: '01724352734',
      manager: 'michael.s@megazap.us',
      employeeid: '42',
      costcenter: '44',
      buildingid: '117',
      floorname: 'YZ',
      floorsection: 'west area',
      location: '117 PQR',
      address: '303 Cedar Avenue',
      image: 'https://example.com/image7.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1994-02-19',
      DOJ: '2023-07-30',
      CF1: 'Product',
      firstName: 'John',
      lastName: 'Brown',
      name: 'John Brown',
      email: 'john.brown@example.com',
      id: '1z7ibh3zmaagslh7febppd',
      job: 'Operations Manager',
      initials: 'JB',
      department: 'HR',
      workphone: '01724276522',
      mobile: '01724534365',
      manager: 'james.j@megazap.us',
      employeeid: '98',
      costcenter: '36',
      buildingid: '129',
      floorname: 'JKL',
      floorsection: 'central area',
      location: '117 PQR',
      address: '808 Ash Avenue',
      image: 'https://example.com/image2.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1993-03-29',
      DOJ: '2022-03-10',
      CF1: 'Customer Support',
      firstName: 'Charlotte',
      lastName: 'Miller',
      name: 'Charlotte Miller',
      email: 'charlotte.miller@example.com',
      id: 'ideo66uvaybx3xjv2h6yt',
      job: 'IT Support Specialist',
      initials: 'CM',
      department: 'HR',
      workphone: '01724505215',
      mobile: '01724353974',
      manager: 'olivia.b@megazap.us',
      employeeid: '39',
      costcenter: '60',
      buildingid: '121',
      floorname: 'PQR',
      floorsection: 'east wing',
      location: '114 GHI',
      address: '404 Willow Street',
      image: 'https://example.com/image9.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    },
    {
      DOB: '1971-03-30',
      DOJ: '2017-06-28',
      CF1: 'HR',
      firstName: 'Charlotte',
      lastName: 'Lee',
      name: 'Charlotte Lee',
      email: 'charlotte.lee@example.com',
      id: 'zp4cvb70qdr76rngggt3wc',
      job: 'Marketing Specialist',
      initials: 'CL',
      department: 'Legal',
      workphone: '01724886318',
      mobile: '01724548479',
      manager: 'john.d@megazap.us',
      employeeid: '56',
      costcenter: '40',
      buildingid: '119',
      floorname: 'MNO',
      floorsection: 'east wing',
      location: '121 ABC',
      address: '404 Willow Street',
      image: 'https://example.com/image2.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1988-02-26',
      DOJ: '2019-06-29',
      CF1: 'Finance',
      firstName: 'Charlotte',
      lastName: 'Smith',
      name: 'Charlotte Smith',
      email: 'charlotte.smith@example.com',
      id: '5lp8l67xqa46fkui9hvly',
      job: 'Operations Manager',
      initials: 'CS',
      department: 'Customer Support',
      workphone: '01724956601',
      mobile: '01724653719',
      manager: 'john.d@megazap.us',
      employeeid: '38',
      costcenter: '78',
      buildingid: '123',
      floorname: 'DEF',
      floorsection: 'east wing',
      location: '115 JKL',
      address: '456 Oak Avenue',
      image: 'https://example.com/image6.jpg',
      gender: 'Male',
      employmentType: 'Part-Time'
    },
    {
      DOB: '1981-08-12',
      DOJ: '2015-03-07',
      CF1: 'Sales',
      firstName: 'Mia',
      lastName: 'Williams',
      name: 'Mia Williams',
      email: 'mia.williams@example.com',
      id: '04i7xedtcp6fhk0c3qyunew',
      job: 'Operations Manager',
      initials: 'MW',
      department: 'Finance',
      workphone: '01724917545',
      mobile: '01724434747',
      manager: 'olivia.b@megazap.us',
      employeeid: '79',
      costcenter: '28',
      buildingid: '125',
      floorname: 'YZ',
      floorsection: 'central area',
      location: '121 ABC',
      address: '303 Cedar Avenue',
      image: 'https://example.com/image7.jpg',
      gender: 'Male',
      employmentType: 'Full-Time'
    },
    {
      DOB: '1983-08-03',
      DOJ: '2021-05-24',
      CF1: 'Engineering',
      firstName: 'Olivia',
      lastName: 'Martinez',
      name: 'Olivia Martinez',
      email: 'olivia.martinez@example.com',
      id: 'mqtyym2peaoedb35fqbnr',
      job: 'Research Analyst',
      initials: 'OM',
      department: 'Legal',
      workphone: '01724541486',
      mobile: '01724885631',
      manager: 'michael.s@megazap.us',
      employeeid: '53',
      costcenter: '81',
      buildingid: '112',
      floorname: 'PQR',
      floorsection: 'south area',
      location: '117 PQR',
      address: '123 Elm Street',
      image: 'https://example.com/image11.jpg',
      gender: 'Male',
      employmentType: 'Temporary'
    },
    {
      DOB: '1986-12-31',
      DOJ: '2016-12-14',
      CF1: 'IT',
      firstName: 'Mia',
      lastName: 'Davis',
      name: 'Mia Davis',
      email: 'mia.davis@example.com',
      id: '6ndvp6smwu5jipnxi3lm8',
      job: 'HR Manager',
      initials: 'MD',
      department: 'Product',
      workphone: '01724625599',
      mobile: '01724233322',
      manager: 'james.j@megazap.us',
      employeeid: '83',
      costcenter: '81',
      buildingid: '110',
      floorname: 'GHI',
      floorsection: 'north wing',
      location: '112 ABC',
      address: '789 Pine Road',
      image: 'https://example.com/image5.jpg',
      gender: 'Female',
      employmentType: 'Temporary'
    }
  ]
  console.log(users);

const [totalEmpDeptData, setTotalEmpDeptData] = React.useState<any>({
  labels: [],

  datasets: [
    {
      label: "Development, Sales,Marketing",
      data: [1, 3, 2],
      borderWidth: 1,
    },
  ],
});
const [genderDiversityData, setGenderDiversityData] = React.useState({
  labels: [],
  datasets: [
      {
          label: 'Male',
          data: [],
          backgroundColor: "#FF64B8",
          borderColor: "#FF64B8",
          borderWidth: 1,
      },
      {
          label: 'Female',
          data: [],
          backgroundColor: "#17AEFF",
          borderColor: "#17AEFF",
          borderWidth: 1,
      },
     
  ],
});
const [genderDiversityByDept, setGenderDiversityByDept] = React.useState({
  labels: [],
  datasets: [
      {
          label: 'Male',
          data: [],
          backgroundColor: ColorArray,
          borderColor: ColorArray,
          borderWidth: 1,
      },
      {
          label: 'Female',
          data: [],
          backgroundColor: ColorArray,
          borderColor: ColorArray,
          borderWidth: 1,
      },
     
  ],
});
const [employmentTypeData, setEmploymentTypeData] = useState({
  labels: [],
  datasets: [
    {
      label: 'Employee type',
      data: [],
      backgroundColor:ColorArray, // Example color
      borderColor: ColorArray,
      borderWidth: 1,
    },
  ],
});
const [avgAgeByLoc, setAvgAgeByLoc] = useState({
  labels: [],
  datasets: [
    {
      label: 'Avarage Age By Location',
      data: [],
      borderColor: "#0078d4",
      backgroundColor: "#0078d440",
      borderWidth: 1,
    },
  ],
});
const [avgAgeByDpt, setAvgAgeByDpt] = useState({
  labels: [],
  datasets: [
    {
      label: 'Avarage Age By Depatment',
      data: [],
      backgroundColor:ColorArray, 
      borderColor: ColorArray,
      borderWidth: 1,
      fill:true,
    },
  ],
});
const [newEmpByMonth, setNewEmpByMonth] = useState({
  labels: [],
  datasets: [
    {
      label: 'New employee by month',
      data: [],
      backgroundColor:ColorArray, 
      borderColor: ColorArray,
      borderWidth: 1,
      fill:true,
    },
  ],
});
const [tenureData, setTenureData] = useState({
  labels: [],
  datasets: []
});

const [tenureByDept, setTenureByDept] = useState({
  labels: [],
  datasets: []
});




// calculation functions for charts

const aggregateEmployeesByDepartment = (employees) => {
  const departmentCounts = employees.reduce((acc, employee) => {
      if (employee.department) {
          acc[employee.department] = (acc[employee.department] || 0) + 1;
      }
      return acc;
  }, {});

  return departmentCounts;
};
const formatChartData = (departmentCounts) => {
  return {
      labels: Object.keys(departmentCounts),
      datasets: [
          {
              label: "Number of Employees by Department",
              data: Object.values(departmentCounts),
              backgroundColor:ColorArray,
              borderColor: ColorArray,
              borderWidth: 1,
            
          },
      ],
  };
};
const aggregateGenderByLocation = (employees) => {
  const locationGenderCounts = {};
  
  // Initialize counts
  employees.forEach(employee => {
    const { location, gender } = employee;

    if (!locationGenderCounts[location]) {
      locationGenderCounts[location] = { Male: 0, Female: 0, Total: 0 };
    }

    // Increment the count based on gender
    if (gender === 'Male') {
      locationGenderCounts[location].Male += 1;
    } else if (gender === 'Female') {
      locationGenderCounts[location].Female += 1;
    }

    // Increment the total count
    locationGenderCounts[location].Total += 1;
  });

  return locationGenderCounts;
};

const formatGenderChartData = (locationGenderCounts) => {
  const locations = Object.keys(locationGenderCounts);
  
 
  const malePercentages = locations.map(location => {
    const { Male, Total } = locationGenderCounts[location];
    return Total ? ((Male / Total) * 100).toFixed(0) : 0;
  });
  
  const femalePercentages = locations.map(location => {
    const { Female, Total } = locationGenderCounts[location];
    return Total ? ((Female / Total) * 100).toFixed(0) : 0;
  });

  return {
    labels: locations,
    datasets: [
      {
        label: 'Male (%)',
        data: malePercentages,
        backgroundColor: "#FF64B8",
        borderColor: "#FF64B8",
        borderWidth: 1,
      },
      {
        label: 'Female (%)',
        data: femalePercentages,
        backgroundColor: "#17AEFF",
        borderColor: "#17AEFF",
        borderWidth: 1,
      }
    ],
  };
};

const calculateGenderDiversityByDept = (employees) => {
  const departmentGenderCounts = {};

  // Count genders by department
  employees.forEach(employee => {
    const { department, gender } = employee;

    if (!departmentGenderCounts[department]) {
      departmentGenderCounts[department] = { Male: null, Female: null };
    }

    if (gender === 'Male') {
      departmentGenderCounts[department].Male++;
    } else if (gender === 'Female') {
      departmentGenderCounts[department].Female++;
    }
  });

  // Calculate percentages and prepare data for chart
  const labels = [];
  const maleData = [];
  const femaleData = [];

  Object.keys(departmentGenderCounts).forEach(department => {
    const { Male, Female } = departmentGenderCounts[department];
    const total = Male + Female;

    const malePercentage = (Male / total * 100).toFixed(0);
    const femalePercentage = (Female / total * 100).toFixed(0);

    labels.push(department);
    maleData.push(malePercentage);
    femaleData.push(femalePercentage);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Male (%)',
        data: maleData,
        backgroundColor: "#FF64B8",
        borderColor: "#FF64B8",
        borderWidth: 1,
      },
      {
        label: 'Female (%)',
        data: femaleData,
        backgroundColor:"#17AEFF",
        borderColor: "#17AEFF",
        borderWidth: 1,
      },
    ],
  };
};
const calculateEmploymentTypeCounts = (employees) => {
  const employmentTypeCounts = {};
  let fullTimeCount=0;
  // Count employment types
  employees.forEach(employee => {
    const { employmentType } = employee;

    if (!employmentTypeCounts[employmentType]) {
      employmentTypeCounts[employmentType] = 0;
    }
    if(employmentType=="Full-Time"){
      fullTimeCount++
    }
    employmentTypeCounts[employmentType]++;
  });
setFullTimeCount(fullTimeCount);

  // Prepare data for chart
  const labels = [];
  const data = [];

  Object.keys(employmentTypeCounts).forEach(type => {
    labels.push(type);
    data.push(employmentTypeCounts[type]);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Number of Employees',
        data,
        backgroundColor: ColorArray,
        borderColor: ColorArray,
        borderWidth: 1,
      },
    ],
  };
};

const calculateAverageAgeByLocation = (employees) => {
  const locationAgeMap = {};

  
  employees.forEach(employee => {
    const { location, DOB } = employee;
    const age = calculateAge(DOB);

    if (!locationAgeMap[location]) {
      locationAgeMap[location] = { totalAge: 0, count: 0 };
    }

    locationAgeMap[location].totalAge += age;
    locationAgeMap[location].count++;
  });

  // Prepare data for chart
  const labels = [];
  const data = [];

  Object.keys(locationAgeMap).forEach(location => {
    const { totalAge, count } = locationAgeMap[location];
    const averageAge = totalAge / count;

    labels.push(location);
    data.push(averageAge.toFixed(0));
  });

  return {
    labels,
    datasets: [
      {
        label: 'Average Age (Yrs)',
        data,
        borderColor: "#0078d4",
        backgroundColor: "#0078d440",
        borderWidth: 1,
        fill:true,
      },
    ],
  };
};


const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateAverageAgeByDepartment = (employees) => {
  const departmentAgeMap = {};

  // Calculate total age and count of employees for each department
  employees.forEach(employee => {
    const { department, DOB } = employee;
    const age = calculateAge(DOB);

    if (!departmentAgeMap[department]) {
      departmentAgeMap[department] = { totalAge: 0, count: 0 };
    }

    departmentAgeMap[department].totalAge += age;
    departmentAgeMap[department].count++;
  });

  // Prepare data for chart
  const labels = [];
  const data = [];

  Object.keys(departmentAgeMap).forEach(department => {
    const { totalAge, count } = departmentAgeMap[department];
    const averageAge = totalAge / count;

    labels.push(department);
    data.push(averageAge.toFixed(0));
  });

  return {
    labels,
    datasets: [
      {
        label: 'Average Age (Yrs)',
        data,
        borderColor: "#0078d4",
        backgroundColor: "#0078d440",
        borderWidth: 1,
        fill:true,
      },
    ],
  };
};
const calculateNewEmployeesByMonth = (employees) => {
  const monthCountMap = {};

  
  employees.forEach(employee => {
    const { DOJ } = employee;
    const monthYear = formatMonthYear(new Date(DOJ));

    if (!monthCountMap[monthYear]) {
      monthCountMap[monthYear] = 0;
    }

    monthCountMap[monthYear]++;
  });

  
  const labels = [];
  const data = [];

  
  const sortedMonthKeys = Object.keys(monthCountMap).sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });

  sortedMonthKeys.forEach(monthYear => {
    labels.push(formatMonthLabel(new Date(monthYear)));
    data.push(monthCountMap[monthYear]);
  });

  return {
    labels,
    datasets: [
      {
        label: 'Number of New Employees',
        data,
        borderColor: "#0078d4",
        backgroundColor: "#0078d440",
        borderWidth: 1,
        fill:true,
      },
    ],
  };
};


const formatMonthYear = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JS
  return `${year}-${month}`;
};


const formatMonthLabel = (date) => {
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
};

const calculateAverageTenureByLocation = (employees) => {
  const locationTenureMap = {};
  const locationCountMap = {};

  // Calculate tenure and accumulate by location
  employees.forEach(employee => {
    const { DOJ, location } = employee;
    const tenure = calculateTenure(new Date(DOJ));

    if (!locationTenureMap[location]) {
      locationTenureMap[location] = 0;
      locationCountMap[location] = 0;
    }

    locationTenureMap[location] += tenure;
    locationCountMap[location]++;
  });

  // Prepare data for chart
  const labels = [];
  const data = [];

  Object.keys(locationTenureMap).forEach(location => {
    labels.push(location);
    data.push((locationTenureMap[location] / locationCountMap[location]).toFixed(0));
  });
 
  return {
    labels,
    datasets: [
      {
        label: 'Average Tenure (Years)',
        data,
        backgroundColor: ColorArray, // Example color
        borderColor: ColorArray,
        borderWidth: 1,
      },
    ],
  };
};


const calculateTenure = (dojDate) => {
  const today = new Date();
  let years = today.getFullYear() - dojDate.getFullYear();
  const monthDiff = today.getMonth() - dojDate.getMonth();

  // Adjust tenure if the current month is before the DOJ month
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dojDate.getDate())) {
    years--;
  }

  return years;
};
const calculateAverageTenureByDepartment = (employees) => {
  const departmentTenureMap = {};
  const departmentCountMap = {};

  // Calculate tenure and accumulate by department
  employees.forEach(employee => {
    const { DOJ, department } = employee;
    const tenure = calculateTenure(new Date(DOJ));

    if (!departmentTenureMap[department]) {
      departmentTenureMap[department] = 0;
      departmentCountMap[department] = 0;
    }

    departmentTenureMap[department] += tenure;
    departmentCountMap[department]++;
  });

  // Prepare data for chart
  const labels = [];
  const data = [];

  Object.keys(departmentTenureMap).forEach(department => {
    labels.push(department);
    data.push((departmentTenureMap[department] / departmentCountMap[department]).toFixed(0));
  });

  return {
    labels,
    datasets: [
      {
        label: 'Average Tenure (Years)',
        data,
        backgroundColor: ColorArray,
        borderColor: ColorArray,
        borderWidth: 1,
      },
    ],
  };
};

// ------------------------------


//------------- Header Calculation functions

function calculateGenderDiversityRatio(employees) {
  const genderCount = employees.reduce((acc, employee) => {
      const gender = employee.gender;
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
  }, {});

  const totalEmployees = employees.length;
  const maleRatio = (genderCount['Male'] || 0) / totalEmployees;
  const femaleRatio = (genderCount['Female'] || 0) / totalEmployees;

  return {
      maleRatio,
      femaleRatio
  };
}

function calculateAverageAge(employees) {
  const currentDate = new Date();

  const totalAge = employees.reduce((acc, employee) => {
      const dob = new Date(employee.DOB);
      const age = currentDate.getFullYear() - dob.getFullYear() - (currentDate.getMonth() < dob.getMonth() || (currentDate.getMonth() === dob.getMonth() && currentDate.getDate() < dob.getDate()) ? 1 : 0);
      return acc + age;
  }, 0);

  return totalAge / employees.length;
}


function calculateAverageEmployeeTenure(employees) {
  const currentDate = new Date();

  const totalTenure = employees.reduce((acc, employee) => {
      const doj = new Date(employee.DOJ);
      const tenure = currentDate.getFullYear() - doj.getFullYear() - (currentDate.getMonth() < doj.getMonth() || (currentDate.getMonth() === doj.getMonth() && currentDate.getDate() < doj.getDate()) ? 1 : 0);
      return acc + tenure;
  }, 0);

  return totalTenure / employees.length;
}


//-----------------------


useEffect(() => {
  const departmentEmployeeCounts = aggregateEmployeesByDepartment(employees);
  const departmentChartData = formatChartData(departmentEmployeeCounts);
  setTotalEmpDeptData(departmentChartData);

  const genderDistributionByLocation = aggregateGenderByLocation(employees);
  const genderDiversityChartData = formatGenderChartData(genderDistributionByLocation);
  setGenderDiversityData(genderDiversityChartData as any);

  const genderDiversityByDepartment:any = calculateGenderDiversityByDept(employees);
  console.log("Gender Diversity by Department:", genderDiversityByDepartment);
  setGenderDiversityByDept(genderDiversityByDepartment);

  const employmentTypeDistribution:any = calculateEmploymentTypeCounts(employees);
  setEmploymentTypeData(employmentTypeDistribution);

  const averageAgeByLocation:any = calculateAverageAgeByLocation(employees);
  setAvgAgeByLoc(averageAgeByLocation);

  const averageAgeByDepartment:any = calculateAverageAgeByDepartment(employees);
  setAvgAgeByDpt(averageAgeByDepartment);

  const newEmployeesByMonth:any = calculateNewEmployeesByMonth(employees);
  setNewEmpByMonth(newEmployeesByMonth as any);

  const averageTenureByLocation = calculateAverageTenureByLocation(employees);
  setTenureData(averageTenureByLocation as any);

  const averageTenureByDepartment = calculateAverageTenureByDepartment(employees);
  setTenureByDept(averageTenureByDepartment as any);

}, []);

function handleUpdateDetail(){
  setOpenUpdatePanel(true);
}

  // useEffect(()=>{
  //   const departmentCounts = aggregateEmployeesByDepartment(employees);

  //   // Format the chart data
  //   const formattedData = formatChartData(departmentCounts);

  //   // Set the formatted data in state
  //   setTotalEmpDeptData(formattedData);

  //   const locationGenderCounts = aggregateGenderByLocation(employees);

  //       // Format the chart data
  //       const formattedData1 = formatGenderChartData(locationGenderCounts);

  //       // Set the formatted data in state
  //       setGenderDiversityData(formattedData1 as any);

       
  //         const updatedData:any = calculateGenderDiversityByDept(employees);
  //         console.log("d",updateData)
  //         setGenderDiversityByDept(updatedData);
  //         const EmploymentTypeCounts = calculateEmploymentTypeCounts(employees);
  //     setEmploymentTypeData(EmploymentTypeCounts);
  //     let a:any=calculateAverageAgeByLocation(employees);
  //     setAvgAgeByLoc(a);
  //     let avgAgeByDept:any=calculateAverageAgeByDepartment(employees);
  //     setAvgAgeByDpt(avgAgeByDept);
  //     let newEmpByMonths:any=calculateNewEmployeesByMonth(employees);
  //     setNewEmpByMonth(newEmpByMonths);
  //     setTenureData(calculateAverageTenureByLocation(employees)as any)
  //     setTenureByDept(calculateAverageTenureByDepartment(employees)as any)
        
  // },[])
 
  useEffect(()=>{
   
    setDatabyMonth(appSettings?.dashboardSettings?.newEmpByMonth);
    setDept(appSettings?.dashboardSettings?.totalEmpBYDept);
    setEmpType(appSettings?.dashboardSettings?.empType);
    setAvg(appSettings?.dashboardSettings?.avgAgeByDept);
    setAvgTenByLoc(appSettings?.dashboardSettings?.avgAgeByLoc);
    setAvgTenByDept(appSettings?.dashboardSettings?.avgTenByDept);
    setAvgTenByDept(appSettings?.dashboardSettings?.avgTenByDept);
    setAvgTenByLoc(appSettings?.dashboardSettings?.avgTenByLoc);
    let genderDiversityRatioForHeader:any=calculateGenderDiversityRatio(employees);
    setGenderDiversityRatioForHeader(genderDiversityRatioForHeader);
    let avgAgeHeader:any=calculateAverageAge(employees);
    setAvgAgeHeader(avgAgeHeader);
    let avgTenure:any=calculateAverageEmployeeTenure(employees);
    setAvgTenureHeader(avgTenure);

  },[])
  function transformUserDataToFomat(users) {
    return users.map(user => ({
      id: user.id,
      image: user.image,
      initials: user.initials,
      name: user.name,
      job: user.job,
      email: user.email,
      department:user.department,
      dob:user.DOB,
      doj:user.DOJ,
      location:user.location,

    }));
  }
  const saveallview = () => { 
    let temp={...settingData,dashboardSettings:{newEmpByMonth:databyMonth,totalEmpBYDept:dept,empType:empType,avgAgeByDept:avg,avgAgeByLoc:agebylocation,avgTenByDept:avgTenByDept,avgTenByLoc:AvgTenByLoc,genDivByDept:genDivByDept,genDivByLoc:genDivByLoc}};
    updateSettingData(temp);
    setAppSettings(temp);
    setAddmsg(true);
    setTimeout(()=>{
     setAddmsg(false);
    },3000)
   };

  const OnmonthChnage = () => setDatabyMonth(!databyMonth);
  const ondeptChnage = () => setDept(!dept);
  const onEmpTypeChnage = () => setEmpType(!empType);
  const _onchangeGenderDevDept = () => setGenDivByDept(!genDivByDept);
  const _onchangeGenderDevLoc = () => setGenDivByLoc(!genDivByLoc);
  const Avg = () => setAvg(!avg);
  const Agebylocation = () => setAgebylocation(!agebylocation);
  const AvgTenureByDept = () => setAvgTenByDept(!avgTenByDept);
  const ondenChnage = () => setDen(!den);
  const Deptbylocation = () => setDeptbylocation(!deptbylocation);
  const AvgTenureByLoc = () => setAvgTenByLoc(!AvgTenByLoc);
  const samplDataOnchange = () => setShowSampleData(!showSampleData);
  const _onchangeSampleData = () => setSampleData(!sampleData);
 function handleHomeButton(){
  setSettings(false);
  setShowHomePage(true);
  setShowOrgChart(false);
  setshowDashboard(false);
 }

  const checkboxStyle = { root: { marginTop: '0px' } };
  const options = [{ key: 'option1', text: 'Option 1' }, { key: 'option2', text: 'Option 2' }]; 
  const defaultKey = 'option1'; 

  const handleSelect = async (item) => {
    console.log('Selected item:', item);
  
  
    setSelectedDept(item.department);
    setSelectedLoc(item.location);
    setSelectedEmail(item.email);
    setSelectedTitle(item.job);
  
   
   
  };
  
  return (
    <>
    <div className='' style={{ width: '100%', display: 'flex', alignItems: 'flex-start' }}>
      <div style={containerStyle}>
        <div className='chartHeaders' style={itemStyle}>
          <p>{sampleData?"161":employees.length}</p>
          <p>{translation.Head?translation.Headcount:"countHead Count"}</p>
        </div>
        <div className='chartHeaders' style={itemStyle}>
          <p>{sampleData?"150" : fullTimeCount}</p>
          <p>{translation?.FullTime?translation?.FullTime:"Full Time"}</p>
        </div>
        <div className='chartHeaders' style={itemStyle}>
          <p>{sampleData ?"63.5%":`${genderDiversityRatioForHeader.maleRatio}/${genderDiversityRatioForHeader.femaleRatio}`}</p>
          <p>{translation?.GenderDivRatio?translation?.GenderDivRatio:"Gender Diversity Ratio"}</p>
        </div>
        <div className='chartHeaders' style={itemStyle}>
          <p>{sampleData?"33.5":avgAgeHeader}</p>
          <p>{translation.AvgAgeYrs?translation.AvgAgeYrs:"Average Age (Yrs)"}</p>
        </div>
        <div className='chartHeaders' style={itemStyle}>
          <p>{sampleData?"3.5":avgTenureHeader}</p>
          <p>{translation.AvgEmpTen?translation.AvgEmpTen:"Avg Employee Tenure (Yrs)"}</p>
        </div>
      </div>
      <div style={iconContainerStyle}>
        <Icon iconName="Home" style={{ fontSize: '17px', marginBottom: '10px' }} onClick={handleHomeButton} />
        <Icon iconName="Refresh" style={{ fontSize: '17px', marginBottom: '10px' }} />
        <Icon iconName="Settings" style={{ fontSize: '17px' }} onClick={()=>setOpenPanel(true)} />
      </div>
    </div>
    { sampleData ?
    <div style={gridStyle}>
      <LineChart data={newEmployeesDataSample} heading={translation.NumEmpMonth?translation.NumEmpMonth:"Number of New Employees by Month"} />
      <BarCharts data={totalEmployeesByDepartmentDataSample} heading={translation.NumEmpDept?translation.NumEmpDept:'Number of Total Employees by Department'} />
      <DonutChart data={employmentTypeDataSample} heading={translation.NumEmpType?translation.NumEmpType:'Number of Employment Type'} />
      <LineChart data={averageAgeByDepartmentDataSample} heading={translation.AvgAgeDept?translation.AvgAgeDept:'Average Age(Yrs) by Department'} />
      <LineChart data={averageAgeByLocationDataSample} heading={translation.AvgAgeLoc?translation.AvgAgeLoc:'Average Age(Yrs) by Location'}/>
      <DonutChart data={averageTenureByDepartmentDataSample} heading={translation.AvgTenByDept?translation.AvgTenByDept:"Average Tenure(Yrs) by Department"} />
      <BarCharts data={genderDiversityByDepartmentDataSample} heading={translation.GenDivDept?translation.GenDivDept:'Gender Diversity by Department'} />
      <BarCharts data={genderDiversityByLocationDataSample} heading={translation.GenDivLoc?translation.GenDivLoc:'Gender Diversity by Location'} />
      <DonutChart data={averageTenureByLocationDataSample} heading={translation.AvgTenByLoc?translation.AvgTenByLoc:'Average Tenure(Yrs) by Location'} />
    </div>:
      <div style={gridStyle}>
        {databyMonth && <LineChart data={newEmpByMonth} heading={translation.NumEmpMonth?translation.NumEmpMonth:'Number of New Employees by Month'} />}
        {dept && <BarCharts data={totalEmpDeptData} heading={translation.NumEmpDept?translation.NumEmpDept:'Number of Total Employees by Department'}/>}
        {empType && <DonutChart data={employmentTypeData}  heading={translation.NumEmpType?translation.NumEmpType:'Number of Employment Type'}  />}
        {avg && <LineChart data={avgAgeByDpt} heading={translation.AvgAgeDept?translation.AvgAgeDept:'Average Age(Yrs) by Department'} />}
        {agebylocation &&<LineChart data={avgAgeByLoc} heading={translation.AvgAgeLoc?translation.AvgAgeLoc:'Average Age(Yrs) by Location'}/>}
        {avgTenByDept && <DonutChart data={tenureByDept} heading={translation.AvgTenByDept?translation.AvgTenByDept:"Average Tenure(Yrs) by Department"}/>}
        {genDivByDept && <BarCharts data={genderDiversityByDept} heading={translation.GenDivDept?translation.GenDivDept:'Gender Diversity by Department'}/>}
        {genDivByLoc && <BarCharts data={genderDiversityData} heading={translation.GenDivLoc?translation.GenDivLoc:'Gender Diversity by Location'} />}
        {AvgTenByLoc &&<DonutChart data={tenureData} heading={translation.AvgTenByLoc?translation.AvgTenByLoc:'Average Tenure(Yrs) by Location'}/>}
      </div>
    //        <div style={gridStyle}>
    //       {databyMonth && <LineChart data={newEmployeesData} heading='Number of New Employees by Month' />}
    //       { dept && <BarCharts data={totalEmpDeptData} heading='Number of Total Employees by Department' />}
    //        {empType && <DonutChart data={employmentTypeData} heading='Number of Employment Type' />}
    //        {avg && <LineChart data={averageAgeByDepartmentData} heading='Average Age(Yrs) by Department' />}
    //        {agebylocation &&<LineChart data={averageAgeByLocationData} heading='Average Age(Yrs) by Location'/>}
    //       {avgTenByDept && <DonutChart data={averageTenureByDepartmentData} heading='Average Tenure(Yrs) by Department
    //  ' />}
    //       {genDivByDept && <BarCharts data={genderDiversityByDepartmentData} heading='Gender Diversity by Department' />}
    //        {genDivByLoc && <BarCharts data={genderDiversityData} heading='Gender Diversity by Location' />}
    //       {AvgTenByLoc &&<DonutChart data={averageTenureByDepartmentData} heading='Average Tenure(Yrs) by Location
    //  ' />}
    //      </div>
} 
    <Panel
      type={PanelType.custom}
      customWidth="500px"
      headerText="Dashboard Setting"
      isOpen={OpenPanel}
      onDismiss={() => setOpenPanel(false)}
      closeButtonAriaLabel="Close"
    >
      <div className="ms-Grid">
        {addmsg && (
          <Alert
            type={"success"}
            title="Skip"
            text="Settings saved successfully"
            isBehindVisible={false}
            isConfirmBtn={false}
            id={"#DashBoardSettings"}
            countdown={2000}
            popupCustomClass={"general-settings"}
          />
        )}
        <Pivot id="DashBoardSettings">
          <PivotItem headerText="General">
            <div className={  "A"}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <Label style={{ fontSize: "13px" }}>
                    <b>{translation.SelectChartDisplay?translation.SelectChartDisplay:"Select the charts to display"}</b>
                  </Label>
                </div>
                <div style={{ marginTop: "-5px", display: "flex", alignItems: "center" }}>
                  <Label style={{ fontSize: "13px" }}>
                    <b>{translation.Action?translation.Action:"Action"}</b>
                  </Label>
                  <IconButton
                    id="iconWithActiveTooltip"
                    style={{ height: "22px", marginLeft: "0px" }}
                    title="Selecting the checkbox will make charts visible."
                    onClick={toggleTeachingBubbleAction}
                    iconProps={{ iconName: "Info" }}
                  />
                  {teachingBubbleAction && (
                    <TeachingBubble
                      calloutProps={{ directionalHint: DirectionalHint.bottomCenter }}
                      target="#iconWithActiveTooltip"
                      isWide={true}
                      hasCloseButton={true}
                      closeButtonAriaLabel="Close"
                      onDismiss={toggleTeachingBubbleAction}
                      headline=""
                    >
                     {translation.actiontooltip?translation.actiontooltip:" Selecting the checkbox will make charts visible."}
                    </TeachingBubble>
                  )}
                </div>
              </div>
            </div>
            <div>
    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
       {translation.NumberOfNewEmployeesByMonth?translation.NumberOfNewEmployeesByMonth:"Number of New Employees by Month"}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={databyMonth}
            onChange={OnmonthChnage}
          />
        </div>
      </div>
    </div>

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.NumEmpDept?translation.NumEmpDept:'Number of Total Employees by Department'}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={dept}
            onChange={ondeptChnage}
          />
        </div>
      </div>
    </div>

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.NumEmpType?translation.NumEmpType:'Number of Employment Type'}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={empType}
            onChange={onEmpTypeChnage}
          />
        </div>
      </div>
    </div>

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.AvgAgeDept?translation.AvgAgeDept:'Average Age(Yrs) by Department'}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={avg}
            onChange={Avg}
          />
        </div>
      </div>
    </div>

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.AvgAgeLoc?translation.AvgAgeLoc:'Average Age(Yrs) by Location'}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={agebylocation}
            onChange={Agebylocation}
          />
        </div>
      </div>
    </div>

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.AvgTenByDept?translation.AvgTenByDept:"Average Tenure(Yrs) by Department"}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={avgTenByDept}
            onChange={AvgTenureByDept}
          />
        </div>
      </div>
    </div>

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.AvgTenByLoc?translation.AvgTenByLoc:'Average Tenure(Yrs) by Location'}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={AvgTenByLoc}
            onChange={AvgTenureByLoc}
          />
        </div>
      </div>
    </div>

    {/* <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
          Department by Location
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={deptbylocation}
            onChange={Deptbylocation}
          />
        </div>
      </div>
    </div> */}

    {/* <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
          Number of Employees (Sample Data)
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={showSampleData}
            onChange={samplDataOnchange}
          />
        </div>
      </div>
    </div> */}

    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.DisSmplDataDB?translation.DisSmplDataDB:"Display Sample data on Dashboard"}
        </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={sampleData}
            onChange={_onchangeSampleData}
          />
        </div>
      </div>
    </div>
    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.GenDivDept?translation.GenDivDept:'Gender Diversity by Department'} </Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={genDivByDept}
            onChange={_onchangeGenderDevDept}
          />
        </div>
      </div>
    </div>
    <div className={styles.settingBlock}>
      <div className={styles.checkboxRow}>
        <Label className={styles.checkboxLabel}>
        {translation.GenDivLoc?translation.GenDivLoc:'Gender Diversity by Location'}</Label>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            defaultChecked={genDivByLoc}
            onChange={_onchangeGenderDevLoc}
          />
        </div>
      </div>
    </div>
    <div style={{ marginTop: "20px" }}>
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton
              text={translation.save?translation.save:"Save"}
              onClick={saveallview}
              ariaLabel="Save"
            />
          
          </Stack>
        </div>
  </div>
          </PivotItem>

         
          <PivotItem headerText={translation.AdvancedSettings?translation.AdvancedSettings:"Advanced Settings"}>
            {/* <CustomPeoplePicker onUserSelect={setSelectedUserPeoplePicker} setSelectedDept={setSelectedDept} setSelectedLoc={setSelectedLoc}  /> */}
            {
              true? 
               <>
              <div className={styles.editorBlockStyles}>
                <div className={styles.RichEditorBlk}>
                  <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                      <UserSearchBox 
                       options={transformUserDataToFomat(users)}
                       onSelect={handleSelect}
                       placeholder={translation.SearchUser?translation.SearchUser:"Search user"}
                       />
                      </div>
                    </div>
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        <Label>
                          {translation.Title ? translation.Title : "Title"}
                        </Label>
                        <TextField
                          onChange={onTextChangedesign}
                          value={selectedTitle}
                        />
                      </div>
                    </div>
  
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        <Label>
                          {translation.Department
                            ? translation.Department
                            : "Department"}
                        </Label>
                        <TextField
                          onChange={onTextChangedept}
                          value={selectedDept}
                        />
                      </div>
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        <Label>
                          {translation.Email ? translation.Email : "Email"}
                        </Label>
                        <TextField
                          onChange={onTextChangeemail}
                          // value={selectedUserPeoplePicker?.email}
                          value={selectedEmail}
                          readOnly
                        />
                      </div>
                    </div>
  
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        <Label>
                          {translation.Location
                            ? translation.Location
                            : "Location"}
                        </Label>
                        <TextField
                          onChange={onTextChangeofc}
                          value={selectedLoc}
                        />
                      </div>
                    </div>
  
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        <Label>
                          {translation.Dateofbirth
                            ? translation.Dateofbirth
                            : "Date of birth"}
                        </Label>
                        <DatePicker
                          placeholder={
                            translation.Selectdate
                              ? translation.Selectdate
                              : "Select date"
                          }
                          ariaLabel="Select a date"
                          value={dateOfBirth}
                          onSelectDate={ondobChange}
                          // formatDate={
                          //   onFormatDate
                          // }
                         
                        />
                      </div>
                    </div>
                        
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        {/* <div className={styles.tab1}>          */}
                        <Label>
                          {translation.Dateofjoining
                            ? translation.Dateofjoining
                            : "Date of joining"}
                        </Label>
                        <DatePicker
                          placeholder={
                            translation.Selectdate
                              ? translation.Selectdate
                              : "Select date"
                          }
                          ariaLabel="Select a date"
                          value={dateOfJoin}
                          onSelectDate={ondojChange}
                          // formatDate={
                          //   onFormatDate
                          // }
                        />
                      </div>
                    </div>
  
                    <div className="ms-Grid-row">
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        {/* <div className={styles.tab1}> */}
                        <Label>
                          {translation.EmpTypeLabel
                            ? translation.EmpTypeLabel
                            : "Employment Type"}
                        </Label>
                        {/* <TextField onChange={onTextChangeetype}
                          value={selectedetype}
                        /> */}
                        <Dropdown
                          // styles={dropdownstyles}
                          placeholder={
                            translation.Selectanoption
                              ? translation.Selectanoption
                              : "Select an option"
                          }
                          onChange={onTextChangeetype}
                          defaultSelectedKey={employmentType}
                          options={[{key:"fulltime",text:"Full Time"},{key:"parttime",text:"Part Time"}]}
                        
                          // options={dropdownEmploymentType}
                        />
                      </div>
  
                      <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg6">
                        <Label>
                          {translation.Gender
                            ? translation.Gender
                            : "Gender"}
                        </Label>
                        {/* <TextField onChange={onTextChangegender}
                          value={selectedgender}
                        /> */}
                        <Dropdown
                          // styles={dropdownstyles}
                          placeholder={
                            translation.Selectanoption
                              ? translation.Selectanoption
                              : "Select an option"
                          }
                          options={[{key:"male",text:"Male"},{key:"female",text:"Female"}]}
                          onChange={onTextChangegender}
                          defaultSelectedKey={genderType??"male"}
                          
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <PrimaryButton
                style={{margin:"10px"}}
                text={translation.Submit ? translation.Submit : "Submit"}
                onClick={updateRecord}
              />
            </>
            
            :  <div style={{ padding: "10px",display:"flex",justifyContent:"space-between" }}>
              <Label> {translation.UpdtUserDetail
                          ? translation.UpdtUserDetail
                          : "Update user(s) detail"
                      }</Label>
                <PrimaryButton onClick={handleUpdateDetail} text={translation.Update?translation.Update:"Update"} />
          
            </div>
            }
          
            <Panel
                      type={PanelType.custom}
                      customWidth="650px"
                      headerText={
                        translation.UpdtUserDetail
                          ? translation.UpdtUserDetail
                          : "Update user(s) detail"
                      }
                      isOpen={isOpenUpdatePanel}
                      onDismiss={()=>setOpenUpdatePanel(false)}
                      closeButtonAriaLabel={
                        translation.Close ? translation.Close : "Close"
                      }
                    >
                        <>
            <Stack >
              <Stack >
                <Label>
                  {translation.UpdateUserBulk
                    ? translation.UpdateUserBulk
                    : "Update user(s) in bulk"}
                </Label>
              </Stack>
            </Stack>
           
              <PrimaryButton  style={{color:'#333',background:"#fff",borderRadius:"25px",border:"!px solid #000"}}
                 text={
                  translation.sett10
                    ? translation.sett10
                    : "Download sample file"
                }
              // onClick={() => downloadTemplate(data, "user_detail-" + getFormattedTime(), "A")}  
              >
                
                </PrimaryButton>
             
           
            <div style={{display:"flex",justifyContent:"space-between",width:"100%"}} >
              <div style={{display:"flex",flexDirection:"column"}}>
                <label style={{ color: "#333" }}>
                  {translation.ImportFile
                    ? translation.ImportFile
                    : "Import File"}
                </label>
                <input  type="file" />
              </div>
              <div >
                <PrimaryButton
                  text='Save'
                  // text={translation.Save?translation.Save:"Save"}
                  onClick={() => {}}
                >
                  
                </PrimaryButton>
              </div>
            </div>
            <div style={{color:'#333'}}>
              <h3><b>{translation.Instructions?translation.Instructions:"Instructions:-"}</b></h3>
               <ul>
                <li><span>*</span>{translation.sett01 ? translation.sett01 : "Please use (MM-DD-YYYY) format for DOJ and DOB fields in csv file."} </li>
                  <li><span>*</span>{translation.sett12?translation.sett12: "Please fill the details with exact match to avoid conflicts of CSV file."}</li>
                   <li>{translation.sett13?translation.sett13:"Please don't add any commas or any other fields to avoid conflicts with commas of CSV file."}</li>
                    <li><span>*</span>{translation.sett14?translation.sett14:"Please don't change order of the columns or don't add new columns, this may lead into feeding values in incorrect columns."}</li>
            </ul>
            </div>
          </>
                      {/* <DashboardImport langcode={translation} /> */}
                    </Panel>
          </PivotItem>
        </Pivot>

    
      </div>

    
    </Panel>
    </>
  );
};

export default Dashboard;
