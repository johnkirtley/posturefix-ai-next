/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Icon } from '@iconify/react';

export default function List({ exerciseInfo }) {
    const [selected, setSelected] = useState({});

    const handleShowDetails = (exercise) => {
        setSelected(exercise);
        // eslint-disable-next-line no-undef
        const btn = document.getElementById('my-modal');
        btn.checked = true;
    };

    return (
        <div className="w-full py-5">
            {exerciseInfo.map((exercise, idx) => (
                <div>
                    <div className="flex justify-center items-center">
                        <input type="checkbox" id="my-modal" className="modal-toggle" />
                        <div className="modal justify-center items-center text-center">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">{selected && selected.name}</h3>
                                <p className="py-4">10 reps x 3 sets</p>
                                <p className="pt-4"><span className="font-bold">Example:</span></p>
                                <p>{selected && selected.image}</p>
                                <p className="pt-4"><span className="font-bold">Explanation:</span></p>
                                <p>{selected && selected.description}</p>
                                <p className="pt-4"><span className="font-bold">Reference Video:</span></p>
                                <p>{selected && selected.video}</p>
                                <div className="modal-action">
                                    <label htmlFor="my-modal" className="btn">Close</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div tabIndex={0} className="cardborder-base-300 bg-base-100 rounded-box w-3/4 m-auto my-5 shadow-md flex flex-col justify-center items-center" key={idx}>
                        <div className="text-base font-medium p-5">
                            <div>
                                <p>{exercise.name}</p>
                                <p className="text-sm font-light">10 Reps x 3 Sets</p>
                            </div>
                        </div>
                        <button type="button" className="btn btn-neutral my-4 text-xs" onClick={() => handleShowDetails(exercise)}>
                            <div className="flex justify-center items-center gap-1">
                                <Icon icon="pepicons-pop:plus" />
                                <p>Show Exercise Details</p>
                            </div>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
