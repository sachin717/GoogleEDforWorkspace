import { Icon } from "@fluentui/react";
import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  // Calculate the scroll threshold based on viewport height
  const scrollThreshold = window.innerHeight;
  const toggleVisibility = () => {
    if (window.scrollY > scrollThreshold) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, [window.scrollY]);

  // Inline styles
  const buttonStyle: any = {
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    bottom: "20px",
    right: "20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    // padding: '10px 15px',
    height: "30px",
    width: "30px",

    cursor: "pointer",
    zIndex: 1000,
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    transition: "opacity 0.3s ease-in-out",
  };

  const buttonHoverStyle = {
    ...buttonStyle,
    backgroundColor: "#0056b3",
  };

  return (
    visible && (
      <Icon
        iconName="ChevronUpMed"
        style={buttonStyle}
        onClick={scrollToTop}
        onMouseOver={(e) =>
          (e.currentTarget.style.backgroundColor =
            buttonHoverStyle.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.backgroundColor = buttonStyle.backgroundColor)
        }
      />
    )
  );
};

export default ScrollToTop;
