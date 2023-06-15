import React from 'react';

interface ICoupleParams {
    names: string[] | string;
    moveUp: (index: number) => void;
    moveDown: (index: number) => void;
    disabled: boolean;
    index: number;
}

export default (params: ICoupleParams): React.JSX.Element => {
    const names = typeof(params.names) == 'string' ? [params.names] : params.names;
    return (
        <div className="flex items-center mb-4">
            <div className="flex flex-row mr-4" style={{fontSize:"200%"}}>
                <button className="up mr-4" onClick={() => params.moveUp(params.index)} disabled={params.disabled}>↑</button>
                <button className="down" onClick={() => params.moveDown(params.index)} disabled={params.disabled}>↓</button>
            </div>
            <div className="names">
                {names.map((name: string, index: number) => <p key={index} className="text-lg text-gray-800">{name}</p>)}
            </div>
        </div>
    );
};
