import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { CalendarEvent, getCalendarEvents } from '../api-client';
import {
  Table, TableBody, TableFooter,
  TableHeader, TableRow, TableCell
} from '../components';

interface IData {
  numberOfEvents: number,
  totalDuration: number,
  longestEvent: null | CalendarEvent
}

const CalendarSummary: React.FunctionComponent = () => {
  const startOfThisWeek = moment().startOf('week');
  const endOfThisWeek = moment().endOf('week');
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState<{ [key: string]: IData }>({});
  const [footerData, setFooterData] = useState<IData>({
    numberOfEvents: 0,
    totalDuration: 0,
    longestEvent: null
  });

  useEffect(() => {
    const fetchData = async () => {
      var date = startOfThisWeek.clone();

      while (date.isSameOrBefore(endOfThisWeek)) {
        await parseDay(date);
        date = startOfThisWeek.add(1, 'day');
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const parseDay = (date: Moment) => {
    return new Promise((resolve, reject) =>
      getCalendarEvents(date.toDate())
        .then(result => {
          const longestDayEvent: CalendarEvent = result.reduce((prev, current) => {
            return (prev.durationInMinutes > current.durationInMinutes) ? prev : current;
          });

          const totalDayDuration = result.map(o => o.durationInMinutes)
            .reduce((previousValue, currentValue) => {
              return previousValue + currentValue;
            });

          const dayData = {
            totalDuration: totalDayDuration,
            numberOfEvents: result.length,
            longestEvent: longestDayEvent
          }

          setFooterData(footerData => {
            const { numberOfEvents, totalDuration, longestEvent } = footerData;

            return {
              numberOfEvents: numberOfEvents + dayData.numberOfEvents,
              totalDuration: totalDuration + dayData.totalDuration,
              longestEvent: (longestEvent && longestEvent.durationInMinutes > dayData.longestEvent.durationInMinutes) ?
                longestEvent : dayData.longestEvent
            }
          });

          setData(data => ({
            ...data,
            [date.format('YYYY-MM-DD')]: dayData
          }));

          resolve('success');
        })
        .catch(error => {
          reject(error);
        })
    );
  }

const generateRows = () => {
  return Object.keys(data).map(key => {
    const item: IData = data[key];

    return (
      <TableRow
        key={key}
      >
        <TableCell header scope='row'>{key}</TableCell>
        <TableCell>{item.numberOfEvents}</TableCell>
        <TableCell>{item.totalDuration}</TableCell>
        <TableCell>{item.longestEvent?.title}</TableCell>
      </TableRow>
    )
  });
}

return (
  <div>
    <h2>Calendar summary</h2>

    { isLoading &&
      <div>We are loading data... Please wait :)</div>
    }

    { !isLoading &&
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell header>Date</TableCell>
            <TableCell header>Number of events</TableCell>
            <TableCell header>Total duration [min]</TableCell>
            <TableCell header>Longest event</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {generateRows()}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell header scope='row'>Total:</TableCell>
            <TableCell>{footerData.numberOfEvents}</TableCell>
            <TableCell>{footerData.totalDuration}</TableCell>
            <TableCell>{footerData.longestEvent?.title}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    }
  </div>
);
};

export default CalendarSummary;
