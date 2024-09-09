import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Filler,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Icon } from "@fluentui/react";

// Register required Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  // LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
  LinearScale,
  Filler
);

export const ColorArray = [
  "#57a5ff",
  "#ff7f2b",
  "#5a9316",
  "#ffa126",
  "#37c42d",
  "#ff2a2a",
  "#006600",
  "#FF6600",
  "#330066",
  "#0066FF",
  "#FF33CC",
  "#9900CC",
  "#00CC99",
  "#FFCC00",
  "#00FF66",
  "#FF00CC",
  "#6666FF",
  "#FFFF00",
  "#CC6600",
  "#FF6699",
  "#9933FF",
  "#FF0066",
  "#33FF99",
  "#33FFFF",
  "#CC33FF",
  "#FFCC99",
  "#FF33FF",
  "#66FF33",
];

const LineChart = ({ data, heading = "dfasd" }) => {
  // Options for Line chart
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
    },
    layout: {
      padding: {
        right: 15,
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: "end",
        anchor: "start",
      },
      legend: {
        display: false,
        position: "bottom",
      },
    },
  };

  // Inline CSS for responsive chart container
  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: "100%",
    height: "100%",
    maxWidth: "100%",
    maxHeight: "100%",
    padding: "10px",
    boxSizing: "border-box",
  };

  const buttonStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    zIndex: 1001,
  };
  const headingStyle: React.CSSProperties = {
    position: "absolute",
    top: "15px",
    left: "20px",
    fontWeight: "600",
    background: "none",
    border: "none",
    // fontSize: '20px',
    cursor: "pointer",
    zIndex: 1001,
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
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

  return (
    <div>
      <div style={cardStyle}>
        <p style={{ ...headingStyle, margin: "0" }}>{heading}</p>
          <button onClick={toggleFullscreen} style={buttonStyle}>
            {isFullscreen ? (
              <Icon iconName="Cancel" />
            ) : (
              <Icon iconName="FullScreen" />
            )}
          </button>

        <div style={containerStyle}>
          <Line className="linechart" data={data} options={options} />
        </div>
      </div>
      
      {isFullscreen && (
        <div style={cardStyleFull}>
            <p style={{...headingStyle, margin: "0"}}>{heading}</p>
            <button onClick={toggleFullscreen} style={buttonStyle}>
              {isFullscreen ? (
                <Icon iconName="Cancel" />
              ) : (
                <Icon iconName="FullScreen" />
              )}
            </button>

          <div style={containerStyle}>
            <Line  data={data} options={options} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LineChart;
