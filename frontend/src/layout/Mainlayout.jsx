// Mainlayout.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // assuming you're using this

const Mainlayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This is where nested routes like HeroSection, Courses, etc., will render */}
    </>
  );
};

export default Mainlayout;
