/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable react/prop-types */

export default function List({ exerciseInfo }) {
    return (
        <div className="w-full py-5">
            {exerciseInfo.map((exercise, idx) => (
                <div tabIndex={0} className="collapse collapse-plus border border-base-300 bg-base-100 rounded-box w-3/4 m-auto my-4 shadow-md" key={idx}>
                    <div className="collapse-title text-base font-medium">
                        <div>
                            <p>{exercise.name}</p>
                            <p className="text-sm font-light">10 Reps x 3 Sets</p>
                            <p className="text-sm font-light">Type: {exercise.muscleGroup}</p>
                        </div>
                    </div>
                    <div className="collapse-content">
                        <ul className="flex flex-col justify-center items-start mt-5 text-sm gap-1">
                            <li><span className="font-medium">Description:</span></li>
                            <li><span className="font-medium">Example:</span></li>
                            <li><span className="font-medium">Recommended Explanation Video:</span> </li>
                            <li><span className="font-medium">Alternative Exercise:</span></li>
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
}
