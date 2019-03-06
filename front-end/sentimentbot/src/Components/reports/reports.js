import React from "react";
import PieChart from "./chart";
import NavBar from '../NavBar/NavBar';
import './report.css'

function Reports(props) {

  if(!localStorage.getItem('jwt')){
    props.history.push('/home')
  }
  return (
    <>
     <NavBar />
     <div className="main-reports-container">
     
      <h2> Generate a new report: </h2>
      <button className="main-reports-container-button" onClick={() => props.history.push('/generatereport')}>Here</button>
      <PieChart history={props.history} />
      </div>
    </>
  );
}

export default Reports;
