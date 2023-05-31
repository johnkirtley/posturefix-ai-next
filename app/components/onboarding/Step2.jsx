/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */

export default function Step2({ setStep, step, onboardingQuestions, setOnboardingQuestions }) {
    const newArr = [...onboardingQuestions.painPoints];

    const handleCheck = (idx) => {
        newArr[idx].isChecked = !newArr[idx].isChecked;

        setOnboardingQuestions({
            ...onboardingQuestions,
            painPoints: newArr,
        });
    };

    const checkIfSelected = () => {
        const selected = newArr.filter((point) => point.isChecked === true);

        if (selected.length > 0) {
            return false;
        }

        return true;
    };

    return (
        <div className="flex flex-col justify-center items-center text-center gap-5">
            <div>
                <p>Select Areas That Give You Trouble</p>
            </div>
            <div>
                <div className="form-control">
                    {onboardingQuestions.painPoints.map((point, idx) => (
                        <label className="label cursor-pointer flex justify-start gap-3" key={idx}>
                            <input type="checkbox" className="checkbox" value={point.valName} checked={point.isChecked} onChange={() => handleCheck(idx)} />
                            <span className="label-text">{point.name}</span>
                        </label>
                    ))}
                </div>
            </div>
            <div className="flex gap-5">
                <button
                    type="button"
                    className="btn btn-info btn-outline"
                    onClick={() => setStep(step - 1)}
                >Back
                </button>
                <button
                    type="button"
                    disabled={checkIfSelected()}
                    className="btn btn-info"
                    onClick={() => setStep(step + 1)}
                >Next
                </button>
            </div>
        </div>
    );
}
