import "./index.less";
import React , { useEffect, useState } from "react";

const Steps = (props) => {
    const { data, current } = props;
    return <div className="steps" style={{...props.style}}>
                <div className="stepsContainer">
                    {
                        data.map((item, index) => {
                            return <React.Fragment key={item.title}>
                                        <div className={current >= index + 1 && "item active" || "item"}>
                                            <p className="index">{index + 1}</p>
                                            <p className="text">{item.title}</p>
                                        </div>
                                        {
                                            index !== data.length - 1 && <div className={current >= index + 2 && "line active" || "line"}></div> || null
                                        }    
                                    </React.Fragment>
                        })
                    }
                </div>
           </div>
}

export default Steps;