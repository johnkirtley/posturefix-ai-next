/* eslint-disable import/prefer-default-export */
import { tools } from './tools';

export function RecTools() {
    return (
        <div>
            <div className="text-center flex flex-col gap-4">
                <p className="text-lg font-semibold">🛠 Helpful Tools</p>
                <p className="text-xs w-11/12 m-auto">May contain affiliate links, but these are all products we&apos;ve found very useful.</p><p className="text-xs">Feel free to search for alternatives.</p>
            </div>
            <div className="flex flex-col justify-center items-center w-11/12 md:w-1/2 m-auto gap-5 py-5 carousel">
                {tools.map((tool, idx) => (
                    <div className="w-11/12 flex flex-col justify-center items-center carousel-item" key={idx}>
                        <div className="card bg-base-100 shadow-xl w-11/12 flex flex-col justify-center items-center">
                            <figure><img className="p-5 h-60 object-contain" src={tool.image} alt="Shoes" /></figure>
                            <div className="card-body flex flex-col justify-center items-center">
                                <h2 className="card-title">
                                    {tool.name}
                                </h2>
                                {tool.recommend ? <div className="badge badge-info p-3">Highly Recommended</div> : ''}
                                <div className="card-actions justify-center mt-4">
                                    <a target="_blank" href={tool.link} rel="noreferrer"> <button type="button" className="btn btn-secondary">View</button></a>
                                </div>
                                <div className="collapse border text-center border-secondary rounded-lg collapse-arrow mt-2 md:w-3/4 m-auto">
                                    <input type="checkbox" />
                                    <div className="collapse-title collapse-plus font-normal w-3/5 m-auto">More Info</div>
                                    <div className="collapse-content">
                                        {tool.description.map((text) => (
                                            <p className="text-normal text-left my-3">{text}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
