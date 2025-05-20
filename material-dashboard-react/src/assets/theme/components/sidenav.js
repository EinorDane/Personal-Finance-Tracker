/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Material Dashboard 2 React helper functions
import pxToRem from "assets/theme/functions/pxToRem";

const { white } = colors;
const { borderRadius } = borders;

const sidenav = {
  styleOverrides: {
    root: {
      width: "250px",
      whiteSpace: "nowrap",
      border: "none",
      background: "linear-gradient(135deg, #232946 0%, #7c3aed 100%)",
      color: "#fff",
      transition: "background 0.4s cubic-bezier(.25,.8,.25,1), color 0.3s",
    },

    paper: {
      width: "250px",
      background: "inherit",
      color: "#fff",
    },
  },
};

export default sidenav;
