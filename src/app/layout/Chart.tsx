import React from 'react';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

// @ts-ignore
import { ChartCanvas, Chart } from 'react-stockcharts';
// @ts-ignore
import { BarSeries, AreaSeries, CandlestickSeries, LineSeries } from 'react-stockcharts/lib/series';
// @ts-ignore
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import {
  CrossHairCursor,
  EdgeIndicator,
  CurrentCoordinate,
  MouseCoordinateX,
  MouseCoordinateY
  // @ts-ignore
} from 'react-stockcharts/lib/coordinates';
// @ts-ignore
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
// @ts-ignore
import { OHLCTooltip, MovingAverageTooltip } from 'react-stockcharts/lib/tooltip';
// @ts-ignore
import { ema, sma } from 'react-stockcharts/lib/indicator';
// @ts-ignore
import { last } from 'react-stockcharts/lib/utils';

const ChartView = (props: any) => {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  console.log(props);
  // @ts-ignore
  const { data: initialData } = props;
  const width = 1000;
  const ratio = 3;
  const type = 'hybrid';

  const ema20 = ema()
    .id(0)
    .options({ windowSize: 20 })
    .merge((d: any, c: any) => {
      d.ema20 = c;
    })
    .accessor((d: any) => d.ema20);

  const ema50 = ema()
    .id(2)
    .options({ windowSize: 50 })
    .merge((d: any, c: any) => {
      d.ema50 = c;
    })
    .accessor((d: any) => d.ema50);

  const smaVolume70 = sma()
    .id(3)
    .options({ windowSize: 70, sourcePath: 'volume' })
    .merge((d: any, c: any) => {
      d.smaVolume70 = c;
    })
    .accessor((d: any) => d.smaVolume70);
  const calculatedData = ema20(ema50(smaVolume70(initialData)));

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: any) => d.date);
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];
  return (
    <ChartCanvas
      height={650}
      ratio={ratio}
      width={width}
      margin={{ left: 50, right: 50, top: 70, bottom: 30 }}
      type={type}
      seriesName="MSFT"
      data={data}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
    >
      <Chart
        id={2}
        yExtents={[(d: any) => d.volume, smaVolume70.accessor()]}
        height={150}
        origin={(w: any, h: any) => [0, h - 150]}
      >
        <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format('.2s')} />

        <BarSeries yAccessor={(d: any) => d.volume} fill={(d: any) => (d.close > d.open ? '#6BA583' : '#FF0000')} />
        <AreaSeries yAccessor={smaVolume70.accessor()} stroke={smaVolume70.stroke()} fill={smaVolume70.fill()} />

        <CurrentCoordinate yAccessor={smaVolume70.accessor()} fill={smaVolume70.stroke()} />
        <CurrentCoordinate yAccessor={(d: any) => d.volume} fill="#9B0A47" />

        <EdgeIndicator
          itemType="first"
          orient="left"
          edgeAt="left"
          yAccessor={(d: any) => d.volume}
          displayFormat={format('.4s')}
          fill="#0F0F0F"
        />
        <EdgeIndicator
          itemType="last"
          orient="right"
          edgeAt="right"
          yAccessor={(d: any) => d.volume}
          displayFormat={format('.4s')}
          fill="#0F0F0F"
        />
        <EdgeIndicator
          itemType="first"
          orient="left"
          edgeAt="left"
          yAccessor={smaVolume70.accessor()}
          displayFormat={format('.4s')}
          fill={smaVolume70.fill()}
        />
        <EdgeIndicator
          itemType="last"
          orient="right"
          edgeAt="right"
          yAccessor={smaVolume70.accessor()}
          displayFormat={format('.4s')}
          fill={smaVolume70.fill()}
        />
      </Chart>
      <Chart
        id={1}
        yPan
        yExtents={[(d: any) => [d.high, d.low], ema20.accessor(), ema50.accessor()]}
        padding={{ top: 10, bottom: 20 }}
      >
        <XAxis axisAt="bottom" orient="bottom" />
        <XAxis axisAt="top" orient="top" flexTicks />
        <YAxis axisAt="right" orient="right" ticks={5} />

        <CandlestickSeries />

        <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} highlightOnHover />
        <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} highlightOnHover />

        <CurrentCoordinate yAccessor={ema20.accessor()} fill={ema20.stroke()} />
        <CurrentCoordinate yAccessor={ema50.accessor()} fill={ema50.stroke()} />

        <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={ema20.accessor()} fill={ema20.fill()} />
        <EdgeIndicator itemType="last" orient="right" edgeAt="right" yAccessor={ema50.accessor()} fill={ema50.fill()} />
        <EdgeIndicator
          itemType="last"
          orient="right"
          edgeAt="right"
          yAccessor={(d: any) => d.close}
          fill={(d: any) => (d.close > d.open ? '#6BA583' : '#FF0000')}
        />
        <EdgeIndicator itemType="first" orient="left" edgeAt="left" yAccessor={ema20.accessor()} fill={ema20.fill()} />
        <EdgeIndicator itemType="first" orient="left" edgeAt="left" yAccessor={ema50.accessor()} fill={ema50.fill()} />
        <EdgeIndicator
          itemType="first"
          orient="left"
          edgeAt="left"
          yAccessor={(d: any) => d.close}
          fill={(d: any) => (d.close > d.open ? '#6BA583' : '#FF0000')}
        />

        <MouseCoordinateX at="top" orient="top" displayFormat={timeFormat('%Y-%m-%d')} />
        <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
        <MouseCoordinateY at="right" orient="right" displayFormat={format('.2f')} />
        <MouseCoordinateY at="left" orient="left" displayFormat={format('.2f')} />

        <OHLCTooltip origin={[-40, -65]} />
        <MovingAverageTooltip
          onClick={(e: any) => console.log(e)}
          origin={[-38, 15]}
          options={[
            {
              yAccessor: ema20.accessor(),
              type: ema20.type(),
              stroke: ema20.stroke(),
              windowSize: ema20.options().windowSize
            },
            {
              yAccessor: ema50.accessor(),
              type: ema50.type(),
              stroke: ema50.stroke(),
              windowSize: ema50.options().windowSize
            }
          ]}
        />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default ChartView;
