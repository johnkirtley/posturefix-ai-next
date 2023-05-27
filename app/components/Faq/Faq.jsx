/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable import/prefer-default-export */
import { faqContent } from './faqContent';

export function Faq() {
    return (
        <div>
            <div className="flex flex-col justify-center items-center gap-5 w-11/12 m-auto py-5">
                <p className="text-lg">❓ Frequently Asked Questions</p>
                {faqContent.map((content) => (
                    <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box w-full">
                        <div className="collapse-title text-md font-medium">
                            {content.title}
                        </div>
                        <div className="collapse-content">
                            <p>{content.content}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
