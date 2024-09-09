// MiniChartCard.tsx

import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import styles from ".././SCSS/Ed.module.scss";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Icon } from "@fluentui/react";

// Register required Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  PointElement,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);
// interface BarChartsProps {
//   data: {
//     labels: string[];
//     datasets: {
//       label: string;
//       backgroundColor: string;
//       borderColor: string;
//       borderWidth: number;
//       data: number[];
//     }[];
//   };
//   options?: any; // Optional, to customize chart options
// }

const BarCharts = ({ data, heading = "dfasp" }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };
  let options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 8,
          },
        },
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
      },
      title: {
        display: true,
      },

      legend: {
        display: false,
      },
    },
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

  const cardStyle: React.CSSProperties = {
    width: "100%",
    height: "230px",
    border: "1px solid #ddd",
    padding: "20px 16px",
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
    padding: "45px 16px 16px",
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
  };

  return (
    <div>
      <div style={cardStyle} className={styles.chartcon}>
        <p style={{ ...headingStyle, margin: "0",paddingTop:"10px" }}>{heading}</p>
        <button onClick={toggleFullscreen} style={buttonStyle}>
          {isFullscreen ? (
            <Icon iconName="Cancel" />
          ) : (
            <Icon iconName="FullScreen" />
          )}
        </button>

        <Bar className="barchart" data={data} options={options} />
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
          <Bar data={data} options={options} />
        </div>
      )}
    </div>
  );
};

export default BarCharts;
