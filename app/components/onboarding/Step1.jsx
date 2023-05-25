/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
/* eslint-disable import/no-extraneous-dependencies */
import { Icon } from '@iconify/react';

export default function Step1({ setStep, step, onboardingQuestions, setOnboardingQuestions }) {
    const handleNameChange = (e) => {
        setOnboardingQuestions(
            {
                ...onboardingQuestions,
                [e.target.name]: e.target.value,
            },
        );
    };

    const handleSelectChange = (e) => {
        setOnboardingQuestions({
            ...onboardingQuestions,
            [e.target.name]: e.target.value,
        });
    };

    // const newArr = [...onboardingQuestions.equipment];

    // const handleCheck = (idx) => {
    //     newArr[idx].isChecked = !newArr[idx].isChecked;

    //     setOnboardingQuestions({
    //         ...onboardingQuestions,
    //         equipment: newArr,
    //     });
    // };

    return (
        <div className="flex flex-col justify-center items-center text-center gap-5">
            <div className="form-control flex flex-col gap-5 justify-start items-start">
                <div>
                    <label className="label">
                        <span className="label-text">First Name</span>
                    </label>
                    <input type="text" placeholder="First Name..." className="input input-bordered input-accent" onChange={handleNameChange} name="name" value={onboardingQuestions.name} />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text">Activity Level</span>
                    </label>
                    <select defaultValue="sedentary" className="select w-full max-w-xs select-bordered select-accent" name="activityLevel" onChange={handleSelectChange}>
                        <option disabled>Select Activity Level</option>
                        <option value="sedentary">Sedentary (Desk Job)</option>
                        <option value="light">Light Activity (Walks, Workout 1-2x/week)</option>
                        <option value="active">Active (Workout 3-5x/week)</option>
                    </select>
                </div>
                <div>
                    <label className="label flex mr-10">
                        <span className="label-text">Did Pain Occur After Injury?</span>
                        <div className="tooltip" data-tip="If you selected Yes, I recommend seeing a healthcare professional to get evaluated.">
                            <Icon icon="material-symbols:info" />
                        </div>
                    </label>
                    <select defaultValue="no" className="select w-full max-w-xs select-bordered select-accent" name="painAfterInjury" onChange={handleSelectChange}>
                        <option disabled>Did Pain Start After An Injury?</option>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
                {/* <div>
                    <p>Select Equipment You Have Access Too</p>
                </div>
                <div className="form-control">
                    {onboardingQuestions.equipment.map((item, idx) => (
                        <label className="label cursor-pointer flex justify-start gap-3" key={idx}>
                            <input type="checkbox" className="checkbox" value={item.valName} checked={item.isChecked} onChange={() => handleCheck(idx)} />
                            <span className="label-text">{item.name}</span>
                        </label>
                    ))}
                </div> */}
            </div>
            <button
                type="button"
                disabled={onboardingQuestions.name === ''}
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
            >Next
            </button>
        </div>
    );
}
