import React from "react";
import hand_icon from "../assets/hand_icon.png";
import arrow_icon from "../assets/arrow.png";
import hero_image from "../assets/hero_image.png";

export default function () {
  return (
    <div className="h-screen bg-gradient-to-r from-[#fce1ff] to-[#ffea22] to-[60%] flex ">
        <div className="flex-1 flex flex-col justify-center gap-[20px] pl-[180px] leading-[1.1]">
            <h2 className="text-slate-900 text-[26px] font-semibold">NEW ARRIVALS ONLY</h2>
            <div>
                <div className="flex items-center gap-[20px]">
                    <p className="text-slate-800 text-[100px] font-bold">New</p>
                    <img className="w-[105px]" src={hand_icon} alt="" />
                </div>
                <p className="text-slate-800 text-[100px] font-bold" >Collection</p>
                <p className="text-slate-800 text-[100px] font-bold" >For Everyone</p>
            </div>
            <div className="flex justify-center items-center gap-[15px] w-[310px] h-[70px] rounded-[75px] mt-[30px] bg-red-900 text-white text-[22px] font-medium">
                <div>Latest Collection</div>
                <img src={arrow_icon} alt="" />
            </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
            <img src={hero_image} alt="" />
        </div>
    </div>
  );
}
