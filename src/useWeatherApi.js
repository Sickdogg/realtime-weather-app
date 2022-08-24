import{useState,useEffect,useCallback,} from "react";
//一開啟畫面抓取資料方法
const fetchCurrentWeather = (locationName) => {
  //使用fetch方法獲得觀測openData
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-E6DAB8FC-B037-4C43-824D-790B99C65577&locationName=${locationName}`
    )
  .then((response)=>response.json())
  .then((data) => {
    const locationData = data.records.location[0];
    const weatherElements = locationData.weatherElement.reduce(
      (neededElements,item) => {
        if(['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)){
          neededElements[item.elementName] = item.elementValue; 
        }
        return neededElements;
      }
    );
      return{
      observationTime:locationData.time.obsTime,
      locationName: locationData.locationName,
      description: '多雲時晴',
      temperature: weatherElements.TEMP,
      windSpeed: weatherElements.WDSD,
      humid: weatherElements.HUMD,} 
  });
  }
//抓取預報OopenData方法
const fetchWeatherForecast = (cityName) =>{
  return fetch(
    `https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWB-E6DAB8FC-B037-4C43-824D-790B99C65577&locationName=${cityName}`
    )
.then((promise) => promise.json())
.then((data) => {
  const locationData = data.records.location[0];
  const weatherElements = locationData.weatherElement.reduce(
    (neededElements,item) => {
      if(['Wx', 'PoP', 'CI'].includes(item.elementName)){
        neededElements[item.elementName] = item.time[0].parameter;
      }
      return neededElements;
    },
    {}
  );
    return {
      description: weatherElements.Wx.parameterName,
      weatherCode: weatherElements.Wx.parameterValue,
      rainPossibility: weatherElements.PoP.parameterName,
      comfortability: weatherElements.CI.parameterName,
    }
});
}

const useWeatherApi = (currentLocation) => {

  const [currentWeather,setCurrentWeather] = useState({
    observationTime:'2022-08-10 22:10:00',
    locationName: '臺北市',
    description: '多雲時晴',
    temperature: 27.5,
    windSpeed: 0.3,
    humid: 0.88,
    weatherCode:0,
    isLoading:true,
  });

  //供給openData查找的指定縣市名稱
  const {locationName,cityName} = currentLocation;

  const fetchData = useCallback( () =>{
    const fetchingData = async () =>{
      const [currentWeather, weatherForecast] = await Promise.all(
        //帶入到兩個查找異步函式
        [fetchCurrentWeather(locationName),
          fetchWeatherForecast(cityName)]
          );
          setCurrentWeather({
            ...currentWeather,
            ...weatherForecast,
            isLoading:false,
          });
     }
     setCurrentWeather(pre => ({...pre,isLoading:true}));
     fetchingData();
  },[locationName,cityName]);
  
   //useEffect在渲染後執行抓取openData的fetchData()方法
    useEffect( () =>{
    fetchData();
    },[fetchData]);

    return [currentWeather,fetchData];
}

export default useWeatherApi;