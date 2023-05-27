/* eslint-disable import/prefer-default-export */
import { useRouter } from 'next/navigation';

export function NoPlan() {
    const router = useRouter();

    return (
        <div className="flex flex-col justify-center items-center gap-5">
            <div className="text-center">
                <p className="font-bold">Upgrade To Access All Features.</p>
                <p>(All Exercises, Randomizer, Search)</p>
            </div>
            <div>
                <button type="button" className="btn btn-neutral" onClick={() => router.push('/plans')}>View Plans</button>
            </div>
        </div>
    );
}
