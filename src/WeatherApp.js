import React,{useState,useEffect, useMemo} from "react";
import WeatherCard from "./WeatherCard.js";
import sunriseAndSunsetData from './sunrise-sunset.json';
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import useWeatherApi from './useWeatherApi';
import WeatherSetting from'./WeatherSetting.js';
import { findLocation } from './utils';

//從sunriseAndSunsetData中獲得指定縣市的時間回傳day或是night
//使用getMoent()帶入需要的縣市
const getMoent = (locationName)=> {
//location保存指定縣市的時間資料
const location = sunriseAndSunsetData.find((data) => 
data.locationName.slice(0,2) === locationName);

//如果資料不存在回傳null
if(!location){return null};

//如果存在建立符合的日期格式做比對
//1.取得現在的日期
const now = new Date();
//2.將現在的時間轉成符合的格式
//DateTimeFormat(地點,格式).format(現在時間).replae(將\換成-)
//3.得到符合格式的現在日期 nowDate
const nowDate = Intl.DateTimeFormat('zh-TW',{year:'numeric',month: '2-digit',
day: '2-digit',}).format(now).replace(/\//g, '-');
//找到對應日期的資料
const locationDate = location.time.find((time) => time.dataTime === nowDate);

//取出資料中的 日出跟日落資料
const nowTimeStamp = now.getTime();
const sunriseTimestamp = new Date(`${locationDate.dataTime} ${locationDate.sunrise}`).getTime();
const sunsetTimestamp = new Date(`${locationDate.dataTime} ${locationDate.sunset}`).getTime();

return sunriseTimestamp<=nowTimeStamp && nowTimeStamp<=sunsetTimestamp?
'day':'night';
}
//使用styled建立源件
//父層
const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// STEP 1：定義主題配色
const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

//顯示畫面的組件
const WeatherApp = () => {
  console.log('--- invoke function component ---');
  const storageCity = localStorage.getItem('cityName');
  const [currentCity,setCurrentCity] = useState(storageCity||'臺北市');
  const currentLocation = findLocation(currentCity)||{};
  const [currentWeather, fetchData] = useWeatherApi(currentLocation);
  const [currentTheme,setcurrentTheme] = useState('light');
  const [currentPage,setCurrentPage] = useState('WeatherCard');
//使用useMemo保存複雜的算式結果 (白天或晚上)
const moment = useMemo(() => getMoent(currentLocation.sunriseCityName),[currentLocation.sunriseCityName]);
console.log("moment",moment);

//對需要共用的異步方法使用useCallback()保存

  //渲染後判斷moment回傳的白天或晚上改變背景樣式
  useEffect(()=>{
    setcurrentTheme(moment === 'day' ? 'light' : 'dark');},[moment]);
  
  useEffect(() => {
    localStorage.setItem('cityName',currentCity);
  },[currentCity]);

  return (
    <ThemeProvider theme = {theme[currentTheme]}>
    <Container>
      {console.log("render")}
      {console.log(currentWeather.isLoading)}

      {currentPage === 'WeatherCard'&&
      <WeatherCard
      cityName={currentLocation.cityName}
      currentWeather = {currentWeather}
      moment = {moment}
      fetchData = {fetchData}
      setCurrentPage = {setCurrentPage}
      />}

      {currentPage === 'WeatherSetting'&&
      <WeatherSetting
      cityName={currentLocation.cityName}
      setCurrentCity = {setCurrentCity}
      setCurrentPage = {setCurrentPage}/>}
    </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;
