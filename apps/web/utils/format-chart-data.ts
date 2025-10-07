type ClicksOverTimeRaw = {
  date: string;
  clicks: number;
}[];

type ClicksByHourRaw = {
  hour: string;
  clicks: number;
}[];

type ClicksOverTimeFormatted = {
  date: string;
  clicks: number;
}[];

type ClicksByHourFormatted = {
  hour: string;
  clicks: number;
}[];

const formatChartDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${day}/${month}`;
};

const formatChartHour = (hourString: string): string => {
  return `${hourString.padStart(2, "0")}:00`;
};

export const formatClicksOverTime = (
  data: ClicksOverTimeRaw
): ClicksOverTimeFormatted => {
  return data.map((item) => ({
    date: formatChartDate(item.date),
    clicks: item.clicks,
  }));
};

export const formatClicksByHour = (
  data: ClicksByHourRaw
): ClicksByHourFormatted => {
  return data.map((item) => ({
    hour: formatChartHour(item.hour),
    clicks: item.clicks,
  }));
};

export const formatChartsData = (
  charts: {
    clicksOverTime: ClicksOverTimeRaw;
    clicksByHour: ClicksByHourRaw;
  } | null
) => {
  if (!charts)
    return {
      clicksOverTime: [],
      clicksByHour: [],
    };

  return {
    clicksOverTime: formatClicksOverTime(charts.clicksOverTime),
    clicksByHour: formatClicksByHour(charts.clicksByHour),
  };
};
