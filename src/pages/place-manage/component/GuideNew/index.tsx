import { observer } from "mobx-react";
import { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import store from "../../store/index";

const GuideSteps = ({ onCreate }) => {
  const { plans } = store;
  const [step, setStep] = useState("1");

  if (!plans.length && step === "1") {
    return (
      <StepOne
        onCreate={() => [setStep("done"), onCreate()]}
        onNext={() => setStep("2")}
      />
    );
  }

  if (step === "2") {
    return <StepTwo onNext={() => setStep("done")} />;
  }

  return null;
};

export default observer(GuideSteps);
