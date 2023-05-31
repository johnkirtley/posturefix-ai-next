/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */

export default function Step3({
    setStep, step, onboardingQuestions, setOnboardingQuestions, finishOnboarding,
}) {
    const handleCheck = (e) => {
        if (e.target.checked) {
            setOnboardingQuestions({
                ...onboardingQuestions,
                postureType: e.target.value,
            });
        }

        console.log(onboardingQuestions);
    };
    return (
        <div className="flex flex-col justify-center items-center text-center gap-5">
            <div className="flex flex-col gap-5">
                <div className="form-control">
                    <label className="label cursor-pointer flex justify-start gap-3">
                        <input type="radio" className="radio" name="radio-1" value="kyphosis" onChange={handleCheck} checked={onboardingQuestions.postureType === 'kyphosis'} />
                        <span className="label-text">Kyphosis</span>
                    </label>
                    <div className="form-control">
                        <label className="label cursor-pointer flex justify-start gap-3">
                            <input type="radio" className="radio" name="radio-2" value="lordosis" onChange={handleCheck} checked={onboardingQuestions.postureType === 'lordosis'} />
                            <span className="label-text">Lordosis</span>
                        </label>
                    </div>
                    <div className="form-control">
                        <label className="label cursor-pointer flex justify-start gap-3">
                            <input type="radio" className="radio" name="radio-3" value="swayback" onChange={handleCheck} checked={onboardingQuestions.postureType === 'swayback'} />
                            <span className="label-text">Sway Back</span>
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="label cursor-pointer flex justify-start gap-3">
                            <input type="radio" className="radio" name="radio-4" value="flatback" onChange={handleCheck} checked={onboardingQuestions.postureType === 'flatback'} />
                            <span className="label-text">Flat Back</span>
                        </label>
                    </div>
                </div>
                <div className="flex gap-5">
                    <button
                        type="button"
                        className="btn btn-info btn-outline"
                        onClick={() => setStep(step - 1)}
                    >Back
                    </button>
                    <button type="button" onClick={finishOnboarding} className="btn btn-info">Finish</button>
                </div>
            </div>
        </div>
    );
}
