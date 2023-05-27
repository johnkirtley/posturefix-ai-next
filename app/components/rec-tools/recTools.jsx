/* eslint-disable import/prefer-default-export */
import { tools } from './tools';

export function RecTools() {
    return (
        <div>
            <div className="text-center">
                <p className="text-lg">🛠 Helpful Tools</p>
            </div>
            <div className="flex flex-col w-11/12 m-auto gap-5 mt-10 py-5">
                {tools.map((tool) => (
                    <div>
                        <div className="card bg-base-100 shadow-xl">
                            <figure><img src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg" alt="Shoes" /></figure>
                            <div className="card-body">
                                <h2 className="card-title">
                                    {tool.name}
                                    {tool.recommend ? <div className="badge badge-warning">Highly Recommend</div> : ''}
                                </h2>
                                <p>{tool.description}</p>
                                <div className="card-actions justify-center mt-10">
                                    <button type="button" className="btn btn-primary">Check It Out</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
