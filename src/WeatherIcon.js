import React, { useEffect, useMemo, useState } from "react";
import styled from "@emotion/styled";
import { ReactComponent as DayThunderstorm } from './images/day-thunderstorm.svg';
import { ReactComponent as DayClear } from './images/day-clear.svg';
import { ReactComponent as DayCloudyFog } from './images/day-cloudy-fog.svg';
import { ReactComponent as DayCloudy } from './images/day-cloudy.svg';
import { ReactComponent as DayFog } from './images/day-fog.svg';
import { ReactComponent as DayPartiallyClearWithRain } from './images/day-partially-clear-with-rain.svg';
import { ReactComponent as DaySnowing } from './images/day-snowing.svg';
import { ReactComponent as NightThunderstorm } from './images/night-thunderstorm.svg';
import { ReactComponent as NightClear } from './images/night-clear.svg';
import { ReactComponent as NightCloudyFog } from './images/night-cloudy-fog.svg';
import { ReactComponent as NightCloudy } from './images/night-cloudy.svg';
import { ReactComponent as NightFog } from './images/night-fog.svg';
import { ReactComponent as NightPartiallyClearWithRain } from './images/night-partially-clear-with-rain.svg';
import { ReactComponent as NightSnowing } from './images/night-snowing.svg';

//建立天氣所代表的號碼搭配
const weatherTypes = {
  //雷雨的代號
  isThunderstorm: [15, 16, 17, 18, 21, 22, 33, 34, 35, 36, 41],
  //晴天''
  isClear: [1],
  //有風有霧''
  isCloudyFog: [25, 26, 27, 28],
  //有風''
  isCloudy: [2, 3, 4, 5, 6, 7],
  //有霧
  isFog: [24],
  //稍微有雨
  isPartiallyClearWithRain: [
    8, 9, 10, 11, 12,
    13, 14, 19, 20, 29, 30,
    31, 32, 38, 39,
  ],
  //有雪
  isSnowing: [23, 37, 42]
}

//建立白天跟晚上的物件{day:{},night:{}}
const weatherIcons = {
  day: {
    isThunderstorm: <DayThunderstorm />,
    isClear: <DayClear />,
    isCloudyFog: <DayCloudyFog />,
    isCloudy: <DayCloudy />,
    isFog: <DayFog />,
    isPartiallyClearWithRain: <DayPartiallyClearWithRain />,
    isSnowing: <DaySnowing />,
  },
  night: {
    isThunderstorm: <NightThunderstorm />,
    isClear: <NightClear />,
    isCloudyFog: <NightCloudyFog />,
    isCloudy: <NightCloudy />,
    isFog: <NightFog />,
    isPartiallyClearWithRain: <NightPartiallyClearWithRain />,
    isSnowing: <NightSnowing />,
  },
};

//使用styled建立div
const IconContainer = styled.div`
flex-basis:30%;
svg {
    max-height: 110px;
  }`;

//藉由傳入的weatherCode從數組中找出符合的資料(邏輯計算))
const weatherCode2Type = (weatherCode) => {
  const [weatherType] =
  Object.entries(weatherTypes).find(([weatherType, weatherCodes]) => {
    return weatherCodes.includes(Number(weatherCode))})||[];
  return weatherType;
};

//圖片元件
const WeatherIcon = ({currentWeatherCode,moment}) =>{
  //使用useState建立關聯資料
   const [currentWeatherIcon,setCurrentWeatherIcon] = useState("isClear");
   //使用useMemo存放公有的計算邏輯結果 weatherCode2Type ,並綁定WeatherApp.js的Code
   const theWeatherIcon = useMemo(() => weatherCode2Type(currentWeatherCode),
   [currentWeatherCode]);
   useEffect(() => {
     //當theWeatherIcon改變執行副作用
 setCurrentWeatherIcon(theWeatherIcon);
   },[theWeatherIcon]);


  return (
    <IconContainer>
      {weatherIcons[moment][currentWeatherIcon]}
    </IconContainer>
  )
}
export default WeatherIcon;