import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes';
import 'chartjs-plugin-datalabels';
import * as ChartGeo from 'chartjs-chart-geo';

import CategoryChart from './CategoryChart';
import CategoryMonthsChart from './CategoryMonthsChart';
import CategoryTimeChart from './CategoryTimeChart';
import CategoryYearsChart from './CategoryYearsChart';
import CompanyChart from './CompanyChart';
import ProductChart from './ProductChart';
import PriceMonthsChart from './PriceMonthsChart';
import CountryChart from './CountryChart';
import StationChart from './StationChart';
import GeoMapChart from './GeoMapChart';
import CompanyShareChart from './CompanyShareChart';
import ClientMixChart from './ClientMixChart';
import ProductsMixChart from './ProductsMixChart';

interface ColorSchemesType {
    [propName: string]: any;
}

interface TopoJSONType {
    [propName: string]: any;
}

class ColorSchemes {
    static getColorSchemes(): ColorSchemesType {
        return Chart["colorschemes"];
    }
}

function getTopoJSON() {
    return ChartGeo.topojson;
}

const formatter = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;

Chart.plugins.register({
	afterDraw(chart: any) {
        if (chart.data.datasets.length === 0 || chart.data.datasets[0].data.length === 0) {
            // No data is present
            const ctx = chart.chart.ctx;
            const width = chart.chart.width;
            const height = chart.chart.height;
            chart.clear();

            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = "16px normal 'Arial'";
            ctx.fillText('Sin datos', width / 2, height / 2);
            ctx.restore();
        }
  }
});

export {
    ColorSchemes, TopoJSONType, ColorSchemesType, getTopoJSON, formatter,
    CategoryChart, CategoryMonthsChart, StationChart,
    CategoryTimeChart, CategoryYearsChart, CompanyChart, ProductChart,
    GeoMapChart, PriceMonthsChart, CountryChart, CompanyShareChart, 
    ClientMixChart, ProductsMixChart
};