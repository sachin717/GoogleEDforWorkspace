// DonutChart.tsx

import React, { useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Icon, isDark } from "@fluentui/react";
import styles from ".././SCSS/Ed.module.scss";
// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  // PointElement,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);
// interface DonutChartProps {
//   data: {
//     labels: string[];
//     datasets: {
//       label: string;
//       backgroundColor: string[];
//       borderColor: string[];
//       borderWidth: number;
//       data: number[];
//     }[];
//   };
//   options?: any; // Optional, to customize chart options
// }

const DonutChart = ({ data, heading = "dsfasd" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  let options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      datalabels: {
        display: true,
        color: "#FFFFFF",
      },
      legend: {
        display: true,
        position: "right",
        align: "center",

        labels: {
          boxWidth: 12,
          font: {
            size: 8,
          },
        },
      },
      title: {
        display: true,
      },
    },
  };
  const defaultOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed !== null) {
              label += context.parsed.toString();
            }
            return label;
          },
        },
      },
      datalabels: {
        display: true,
        color: "#000",
        anchor: "end",
        align: "center",
        formatter: (value: number) => `${value}`, // Display the count
        font: {
          weight: "bold",
        },
      },
    },
    cutout: "70%", // Adjust this to control the size of the hole in the center
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const cardStyle: React.CSSProperties = {
    width: "100%",
    height: "230px",
    border: "1px solid #ddd",
    padding: "20px 0px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    overflow: "hidden",
    zIndex: "auto",
    transform: "none",
    top: "auto",
    left: "auto",
    position: "relative",
  };
  const cardStyleFull: React.CSSProperties = {
    width: "80vw",
    height: "80vh",
    border: "1px solid #ddd",
    padding: "35px 16px",
    transition: "all 0.3s ease",
    backgroundColor: "white",
    overflow: "hidden",
    zIndex: 100000,
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
    position: "fixed",
  };

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 1001, // Ensure button is on top of the chart
  };
  const headingStyle: React.CSSProperties = {
    position: "absolute",
    top: "5px",
    left: "20px",
    fontWeight: "600",
    background: "none",
    border: "none",
    // fontSize: '20px',
    cursor: "pointer",
    zIndex: 1001,
  };

  return (
    <div>
      <div style={cardStyle} className={styles.chartcon}>
        <p style={{ ...headingStyle, margin: "0" }}>{heading}</p>
        <button onClick={toggleFullscreen} style={buttonStyle}>
          {isFullscreen ? (
            <Icon iconName="Cancel" />
          ) : (
            <Icon iconName="FullScreen" />
          )}
        </button>
        <Doughnut data={data} options={options || defaultOptions} />
      </div>
      
      {isFullscreen && (
        <div style={cardStyleFull} className={styles.chartcon}>
          <p style={{ ...headingStyle, margin: "0" }}>{heading}</p>
          <button onClick={toggleFullscreen} style={buttonStyle}>
            {isFullscreen ? (
              <Icon iconName="Cancel" />
            ) : (
              <Icon iconName="FullScreen" />
            )}
          </button>
          <Doughnut data={data} options={options || defaultOptions} />
        </div>
      )}
    </div>
  );
};

export default DonutChart;
