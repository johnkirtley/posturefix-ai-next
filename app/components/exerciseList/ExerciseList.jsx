/* eslint-disable react/prop-types */
export default function ExerciseList({ userInfo }) {
    return (
        <div>
            <h2 className="text-center">Exercise Library</h2>
            {userInfo.currentProtocol.map((exercise, idx) => (
                <div key={idx}>
                    <p>{exercise.name}</p>
                </div>
            ))}
        </div>
    );
}
