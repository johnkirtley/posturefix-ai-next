/* eslint-disable import/prefer-default-export */
import { tools } from './tools';

export function RecTools() {
    return (
        <div>
            <div className="text-center flex flex-col gap-5">
                <p className="text-lg">🛠 Helpful Tools</p>
                <p className="text-xs">* These are just examples. <br />Feel free to search for alternatives</p>
            </div>
            <div className="flex flex-col justify-center items-center w-11/12 m-auto gap-5 mt-10 py-5">
                {tools.map((tool) => (
                    <div className="w-11/12 flex flex-col justify-center items-center">
                        <div className="card bg-base-100 shadow-xl w-11/12 flex flex-col justify-center items-center">
                            <figure><img className="p-5 h-60 object-contain" src={tool.image} alt="Shoes" /></figure>
                            <div className="card-body flex flex-col justify-center items-center">
                                <h2 className="card-title">
                                    {tool.name}
                                </h2>
                                {tool.recommend ? <div className="badge badge-warning">Highly Recommend</div> : ''}
                                <p className="text-sm">{tool.description}</p>
                                <div className="card-actions justify-center mt-4">
                                    <a target="_blank" href={tool.link} rel="noreferrer"> <button type="button" className="btn btn-primary">Check It Out</button></a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
