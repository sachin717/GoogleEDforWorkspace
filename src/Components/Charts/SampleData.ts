const ColorArray = [
  "#57a5ff", "#ff7f2b", "#5a9316", "#ffa126", "#37c42d", "#ff2a2a", "#006600",
  "#FF6600", "#330066", "#0066FF", "#FF33CC", "#9900CC", "#00CC99", "#FFCC00",
  "#00FF66", "#FF00CC", "#6666FF", "#FFFF00", "#CC6600", "#FF6699", "#9933FF",
  "#FF0066", "#33FF99", "#33FFFF", "#CC33FF", "#FFCC99", "#FF33FF", "#66FF33",
];
export const newEmployeesDataSample = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Number of New Employees by Month",
        data: [12, 14, 8, 11, 15, 17, 10, 13, 16, 12, 9, 14],
        borderColor: "#0078d4",
        backgroundColor: "#0078d440",
        fill: true,
        tension: 0.1,
       
        
      },
    ],
  };
  
  export const averageAgeByDepartmentDataSample = {
    labels: ["HR", "Engineering", "Marketing", "Sales", "Customer Support"],
    datasets: [
      {
        label: "Average Age (Yrs)",
        data: [29, 34, 31, 30, 28],
        borderColor: "#0078d4",
        backgroundColor: "#0078d440",
        fill: true,
        tension: 0.1,
      },
    ],
  };
  
  export const averageAgeByLocationDataSample = {
    labels: ["New York", "San Francisco", "Chicago", "Los Angeles", "Seattle"],
    datasets: [
      {
        label: "Average Age (Yrs)",
        data: [31, 29, 33, 30, 32],
        borderColor: "#0078d4",
        backgroundColor: "#0078d440",
        fill: true,
        tension: 0.1,
      },
    ],
  };
  
  export const totalEmployeesByDepartmentDataSample = {
    labels: ["HR", "Engineering", "Marketing", "Sales", "Customer Support"],
    datasets: [
      {
        label: "Total Employees",
        data: [50, 120, 75, 90, 65],
        backgroundColor:ColorArray,
        borderColor: ColorArray,
        borderWidth: 1,
      },
    ],
  };
  
  export const genderDiversityByLocationDataSample = {
    labels: ["New York", "San Francisco", "Chicago", "Los Angeles", "Seattle"],
    datasets: [
      {
        label: "Male (%)",
        data: [60, 65, 55, 62, 58],
        backgroundColor: "#42A5F5",
      },
      {
        label: "Female (%)",
        data: [40, 35, 45, 38, 42],
        backgroundColor: "#FF5722",
      },
    ],
  };
  
  export const genderDiversityByDepartmentDataSample = {
    labels: ["HR", "Engineering", "Marketing", "Sales", "Customer Support"],
    datasets: [
      {
        label: "Male (%)",
        data: [55, 80, 60, 70, 50],
        backgroundColor: ColorArray,
      },
      {
        label: "Female (%)",
        data: [45, 20, 40, 30, 50],
        backgroundColor: ColorArray,
      },
    ],
  };
  
  export const averageTenureByLocationDataSample = {
    labels: ["New York", "San Francisco", "Chicago", "Los Angeles", "Seattle"],
    datasets: [
      {
        label: "Average Tenure (Yrs)",
        data: [5.2, 4.8, 6.1, 5.5, 4.9],
        backgroundColor: ColorArray,
        borderColor: ColorArray,
        borderWidth: 1,
      },
    ],
  };
  
  export const averageTenureByDepartmentDataSample = {
    labels: ["HR", "Engineering", "Marketing", "Sales", "Customer Support"],
    datasets: [
      {
        label: "Average Tenure (Yrs)",
        data: [6.2, 4.9, 5.7, 4.5, 6.0],
        backgroundColor: ColorArray,
        borderColor: ColorArray,
        borderWidth: 1,
      },
    ],
  };
  
  export const employmentTypeDataSample = {
    labels: ["Full-time", "Part-time", "Contract", "Internship"],
    datasets: [
      {
        label: "Employment Type",
        data: [150, 40, 30, 20],
        backgroundColor: ColorArray,
        borderColor:ColorArray,
        borderWidth: 1,
      },
    ],
  };
 export const emptyLineData = {
    labels: [],
    datasets: [
      {
        label: "No Data Available",
        data: [1,1,1],
        fill: true,
        tension: 0.4,
        backgroundColor: ["rgb(248, 248, 248)"],
      },
    ],
  };
  export const emptyBarData = {
    labels: [1,1,1],
    datasets: [
      {
        label: "No Data Available",
        data: [1,1,1],
        backgroundColor: ["rgb(248, 248, 248)"],
        borderWidth: 1,
        // barPercentage: 0.6,
        maxBarThickness: 50,
      },
    ],
  };
  export const emptyDoughnutData = {
    labels: ["No Data Available"],
    datasets: [
      {
        data: [1,1,1],
        backgroundColor: ["rgb(248, 248, 248)"],
      },
    ],
  };
  