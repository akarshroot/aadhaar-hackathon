import React from "react";
import {
    StepperAction,
    StepperContent,
    StepperContext
  } from "react-material-stepper";
   
  export const STEP1 = "step-one";
   
  const Step1 = ({ vertical = false }) => {
    const { resolve, getData } = React.useContext(StepperContext);
   
    const data = getData(STEP1);
   
    const onSubmit = (event) => {
      event.preventDefault();
      // resolve will set data for current step and proceed to the next step
      resolve("step1 resolved data");
    };
    export default Step1
   
    return (
      <StepperContent
        onSubmit={onSubmit}
        actions={
          <StepperAction align="right" type="submit">
            Continue
          </StepperAction>
        }
      >
        Step1 resolved:
        <pre>{data}</pre>
      </StepperContent>
    );
  };
  