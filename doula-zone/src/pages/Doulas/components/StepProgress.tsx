import styles from "../Createdoula/CreateDoula.module.css";

interface StepProgressProps {
  currentStep: number;
  steps: string[];
}

const StepProgress = ({ currentStep, steps }: StepProgressProps) => {
  return (
    <div className={styles.stepperWrapper}>
      {steps.map((label, idx) => {
        const stepNumber = idx + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={label} className={styles.stepItem}>
            <div className={styles.stepCircleWrapper}>
              <div
                className={[
                  styles.stepCircle,
                  isActive ? styles.stepCircleActive : "",
                  isCompleted ? styles.stepCircleCompleted : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {stepNumber}
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={[
                    styles.stepConnector,
                    stepNumber < currentStep ? styles.stepConnectorActive : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              )}
            </div>
            <div className={styles.stepLabel}>{label}</div>
          </div>
        );
      })}
    </div>
  );
};

export default StepProgress;
