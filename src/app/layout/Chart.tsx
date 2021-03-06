import React from 'react';

import { format } from 'd3-format';
import { timeFormat } from 'd3-time-format';

// @ts-ignore
import { ChartCanvas, Chart } from 'react-stockcharts';
import {
  BarSeries,
  AreaSeries,
  CandlestickSeries,
  AlternatingFillAreaSeries,
  LineSeries,
  StraightLine
  // @ts-ignore
} from 'react-stockcharts/lib/series';
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
import { LabelAnnotation, Label, Annotate } from 'react-stockcharts/lib/annotation';
// @ts-ignore
import { discontinuousTimeScaleProvider } from 'react-stockcharts/lib/scale';
// @ts-ignore
import { OHLCTooltip, MovingAverageTooltip, SingleValueTooltip } from 'react-stockcharts/lib/tooltip';
// @ts-ignore
import { ema, sma, forceIndex } from 'react-stockcharts/lib/indicator';
// @ts-ignore
import { last } from 'react-stockcharts/lib/utils';

const ChartView = (props: any) => {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  console.log(props);
  // @ts-ignore
  const { data: initialData } = props;
  const width = 1200;
  const ratio = 2;
  const type = 'hybrid';
  const annotationProps = {
    fontFamily: 'Font Awesome 5 Free',
    fontSize: 25,
    fill: 'green',
    opacity: 1,
    // @ts-ignore
    text: 'BUY',
    y: ({ yScale }: any) => {
      console.log(yScale.range());
      return yScale.range()[0];
    },
    onClick: console.log.bind(console),
    tooltip: 'Buy now sucka!'
    // tooltip: (d: any) => timeFormat('%B')(d.date)
    // onMouseOver: console.log.bind(console),
  };

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

  const fi = forceIndex()
    .merge((d: any, c: any) => {
      d.fi = c;
    })
    .accessor((d: any) => d.fi);

  const fiEMA13 = ema()
    .id(1)
    .options({ windowSize: 13, sourcePath: 'fi' })
    .merge((d: any, c: any) => {
      d.fiEMA13 = c;
    })
    .accessor((d: any) => d.fiEMA13);
  const calculatedData = ema20(ema50(smaVolume70(fiEMA13(fi(initialData)))));

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: any) => d.date);
  const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(calculatedData);

  const start = xAccessor(last(data));
  const end = xAccessor(data[Math.max(0, data.length - 150)]);
  const xExtents = [start, end];
  return (
    <ChartCanvas
      height={800}
      ratio={ratio}
      width={width}
      margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
      type={type}
      seriesName="MSFT"
      data={data}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      xExtents={xExtents}
    >
      <Chart
        id={1}
        height={550}
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
        <Annotate
          with={LabelAnnotation}
          when={(d: any) => d.date.getDate() === 1 /* some condition */}
          usingProps={annotationProps}
        />
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
      <Chart id={2} height={150} yExtents={(d: any) => d.volume} origin={(w: any, h: any) => [0, h - 350]}>
        <YAxis axisAt="left" orient="left" ticks={5} tickFormat={format('.2s')} />
        <MouseCoordinateY at="left" orient="left" displayFormat={format('.4s')} />

        <BarSeries
          yAccessor={(d: any) => d.volume}
          fill={(d: any) => (d.close > d.open ? '#6BA583' : '#FF0000')}
          opacity={0.5}
        />
      </Chart>
      <Chart
        id={3}
        height={100}
        yExtents={fi.accessor()}
        origin={(w: any, h: any) => [0, h - 200]}
        padding={{ top: 10, right: 0, bottom: 10, left: 0 }}
      >
        <XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
        <YAxis axisAt="right" orient="right" ticks={4} tickFormat={format('.2s')} />
        <MouseCoordinateY at="right" orient="right" displayFormat={format('.4s')} />

        <AreaSeries baseAt={(scale: any) => scale(0)} yAccessor={fi.accessor()} />
        <StraightLine yValue={0} />

        <SingleValueTooltip
          yAccessor={fi.accessor()}
          yLabel="ForceIndex (1)"
          yDisplayFormat={format('.4s')}
          origin={[-40, 15]}
        />
      </Chart>
      <Chart
        id={4}
        height={100}
        yExtents={fiEMA13.accessor()}
        origin={(w: any, h: any) => [0, h - 100]}
        padding={{ top: 10, right: 0, bottom: 10, left: 0 }}
      >
        <XAxis axisAt="bottom" orient="bottom" />
        <YAxis axisAt="right" orient="right" ticks={4} tickFormat={format('.2s')} />

        <MouseCoordinateX at="bottom" orient="bottom" displayFormat={timeFormat('%Y-%m-%d')} />
        <MouseCoordinateY at="right" orient="right" displayFormat={format('.4s')} />

        {/* <AreaSeries baseAt={scale => scale(0)} yAccessor={fiEMA13.accessor()} /> */}
        <AlternatingFillAreaSeries baseAt={0} yAccessor={fiEMA13.accessor()} />
        <StraightLine yValue={0} />

        <SingleValueTooltip
          yAccessor={fiEMA13.accessor()}
          yLabel={`ForceIndex (${fiEMA13.options().windowSize})`}
          yDisplayFormat={format('.4s')}
          origin={[-40, 15]}
        />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export default ChartView;
