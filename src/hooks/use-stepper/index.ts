import { useState } from 'react';

const useStepper = (defaultStep = 1) => {
  const [step, setStep] = useState(defaultStep);

  const nextStep = () => setStep(step + 1);

  const prevStep = () => setStep(step - 1);

  const onGoToStep = (step: number) => setStep(step);

  const reset = () => setStep(defaultStep);

  return { step, setStep, nextStep, prevStep, onGoToStep, reset };
};

export { useStepper };
