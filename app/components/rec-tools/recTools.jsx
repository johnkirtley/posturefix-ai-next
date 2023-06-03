/* eslint-disable import/prefer-default-export */
import { tools } from './tools';

export function RecTools() {
    return (
        <div>
            <div className="text-center flex flex-col gap-4">
                <p className="text-lg font-semibold">🛠 Helpful Tools</p>
                <p className="text-xs w-11/12 m-auto">May contain affiliate links, but these are all products we&apos;ve found useful.</p><p className="text-xs">Feel free to search for alternatives.</p>
            </div>
            <div className="flex flex-col justify-center items-center w-11/12 m-auto gap-5 py-5">
                {tools.map((tool) => (
                    <div className="w-11/12 flex flex-col justify-center items-center">
                        <div className="card bg-base-100 shadow-xl w-11/12 flex flex-col justify-center items-center">
                            <figure><img className="p-5 h-60 object-contain" src={tool.image} alt="Shoes" /></figure>
                            <div className="card-body flex flex-col justify-center items-center">
                                <h2 className="card-title">
                                    {tool.name}
                                </h2>
                                {tool.recommend ? <div className="badge badge-info p-3">Highly Recommended</div> : ''}
                                <p className="text-sm">{tool.description}</p>
                                <div className="card-actions justify-center mt-4">
                                    <a target="_blank" href={tool.link} rel="noreferrer"> <button type="button" className="btn btn-secondary">View</button></a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
